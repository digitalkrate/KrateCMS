import { default as express, Request, Response as Response } from 'express';
import callsite from 'callsite';
import path from 'path';
import fs from 'fs';

import { Router, Theme, Themes } from 'kratecms';
import { EventEmitter } from 'kratecms/events';
import { forEachPromise } from 'kratecms/utils';

class Core extends EventEmitter {

  private app;

  public static instance = new Core();

  private DEFAULT_CONFIG: any = {
    coreDir: __dirname,
    webDir: '',
    currentTheme: 'Krate2018'
  };
  private CONFIG: any = {};

  private CONFIG_FILE = path.join(__dirname, 'config.json');

  public join = path.join; // Purely to save additional imports

  constructor() {
    super();

    this.init();
  }

  private async init() {
    this.CONFIG = await this.getConfig() || this.DEFAULT_CONFIG;
    this.CONFIG.coreDir = __dirname;
    await this.saveConfig(this.CONFIG);

    this.emit('loaded');
  }

  public async serve(webDir: string, port: number = 3000): Promise<void> {
    return new Promise<void>(async resolve => {
      this.app = express(); // TODO: Use{ standard HTTP instead of Express?

      this.CONFIG.webDir = webDir;
      await this.saveConfig(this.CONFIG);

      // Middleware
      this.app.use(Router);
      this.app.use('/static', this.serveStatic());

      this.app.listen(port, (): void => {
        console.log('KrateCMS listening on 0.0.0.0:%d', port);
        resolve();
      });
    });
  }

  private serveStatic() {
    const that = this;

    return (req: Request, res: Response, next: Function) => {
      const theme = that.theme();
      if(req.url.startsWith('/theme/')) {
        const resource = req.url.replace('/theme/', '');
        const promises: Promise<void>[] = [];
        let sent: boolean = false;
        promises.push(forEachPromise(Object.keys(theme.assets.styles), key => {
          if(theme.assets.styles[key] === resource) {
            sent = true;
            res.sendFile(that.join(that.get('webDir'), 'themes', theme.dirName, 'assets', theme.assets.styles._base, theme.assets.styles[key]));
          }
        }));
        promises.push(forEachPromise(Object.keys(theme.assets.scripts), key => {
          if(theme.assets.scripts[key] === resource) {
            sent = true;
            res.sendFile(that.join(that.get('webDir'), 'themes', theme.dirName, 'assets', theme.assets.scripts._base, theme.assets.scripts[key]));
          }
        }));
        promises.push(forEachPromise(Object.keys(theme.assets.images), key => {
          if(theme.assets.images[key] === resource) {
            sent = true;
            res.sendFile(that.join(that.get('webDir'), 'themes', theme.dirName, 'assets', theme.assets.images._base, theme.assets.images[key]));
          }
        }));
        Promise.all(promises).then(() => {
          if(!sent) res.sendStatus(404);
        });
      } else {
        res.sendStatus(404);
      }
    };
  }

  private registerStaticPath(path: string, destination: string): void {
    this.app.use(path, express.static(destination));
  }

  public get(configProperty: string): any {
    return this.CONFIG[configProperty] || null;
  }

  public theme(): Theme {
    return Themes.getTheme(this.get('currentTheme'));
  }

  private async saveConfig(config: any): Promise<Error|void> {
    return new Promise<Error|void>((resolve, reject) => {
      fs.writeFile(this.join(this.CONFIG_FILE), JSON.stringify(config), 'utf-8', err => {
        if(err) return reject(err);

        resolve();
      });
    });
  }

  private async getConfig(): Promise<object> {
    return new Promise<object>(async(resolve, reject) => {
      if(fs.existsSync(this.CONFIG_FILE)) {
        resolve(require(this.CONFIG_FILE) || null);
      } else {
        await this.saveConfig(this.DEFAULT_CONFIG);

        resolve(this.DEFAULT_CONFIG);
      }
    });
  }

}

// export default new Core(process.env.JEST ? false : true);
export default Core.instance;

import express from 'express';
import callsite from 'callsite';
import path from 'path';
import fs from 'fs';

import { Router } from 'kratecms';

class Core {

  public static instance = new Core();

  private DEFAULT_CONFIG: any = {
    coreDir: __dirname,
    webDir: '',
    currentTheme: 'Krate2018'
  };
  private CONFIG: any = {};

  private CONFIG_FILE = path.join(__dirname, 'config.json');

  public join = path.join; // Purely to save additional imports

  constructor(registerWatcher: boolean = true) {
    console.log('CORE CONSTRUCT');
    this.CONFIG = this.getConfig();
    // this.CONFIG.webDir = path.dirname(callsite()[1].getFileName());
    this.CONFIG.coreDir = __dirname;
    // this.saveConfig(this.CONFIG);

    if(registerWatcher) this.watch();
  }

  public async serve(webDir: string, port: number = 3000): Promise<void> {
    return new Promise<void>(async resolve => {
      const app = express(); // TODO: Use standard HTTP instead of Express?

      this.CONFIG.webDir = webDir;
      this.saveConfig(this.CONFIG);

      // Middleware
      app.use(Router);

      app.listen(port, (): void => {
        console.log('KrateCMS listening on 0.0.0.0:%d', port);
        resolve();
      });
    });
  }

  public get(configProperty: string): any {
    return this.CONFIG[configProperty] || null;
  }

  private async saveConfig(config: any): Promise<Error|void> {
    return new Promise<Error|void>((resolve, reject) => {
      fs.writeFile(this.join(this.CONFIG_FILE), JSON.stringify(config), 'utf-8', err => {
        if(err) return reject(err);

        resolve();
      });
    });
  }

  private getConfig(): any {
    if(fs.existsSync(this.CONFIG_FILE)) {
      const contents = fs.readFileSync(this.CONFIG_FILE).toString('utf-8');

      if(!contents) return null;

      return JSON.parse(contents) || null;
    } else {
      this.saveConfig(this.DEFAULT_CONFIG);

      return this.DEFAULT_CONFIG;
    }
  }

  private watch() {
    const that = this;
    fs.watch(this.CONFIG_FILE, (eventType, filename) => {
      fs.readFile(this.CONFIG_FILE, function(err, data) {
        that.CONFIG = that.getConfig();
      });
    });
  }

}

// export default new Core(process.env.JEST ? false : true);
export default Core.instance;

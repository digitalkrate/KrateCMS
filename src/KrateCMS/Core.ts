import express from 'express';
import callsite from 'callsite';
import path from 'path';
import fs from 'fs';

import { Router } from 'kratecms';
import { EventEmitter } from 'kratecms/events';

class Core extends EventEmitter {

  public static instance = new Core();

  private DEFAULT_CONFIG: any = {
    coreDir: __dirname,
    webDir: '',
    currentTheme: 'Skeleton'
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
      const app = express(); // TODO: Use standard HTTP instead of Express?

      this.CONFIG.webDir = webDir;
      await this.saveConfig(this.CONFIG);

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

  private async getConfig(): Promise<object> {
    return new Promise<object>(async(resolve, reject) => {
      if(fs.existsSync(this.CONFIG_FILE)) {
        const contents = fs.readFileSync(this.CONFIG_FILE).toString('utf-8');

        if(!contents) return null;

        resolve(JSON.parse(contents) || null);
      } else {
        await this.saveConfig(this.DEFAULT_CONFIG);

        resolve(this.DEFAULT_CONFIG);
      }
    });
  }

}

// export default new Core(process.env.JEST ? false : true);
export default Core.instance;

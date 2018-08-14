import express from 'express';
import path from 'path';
import fs from 'fs';

import { Router } from 'kratecms';

class Core {

  private CONFIG: any = {};

  private static CONFIG_FILE = path.join(__dirname, 'config.json');

  public join = path.join; // Purely to save additional imports

  constructor(registerWatcher: boolean = true) {
    this.CONFIG = Core.getConfig();

    if(registerWatcher) this.watch();
  }

  public async serve(webDir: string, port: number = 3000): Promise<void> {
    return new Promise<void>(async resolve => {
      await this.saveConfig({
        webDir: webDir,
        coreDir: __dirname,
        currentTheme: 'Krate2018'
      });

      const app = express(); // TODO: Use standard HTTP instead of Express?

      // Setup
      app.set('views', this.join(this.get('webDir'), 'themes')); // TODO: Needed?
      app.set('view engine', 'pug'); // TODO: Needed?

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
      fs.writeFile(this.join(Core.CONFIG_FILE), JSON.stringify(config), 'utf-8', err => {
        if(err) return reject(err);

        resolve();
      });
    });
  }

  private static getConfig(): any {
    return JSON.parse(fs.readFileSync(Core.CONFIG_FILE).toString('utf-8') || '') || null;
  }

  private watch() {
    const that = this;
    fs.watch(Core.CONFIG_FILE, (eventType, filename) => {
      fs.readFile(Core.CONFIG_FILE, function(err, data) {
        that.CONFIG = Core.getConfig();
      });
    });
  }

}

export default new Core(process.env.JEST ? false : true);

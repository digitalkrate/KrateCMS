import * as fs from 'fs';

import { Core } from 'kratecms';
import { ThemeManifest } from 'kratecms/interfaces';

export default class Themes {

  private static manifestTemplate = {
    assest: {
      thumbnail: '',
      views: {
        _base: 'views/',
        admin: 'admin'
      },
      styles: {
        _base: 'css/'
      },
      scripts: {
        _base: 'js/'
      },
      images: {
        _base: 'img/'
      }
    }
  };

  public static async getThemes(): Promise<Array<ThemeManifest>> {
    const THEMES_DIR = Core.join(Core.get('webDir'), 'themes');

    return new Promise<Array<ThemeManifest>>(async(resolve, reject) => {
      fs.readdir(THEMES_DIR, (err, files) => {
        if(!files) return resolve([]);

        let themes: Array<ThemeManifest> = [];
        files.forEach(file => {
          const themePath = Core.join(THEMES_DIR, file);
          const manifestPath = Core.join(themePath, 'manifest.json');
          if(fs.existsSync(manifestPath)) {
            // const contents = fs.readFileSync(manifestPath).toString('utf-8');
            // const theme = JSON.parse(contents);
            const theme = require(manifestPath);

            if(!theme || !theme.name || !theme.author || !theme.version || !theme.description) return;

            theme.permissions = theme.permissions || [];
            theme.enabled = theme.name === Core.get('currentTheme');
            theme.urls = {
              enable: '/admin/themes/' + theme.name + '/enable',
              disable: '/admin/themes/' + theme.name + '/disable'
            };
            themes.push(theme);
          }
        });

        resolve(themes);
      });
    });
  }

  public static getThemesSync(): Array<ThemeManifest> {
    const THEMES_DIR = Core.join(Core.get('webDir'), 'themes');
    const files = fs.readdirSync(THEMES_DIR);
    let themes: Array<ThemeManifest> = [];

    files.forEach(file => {
      const themePath = Core.join(THEMES_DIR, file);
      const manifestPath = Core.join(themePath, 'manifest.json');
      if(fs.existsSync(manifestPath)) {
        // const contents = fs.readFileSync(manifestPath).toString('utf-8');
        // const theme = JSON.parse(contents);
        const theme = require(manifestPath);

        if(!theme || !theme.name || !theme.author || !theme.version || !theme.description) return;

        theme.assets = theme.permissions || [];
        theme.enabled = theme.name === Core.get('currentTheme');
        theme.urls = {
          enable: '/admin/themes/' + theme.name + '/enable',
          disable: '/admin/themes/' + theme.name + '/disable'
        };
        themes.push(theme);
      }
    });

    return themes;
  }

}

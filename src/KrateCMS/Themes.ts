import * as fs from "fs";
import deepmerge from "deepmerge";

import { Core, Theme } from "kratecms";
import { ThemeManifest } from "kratecms/interfaces";

export default class Themes {
  private static manifestTemplate = {
    assets: {
      thumbnail: null,
      views: {
        _base: "views/",
        admin: "admin"
      },
      styles: {
        _base: "css/"
      },
      scripts: {
        _base: "js/"
      },
      images: {
        _base: "img/"
      },
      fonts: {
        _base: "font/"
      }
    }
  };

  // TODO: Remove and rename getThemesSync to getThemes
  public static async getThemes(): Promise<Theme[]> {
    const THEMES_DIR = Core.join(Core.path("web"), "themes");

    return new Promise<Theme[]>(async (resolve, reject) => {
      fs.readdir(THEMES_DIR, (err, files) => {
        if (!files) return resolve([]);

        let themes: Theme[] = [];
        files.forEach(file => {
          const themePath = Core.join(THEMES_DIR, file);
          const manifestPath = Core.join(themePath, "manifest.json");
          if (fs.existsSync(manifestPath)) {
            const theme = deepmerge(
              Themes.manifestTemplate,
              require(manifestPath)
            );

            if (
              !theme ||
              !theme.name ||
              !theme.author ||
              !theme.version ||
              !theme.description
            ) {
              return;
            }

            theme.enabled = theme.name === Core.setting("currentTheme");
            theme.urls = {
              enable: "/admin/themes/" + theme.name + "/enable",
              disable: "/admin/themes/" + theme.name + "/disable"
            };
            themes.push(new Theme(theme, file));
          }
        });

        resolve(themes);
      });
    });
  }

  public static getThemesSync(): Theme[] {
    const THEMES_DIR = Core.join(Core.path("web"), "themes");
    const files = fs.readdirSync(THEMES_DIR);
    let themes: Theme[] = [];

    files.forEach(file => {
      const themePath = Core.join(THEMES_DIR, file);
      const manifestPath = Core.join(themePath, "manifest.json");
      if (fs.existsSync(manifestPath)) {
        const theme = deepmerge(Themes.manifestTemplate, require(manifestPath));

        if (
          !theme ||
          !theme.name ||
          !theme.author ||
          !theme.version ||
          !theme.description
        ) {
          return;
        }

        theme.enabled = theme.name === Core.setting("currentTheme");
        theme.urls = {
          enable: "/admin/themes/" + theme.name + "/enable",
          disable: "/admin/themes/" + theme.name + "/disable"
        };
        themes.push(new Theme(theme, file));
      }
    });

    return themes;
  }

  public static getTheme(dirName: string): Theme {
    const THEMES_DIR = Core.join(Core.path("web"), "themes");
    const files = fs.readdirSync(THEMES_DIR);

    const themePath = Core.join(THEMES_DIR, dirName);
    const manifestPath = Core.join(themePath, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      const theme = deepmerge(Themes.manifestTemplate, require(manifestPath));

      if (
        !theme ||
        !theme.name ||
        !theme.author ||
        !theme.version ||
        !theme.description
      ) {
        return;
      }

      theme.enabled = theme.name === Core.setting("currentTheme");
      return new Theme(theme, dirName);
    } else {
      return null;
    }
  }
}

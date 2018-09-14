import { default as express, Request, Response } from "express";
import path from "path";

import { Router, Theme, Themes, Settings } from "kratecms";
import { EventEmitter } from "kratecms/events";
import { forEachPromise } from "kratecms/utils";
import { Mongo } from "kratecms/databases";

class Core extends EventEmitter {
  private app;
  private settings: Settings;

  public static instance = new Core();

  private PATHS: any = {
    core: __dirname
  };

  public join = path.join; // Purely to save additional imports

  constructor() {
    super();

    this.settings = new Settings(this.join(this.PATHS.core, "settings"));
    if (!this.settings.get("currentTheme")) {
      this.settings.set("currentTheme", "Krate2018");
    }

    this.init();
  }

  private async init() {
    // const db = await Mongo.connect(this.setting("database"));
    // console.log(await db.getSetting("currentTheme"));

    this.emitOnce("loaded");
  }

  public async serve(webDir: string, port: number = 3000): Promise<void> {
    return new Promise<void>(async resolve => {
      this.app = express();

      this.PATHS.web = webDir;

      // Middleware
      this.app.use("/static", this.serveStatic());
      this.app.use((req, res, next) => {
        req.authenticated = () => {
          return false;
        };

        if (
          req.url === "/admin/setup" ||
          req.url.startsWith("/admin/login") ||
          req.url.startsWith("/api")
        ) {
          return next();
        }
        res.redirect("/admin/setup");
      });
      this.app.use(Router);

      this.app.listen(port, () => {
        console.log("KrateCMS listening on 0.0.0.0:%d", port);
        resolve();
      });
    });
  }

  private serveStatic() {
    const that = this;

    return (req: Request, res: Response, next: Function) => {
      const theme = that.theme();
      if (req.url.startsWith("/theme/")) {
        const resource = req.url.replace("/theme/", "");
        const parts = resource.split("/");
        const promises: Promise<void>[] = [];
        let sent: boolean = false;
        promises.push(
          forEachPromise(Object.keys(theme.assets.styles), key => {
            if (theme.assets.styles[key] === resource) {
              sent = true;
              res.sendFile(
                that.join(
                  that.path("web"),
                  "themes",
                  theme.dirName,
                  "assets",
                  theme.assets.styles._base,
                  theme.assets.styles[key]
                )
              );
            }
          })
        );
        promises.push(
          forEachPromise(Object.keys(theme.assets.scripts), key => {
            if (theme.assets.scripts[key] === resource) {
              sent = true;
              res.sendFile(
                that.join(
                  that.path("web"),
                  "themes",
                  theme.dirName,
                  "assets",
                  theme.assets.scripts._base,
                  theme.assets.scripts[key]
                )
              );
            }
          })
        );
        promises.push(
          forEachPromise(Object.keys(theme.assets.images), key => {
            if (theme.assets.images[key] === resource) {
              sent = true;
              res.sendFile(
                that.join(
                  that.path("web"),
                  "themes",
                  theme.dirName,
                  "assets",
                  theme.assets.images._base,
                  theme.assets.images[key]
                )
              );
            }
          })
        );
        promises.push(
          forEachPromise(Object.keys(theme.assets.static), key => {
            if (key === parts[0]) {
              sent = true;
              parts.shift();
              res.sendFile(
                that.join(
                  that.path("web"),
                  "themes",
                  theme.dirName,
                  "assets",
                  theme.assets.static[key],
                  ...parts
                )
              );
            }
          })
        );
        Promise.all(promises).then(() => {
          if (!sent) res.sendStatus(404);
        });
      } else {
        res.sendStatus(404);
      }
    };
  }

  private registerStaticPath(path: string, destination: string): void {
    this.app.use(path, express.static(destination));
  }

  public path(pathName: string): string | null {
    return this.PATHS[pathName] || null;
  }

  public setting(settingName: string): any {
    return this.settings.get(settingName);
  }

  public theme(): Theme {
    return Themes.getTheme(this.settings.get("currentTheme", "Krate2018"));
  }
}

// export default new Core(process.env.JEST ? false : true);
export default Core.instance;

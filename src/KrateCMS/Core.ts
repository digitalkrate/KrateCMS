// import { default as express, Request, Response } from "express";
import path from "path";

import { routes, Theme, Themes, Settings } from "kratecms";
import { EventEmitter } from "kratecms/events";
import { forEachPromise } from "kratecms/utils";
import { Mongo } from "kratecms/databases";
import { Router, Request, Response, Server } from "kratecms/server";

class Core extends EventEmitter {
  private server: Server;
  private router: Router;
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
      this.server = new Server();
      this.router = new Router(this.server);

      this.PATHS.web = webDir;

      // // Middleware
      this.server.use((req: Request, res: Response, next) => {
        // req.set("authenticated", () => {
        //   return false;
        // });

        // if (
        //   req.url === "/admin/setup" ||
        //   req.url.startsWith("/admin/login") ||
        //   req.url.startsWith("/api")
        // ) {
        //   return next();
        // }
        // res.redirect("/admin/setup");
        next();
      });
      routes(this.router);
      this.registerThemePaths();

      this.server.listen(Server.ADDR_ALL, port, () => {
        console.log("KrateCMS listening on 0.0.0.0:%d", port);
        resolve();
      });
    });
  }

  private serveAsset(path: string) {
    return (req: Request, res: Response) => {
      res.sendFile(path);
    };
  }

  private async registerThemePaths() {
    const theme = this.theme();
    const baseDir = this.join(
      this.path("web"),
      "themes",
      theme.dirName,
      "assets"
    );
    const baseUrl = "/static/theme";

    const stylesDir = path.join(baseDir, theme.assets.styles._base);
    const stylesUrl = baseUrl + "/styles/";

    const scriptsDir = path.join(baseDir, theme.assets.scripts._base);
    const scriptsUrl = baseUrl + "/scripts/";

    const imagesDir = path.join(baseDir, theme.assets.images._base);
    const imagesUrl = baseUrl + "/images/";

    const core = this;

    async function register(what: string, rootUrl: string, rootDir: string) {
      return forEachPromise(Object.keys(theme.assets[what]), key => {
        const dest = theme.assets[what][key].replace(/(\\)/g, "/");
        core.router.get(
          rootUrl + dest,
          core.serveAsset(core.join(rootDir, dest))
        );
      });
    }

    return Promise.all([
      register("styles", stylesUrl, stylesDir),
      register("scripts", scriptsUrl, scriptsDir),
      register("images", imagesUrl, imagesDir)
    ]);
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

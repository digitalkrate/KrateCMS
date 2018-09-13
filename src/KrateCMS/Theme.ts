import { ThemeManifest } from "kratecms/interfaces";
import { forEachPromise } from "kratecms/utils";
import { EventEmitter } from "kratecms/events";

export default class Theme extends EventEmitter {
  public name: string;
  public description: string;
  public author: string;
  public version: string;
  public assets: any;
  public enabled: boolean;

  public dirName: string;
  public locals: any;

  public constructor(manifest: ThemeManifest, dirName: string) {
    super();

    this.name = manifest.name;
    this.description = manifest.description;
    this.author = manifest.author;
    this.version = manifest.version;
    this.assets = manifest.assets;
    this.enabled = manifest.enabled;

    this.dirName = dirName;
    this.locals = JSON.parse(JSON.stringify(this.assets)); // Deep clone
    delete this.locals.thumbnail;
    delete this.locals.views._base;
    delete this.locals.styles._base;
    delete this.locals.scripts._base;
    delete this.locals.images._base;

    this.absoluteify(
      this.locals.styles,
      this.locals.scripts,
      this.locals.images
    );
    console.log(this.locals);
  }

  private absoluteify(...assets) {
    assets.forEach(async asset => {
      Object.keys(asset).forEach(async key => {
        if (
          asset[key].startsWith("http://") ||
          asset[key].startsWith("https://") ||
          asset[key].startsWith("//")
        ) {
          return;
        }

        asset[key] =
          "/static/theme" +
          (asset[key].startsWith("/") ? "" : "/") +
          asset[key];
      });
    });
  }
}

import { Request, Response } from "express";

import { Core, RenderEngine, Theme } from "kratecms";
import { EventEmitter, Pages } from "kratecms/events";
import { MetaItem } from "kratecms/interfaces";
import { Pug } from "kratecms/render-engines";

export default class Page {
  public engine: RenderEngine;

  protected locals: any = {};

  // TODO: Make enum{'public'|'admin'}
  protected type: string = "public";
  protected theme: Theme;
  protected view: string;

  protected meta: MetaItem[] = [];

  protected styles: string[] = [];
  protected scripts: string[] = [];

  protected req: any;
  protected res: any;

  constructor(req: Request, res: Response) {
    this.req = req;
    // this.res = new Response(res);
    this.res = res;
    this.theme = Core.theme();
    this.engine = new Pug(this.theme);

    const initResponse = this.init();

    if (initResponse === undefined || !!initResponse)
      this.compile(this.req, this.res, this.locals);
  }

  private async compile(req: Request, res: Response, locals: Object = {}) {
    await this.emitWait("render", this);
    res.send(this.engine.compile(this.page(this.view), locals));
    this.emit("rendered");
  }

  protected page(page: string): string {
    let joinArgs = [
      Core.path("web"),
      "themes",
      this.theme.dirName,
      this.theme.assets.views._base
    ];

    if (this.type === "admin") joinArgs.push(this.theme.assets.views.admin);

    return Core.join(...joinArgs, page);
  }

  protected init() {}

  protected emit(event: string, ...args: any[]) {
    if (this.type === "public") return Pages.Public.emit(event, ...args);
    else if (this.type === "admin") return Pages.Admin.emit(event, ...args);
  }

  protected emitWait(event: string, ...args: any[]) {
    if (this.type === "public") return Pages.Public.emitWait(event, ...args);
    else if (this.type === "admin") return Pages.Admin.emitWait(event, ...args);
  }

  public addMeta(name: string, content: string): void {
    this.meta.push({
      name,
      content
    });
  }

  public getMeta(): MetaItem[] {
    return this.meta;
  }

  public getMetaItem(name: string): MetaItem | undefined {
    return this.meta[name];
  }

  public addStyle(href: string) {
    this.styles.push(href);
  }

  public addScript(src: string) {
    this.scripts.push(src);
  }
}

import { Request, Response as Response } from 'express';

import { Core, RenderEngine } from 'kratecms';
import { EventEmitter, Pages } from 'kratecms/events';
import { MetaItem } from 'kratecms/interfaces';

export default class Page {

  public engine: RenderEngine;

  protected locals: any = {};

  // TODO: Make enum{'public'|'admin'}
  protected type: string = 'public';

  protected meta: MetaItem[] = [];

  protected styles: string[] = [];
  protected scripts: string[] = [];

  protected req: Request;
  protected res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    // this.res = new Response(res);
    this.res = res;

    this.init();

    this.compile(this.req, this.res, this.locals);
  }

  private async compile(req: Request, res: Response, locals: Object = {}) {
    await this.emitWait('render', this);
    res.send(this.engine.compile(locals));
    this.emit('rendered');
  }

  protected page(page: string): string {
    let joinArgs = [Core.get('webDir'), 'themes', Core.get('currentTheme')];

    if(this.type === 'admin') joinArgs.push('admin');

    return Core.join(...joinArgs, page);
  }

  protected init() {}

  protected emit(event: string, ...args: any[]) {
    if(this.type === 'public') return Pages.Public.emit(event, ...args);
    else if(this.type === 'admin') return Pages.Admin.emit(event, ...args);
  }

  protected emitWait(event: string, ...args: any[]) {
    if(this.type === 'public') return Pages.Public.emitWait(event, ...args);
    else if(this.type === 'admin') return Pages.Admin.emitWait(event, ...args);
  }

  public addMeta(name: string, content: string): void {
    this.meta.push({
      name, content
    });
  }

  public getMeta(): MetaItem[] {
    return this.meta;
  }

  public getMetaItem(name: string): MetaItem|undefined {
    return this.meta[name];
  }

  public addStyle(href: string) {
    this.styles.push(href);
  }

  public addScript(src: string) {
    this.scripts.push(src);
  }

}

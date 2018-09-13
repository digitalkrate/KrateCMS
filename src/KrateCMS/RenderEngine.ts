import { Theme } from "kratecms";
import { EventEmitter } from "kratecms/events";

export default class RenderEngine extends EventEmitter {
  protected locals: any;

  constructor(theme: Theme) {
    super();

    this.locals = theme.locals || {};
  }

  public compile(file: string, locals: Object): string {
    this.locals = Object.assign({}, this.locals, locals);
    return "";
  }
}

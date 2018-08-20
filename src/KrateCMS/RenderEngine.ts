import { Theme } from 'kratecms';

export default class RenderEngine {

  protected locals: any;

  constructor(theme: Theme) {
    this.locals = theme.locals || {};
  }

  public compile(file: string, locals: Object): string {
    this.locals = Object.assign({}, this.locals, locals);
    return '';
  }

}

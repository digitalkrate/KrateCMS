import pug from 'pug';

import { RenderEngine, Theme } from 'kratecms';

export default class Pug extends RenderEngine {

  private file: string;

  constructor(theme: Theme) {
    super(theme);
  }

  public compile(file: string, locals: Object): string {
    super.compile(file, locals);

    if(!file.endsWith('.pug')) file += '.pug';

    return pug.renderFile(file, this.locals);
  }

}

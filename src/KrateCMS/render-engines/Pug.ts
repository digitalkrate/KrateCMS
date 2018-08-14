import pug from 'pug';

import { RenderEngine } from 'kratecms';

export default class Pug extends RenderEngine {

  private file: string;

  constructor(file: string) {
    super(file);

    if(!file.endsWith('.pug')) file += '.pug';

    this.file = file;
  }

  public compile(locals: Object): string {
    return pug.renderFile(this.file, locals);
  }

}

import { Core } from 'kratecms';

export class RenderEngine {

  protected readonly THEMES_DIR: string = Core.join(Core.get('webDir'), 'themes');
  protected readonly CURRENT_THEME: string = Core.get('currentTheme');

  constructor(file: string) { }

  public compile(locals: Object): string {
    // Throw an exception as this class is strictly for use by extension.
    throw('This RenderEngine lacks a compile() method.');
  }

}

export default RenderEngine;

import { Request, Response } from 'express';

import { Themes as _Themes } from 'kratecms';
import { Page } from 'kratecms/pages';
import { Pug } from 'kratecms/render-engines';

export default class Themes extends Page {

  init() {
    this.type = 'admin';
    this.engine = new Pug(this.page('themes'));
    this.locals.themes = _Themes.getThemesSync();
  }

}

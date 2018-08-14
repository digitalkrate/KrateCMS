import { Request, Response } from 'express';

import { Page } from 'kratecms/pages';
import { Pug } from 'kratecms/render-engines';

export default class Dashboard extends Page {

  init() {
    this.type = 'admin';
    this.engine = new Pug(this.page('dashboard'));
  }

}

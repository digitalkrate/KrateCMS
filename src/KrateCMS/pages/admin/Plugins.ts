import { Request, Response } from 'express';

import { Plugins as Plugs } from 'kratecms';
import { Page } from 'kratecms/pages';
import { Pug } from 'kratecms/render-engines';

export default class Plugins extends Page {

  async init() {
    this.type = 'admin';
    this.engine = new Pug(this.page('plugins'));
    this.locals.plugins = Plugs.getPluginsSync();
  }

}

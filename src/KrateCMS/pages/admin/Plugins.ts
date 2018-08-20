import { Request, Response } from 'express';

import { Plugins as Plugs } from 'kratecms';
import { Page } from 'kratecms/pages';
import { Pug } from 'kratecms/render-engines';

export default class Plugins extends Page {

  init() {
    this.type = 'admin';
    this.view = 'plugins';
    this.locals.plugins = Plugs.getPluginsSync();
  }

}

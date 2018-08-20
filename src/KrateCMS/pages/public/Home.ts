import { Request, Response } from 'express';

import { Page } from 'kratecms/pages';
import { Pug } from 'kratecms/render-engines';

export default class Home extends Page {

  init() {
    this.view = 'index';
  }

}

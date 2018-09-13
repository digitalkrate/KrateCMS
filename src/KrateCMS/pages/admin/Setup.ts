import { Request, Response } from "express";

import { Page } from "kratecms/pages";
import { Pug } from "kratecms/render-engines";

export default class Setup extends Page {
  init() {
    this.type = "admin";
    this.view = "setup";
    // if(!this.req.authenticated()) {
    //   this.res.redirect('/admin/login?continue=/admin/setup');
    //   return false;
    // }
  }
}

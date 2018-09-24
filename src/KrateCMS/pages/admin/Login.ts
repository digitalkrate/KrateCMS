import { Request, Response } from "express";

import { Page } from "kratecms/pages";
import { Pug } from "kratecms/render-engines";

export default class Login extends Page {
  init() {
    this.type = "admin";
    this.view = "login";
    // if(this.req.authenticated()) {
    //   const redirectTo = this.req.query.continue ? (this.req.query.continue.startsWith('/') ? this.req.query.continue : '/admin') : '/admin';
    //   this.res.redirect(redirectTo);
    //   return false;
    // }
  }
}

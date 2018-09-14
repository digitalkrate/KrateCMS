import { Router as _Router, Request, Response } from "express";

import { Api } from "kratecms";
import { Page } from "kratecms/pages";
import * as Pages from "kratecms/pages";

function serve(page: typeof Page) {
  return (req: Request, res: Response) => new page(req, res);
}

const Router = _Router();

// Routes
Router.get("/", serve(Pages.Public.Home));

// Admin Routes
Router.get("/admin", serve(Pages.Admin.Dashboard));
Router.get("/admin/login", serve(Pages.Admin.Login));
Router.get("/admin/setup", serve(Pages.Admin.Setup));
Router.get("/admin/plugins", serve(Pages.Admin.Plugins));
Router.get("/admin/themes", serve(Pages.Admin.Themes));

// API Routes
Router.get("/api/setup", Api.setup);

export default Router;

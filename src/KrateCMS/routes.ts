import { Request, Response, Router } from "kratecms/server";

import { Api } from "kratecms";
import { Page } from "kratecms/pages";
import * as Pages from "kratecms/pages";

function serve(page: typeof Page) {
  return (req: Request, res: Response) => new page(req, res);
}

export default function routes(router: Router) {
  // Public Routes
  router.get("/", serve(Pages.Public.Home));

  // Admin Routes
  router.get("/admin", serve(Pages.Admin.Dashboard));
  router.get("/admin/login", serve(Pages.Admin.Login));
  router.get("/admin/setup", serve(Pages.Admin.Setup));
  router.get("/admin/plugins", serve(Pages.Admin.Plugins));
  router.get("/admin/themes", serve(Pages.Admin.Themes));

  // API Routes
  router.get("/api/setup", Api.setup);
}

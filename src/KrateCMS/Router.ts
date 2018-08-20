import { Router as _Router, Request, Response } from 'express';

import * as Pages from 'kratecms/pages';

const Router = _Router();

// Routes
Router.get('/', (req: Request, res: Response) => new Pages.Public.Home(req, res));

// Admin Routes
Router.get('/admin', (req: Request, res: Response) => new Pages.Admin.Dashboard(req, res));
Router.get('/admin/plugins', (req: Request, res: Response) => new Pages.Admin.Plugins(req, res));
Router.get('/admin/themes', (req: Request, res: Response) => new Pages.Admin.Themes(req, res));

export default Router;

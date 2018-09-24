import { Server } from "kratecms/server";

import { Route, RouteHandler } from "./types";

export default class Router {
  private server: Server;

  constructor(server: Server) {
    this.server = server;
  }

  private createRoute(
    url: Route["url"],
    method: Route["method"],
    handler: Route["handler"]
  ): Route {
    return {
      url,
      method,
      handler
    };
  }

  public get(url: string, cb: RouteHandler) {
    this.server.addRoute(this.createRoute(url, "GET", cb));
  }

  public post(url: string, cb: RouteHandler) {
    this.server.addRoute(this.createRoute(url, "POST", cb));
  }
}

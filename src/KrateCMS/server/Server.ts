import http2 from "http2";
import fs from "fs";

import { Core } from "kratecms";
import { EventEmitter } from "kratecms/events";
import { Request, Response } from "kratecms/server";

import { Middleware, Route, RouteList } from "./types";

export default class Server extends EventEmitter {
  static ADDR_ALL: string = "0.0.0.0";
  static ADDR_LOCAL: string = "127.0.0.1";

  private server: http2.Http2SecureServer;

  private routes: {
    GET: RouteList;
    POST: RouteList;
    PUT: RouteList;
    DELETE: RouteList;
  } = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {}
  };

  private middleware: Middleware[] = [];

  constructor() {
    super();

    this.initServer();
  }

  private initServer() {
    this.server = http2.createSecureServer(
      {
        key: fs.readFileSync(
          Core.join(Core.path("core"), ".ssl", "kratecms.key")
        ),
        cert: fs.readFileSync(
          Core.join(Core.path("core"), ".ssl", "kratecms.crt")
        )
      },
      this.incoming()
    );
  }

  private incoming() {
    const server = this;

    return async (
      request: http2.Http2ServerRequest,
      response: http2.Http2ServerResponse
    ) => {
      const req = new Request(request);
      const res = new Response(response);

      await server.runAllMiddleware(req, res);
      // console.debug("[KrateCMS][Server][Debug] Middleware executed");

      if (server.routes[request.method.toUpperCase()][request.url]) {
        const route = server.routes[request.method.toUpperCase()][request.url];
        await route.handler.call(route, req, res);
      } else {
        res.status(404);
      }

      res.end();
    };
  }

  private async runAllMiddleware(req: Request, res: Response): Promise<void> {
    return new Promise<void>(async resolve => {
      if (this.middleware.length > 0) {
        await this.runMiddleware(this.middleware[0], req, res);
      }

      resolve();
    });
  }

  private runMiddleware(
    ware: Middleware,
    req: Request,
    res: Response
  ): Promise<void> {
    const promise = new Promise<void>(async resolve => {
      if (ware) {
        const last = ware.id === this.middleware.length - 1;

        if (ware.url && !req.url.startsWith(ware.url)) {
          if (!last)
            await this.runMiddleware(this.middleware[ware.id + 1], req, res);
        } else {
          await ware.handler.call(ware, req, res, async () => {
            if (!last)
              await this.runMiddleware(this.middleware[ware.id + 1], req, res);
          });
        }
        resolve();
      } else {
        resolve();
      }
    });

    return promise;
  }

  public addRoute(route: Route) {
    this.routes[route.method][route.url] = route;
  }

  public use(handler: Middleware["handler"], url?: Middleware["url"]) {
    this.middleware.push({
      id: this.middleware.length,
      url: url,
      handler: handler
    });
  }

  public listen(address: string, port: number, cb?: () => void) {
    this.server.listen(port, address, () => {
      console.log(
        "[KrateCMS][Server][Info] Server listening on https://%s:%d",
        address,
        port
      );
      if (cb) cb.call(cb);
    });
  }
}

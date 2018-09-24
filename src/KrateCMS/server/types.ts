import { Request, Response } from "kratecms/server";

export type Route = {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: RouteHandler;
};

export type RouteHandler = (req: Request, res: Response) => any;

export type Middleware = {
  id: number;
  url?: string;
  handler: (req: Request, res: Response, next: () => void) => any;
};

export type RouteList = { [url: string]: Route };

export type HttpStatus =
  | HttpInformationalStatus
  | HttpSuccessStatus
  | HttpRedirectStatus
  | HttpClientErrorStatus
  | HttpServerErrorStatus;
export type HttpInformationalStatus = 100 | 101 | 102;
export type HttpSuccessStatus =
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226;
export type HttpRedirectStatus = 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308;
export type HttpClientErrorStatus =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 444
  | 451
  | 499;
export type HttpServerErrorStatus =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511
  | 599;

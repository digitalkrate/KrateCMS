import http2 from "http2";

export default class Request {
  private req: http2.Http2ServerRequest;

  private settings = {};

  constructor(req: http2.Http2ServerRequest) {
    this.req = req;
  }

  get url() {
    return this.req.url;
  }

  public set(key: string, value: any): void {
    this.settings[key] = value;
  }

  public get(key: string): any {
    return this.settings[key];
  }
}

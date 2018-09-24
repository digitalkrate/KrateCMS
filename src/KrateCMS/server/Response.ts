import http2 from "http2";
import fs from "fs";

import { getMimeType } from "kratecms/utils";

import { HttpStatus, HttpRedirectStatus } from "./types";

export default class Response {
  private res: http2.Http2ServerResponse;
  private payload: string = "";

  constructor(res: http2.Http2ServerResponse) {
    this.res = res;
  }

  public send(payload: string | Object): this {
    if (typeof payload === "string") this.payload += payload;
    else this.payload += JSON.stringify(payload);

    return this;
  }

  public sendFile(urn: string): this {
    const file = fs.readFileSync(urn).toString();
    this.payload += file;

    const ext = urn.split(".").pop();
    this.header("Content-Type", getMimeType(ext));

    return this;
  }

  // TODO: Make `status` type more strict to prevent invalid codes
  public status(status: HttpStatus): this {
    this.res.statusCode = status;

    return this;
  }

  public header(name: string, value: string | string[] | number): this {
    this.res.setHeader(name, value);

    return this;
  }

  public redirect(uri: string, code: HttpRedirectStatus = 301): this {
    if (!this.res.headersSent) {
      this.status(code);
      this.header("Location", uri);
    }

    return this;
  }

  public end(): void {
    this.res.write(this.payload);
    this.res.end();
  }
}

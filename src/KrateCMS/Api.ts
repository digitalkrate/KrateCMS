import { Request, Response } from "kratecms/server";

export default class Api {
  public static setup(req: Request, res: Response): void {
    res.send({
      this: "is a test"
    });
  }
}

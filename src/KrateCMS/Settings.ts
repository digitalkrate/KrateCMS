import { default as NoSQL } from "nosql";

export default class Settings {
  private db;

  constructor(file: string) {
    this.db = NoSQL.load(file);
  }

  public get(setting: string, _default?: any): any {
    const result = this.db.meta(setting);
    if (!result) return this.set(setting, _default);
    return result;
  }

  public set(setting: string, value: any): any {
    this.db.meta(setting, value);
    return value;
  }
}

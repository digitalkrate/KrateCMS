import { MongoClient, Db } from "mongodb";

import { IDatabase, IDatabaseConfig } from "kratecms/interfaces";

class Mongo implements IDatabase {
  private client: MongoClient;
  private db: Db;

  public async connect(config?: IDatabaseConfig): Promise<this> {
    return new Promise<this>(async (resolve, reject) => {
      MongoClient.connect(
        this.urlify(config),
        {
          useNewUrlParser: true
        },
        (err, client) => {
          if (err) return reject(err);

          this.client = client;
          this.db = this.client.db(config.database || "kratecms");
          resolve(this);
        }
      );
    });
  }

  private urlify(config?: IDatabaseConfig): string {
    if (!config) config = {};
    return (
      "mongodb://" +
      (config.username
        ? config.username + (config.password ? ":" + config.password : "") + "@"
        : "") +
      (config.host || "127.0.0.1") +
      ":" +
      (config.port || "27017") +
      (config.database ? "/" + config.database : "")
    );
  }

  async getSetting(setting: string, _default?: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      _default = _default || null;

      resolve(_default);
    });
  }
}

export default new Mongo();

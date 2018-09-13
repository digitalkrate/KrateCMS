import { IDatabaseConfig } from "kratecms/interfaces";

export default interface IDatabase {
  connect(config: IDatabaseConfig): Promise<this>;

  getSetting(setting: string, _default?: string): Promise<string>;
}

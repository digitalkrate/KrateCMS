import { Page } from "kratecms/pages";

export default class Setup extends Page {
  init() {
    this.type = "admin";
    this.view = "setup";
  }
}

import assert from "assert";
import path from "path";

import { Core } from "kratecms";
const coreDir = path.join(__dirname, "..", "src", "KrateCMS");

describe("Core", () => {
  describe("#path('core')", () => {
    it("should equal '" + coreDir + "'", () => {
      Core.on("loaded", () => {
        assert.equal(Core.path("core"), coreDir);
      });
    });
  });
  describe("#setting('currentTheme')", () => {
    it("should equal 'Krate2018'", () => {
      Core.on("loaded", () => {
        assert.equal(Core.setting("currentTheme"), "Krate2018");
      });
    });
  });
});

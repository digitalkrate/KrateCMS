import assert from "assert";
import path from "path";

import { Core, Settings } from "kratecms";
const settings = new Settings(
  path.join(__dirname, "..", "src", "KrateCMS", "settings")
);

describe("Settings", () => {
  describe("#get('currentTheme')", () => {
    it("should equal 'Krate2018'", () => {
      Core.on("loaded", () => {
        assert.equal(Settings.get("currentTheme"), "Krate2018");
      });
    });
  });
  describe("#set('test', 'just testing')", () => {
    it("should equal 'just testing'", () => {
      Core.on("loaded", () => {
        assert.equal(Settings.set("test", "just testing"), "just testing");
      });
    });
  });
  describe("#get('test')", () => {
    it("should equal 'just testing'", () => {
      Core.on("loaded", () => {
        assert.equal(Settings.get("test"), "just testing");
      });
    });
  });
});

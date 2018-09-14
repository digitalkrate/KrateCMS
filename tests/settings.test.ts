import assert from "assert";
import path from "path";

import { Core, Settings } from "kratecms";
const settings = new Settings(path.join(__dirname, "settings"));

describe("Settings", () => {
  describe("#set('test', 'just testing')", () => {
    it("should equal 'just testing'", () => {
      Core.on("loaded", () => {
        assert.equal(settings.set("test", "just testing"), "just testing");
      });
    });
  });
  describe("#get('test')", () => {
    it("should equal 'just testing'", () => {
      Core.on("loaded", () => {
        assert.equal(settings.get("test"), "just testing");
      });
    });
  });
});

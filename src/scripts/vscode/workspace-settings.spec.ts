import { describe, test, expect, afterEach } from "vitest";
import { run } from "./workspace-settings.js";
import { existsSync } from "fs";
import { rm } from "fs/promises";

describe("workspace-settings", () => {
  const parentDir = new URL(".", import.meta.url);
  const testPath = new URL("./.vscode/", parentDir);

  afterEach(async () => {
    if (existsSync(testPath)) {
      await rm(testPath, { recursive: true, force: true });
    }
  });

  test("it should work", () => {
    expect(() => run({ rootDir: parentDir.toString() })).not.toThrowError();
  });
});

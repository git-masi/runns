import { describe, test, expect, afterEach } from "vitest";
import { run } from "./workspace-settings.js";
import { existsSync } from "fs";
import { rm } from "fs/promises";

describe("workspace-settings", () => {
  const parentDir = new URL(".", import.meta.url);
  const testPath = new URL("./.vscode/", parentDir);
  const settingsPath = new URL("./settings.json", testPath);

  afterEach(async () => {
    if (existsSync(testPath)) {
      await rm(testPath, { recursive: true, force: true });
    }
  });

  test("it should create a new .vscode directory if not exists", async () => {
    await run({ rootDir: parentDir.toString() });
    expect(existsSync(testPath)).toBe(true);
  });

  test("it should create a new settings.json file if not exists", async () => {
    await run({ rootDir: parentDir.toString() });
    expect(existsSync(settingsPath)).toBe(true);
  });
});

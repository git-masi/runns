import { describe, test, expect, afterEach } from "vitest";
import { run } from "./workspace-settings.js";
import { existsSync } from "fs";
import { readFile, rm } from "fs/promises";

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

  test("a new settings.json file should have the default values", async () => {
    await run({ rootDir: parentDir.toString() });

    const createdSettings = await readFile(settingsPath, { encoding: "utf-8" });
    const defaultSettings = await readFile(
      new URL("./settings.json", parentDir),
      { encoding: "utf-8" }
    );

    expect(JSON.parse(createdSettings)).toMatchObject(
      JSON.parse(defaultSettings)
    );
  });
});

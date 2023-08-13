import { describe, test, expect, afterEach } from "vitest";
import { run } from "./workspace-settings.js";
import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

describe("workspace-settings", async () => {
  const parentDir = new URL(".", import.meta.url);
  const rootDir = fileURLToPath(parentDir);
  const testPath = join(rootDir, ".vscode");
  const settingsPath = join(testPath, "settings.json");
  const defaultSettings = await readFile(join(rootDir, "settings.json"), {
    encoding: "utf-8",
  });

  afterEach(async () => {
    if (existsSync(testPath)) {
      await rm(testPath, { recursive: true, force: true });
    }
  });

  test("it should create a new .vscode directory if not exists", async () => {
    await run({ rootDir });
    expect(existsSync(testPath)).toBe(true);
  });

  test("it should create a new settings.json file if not exists", async () => {
    await run({ rootDir });
    expect(existsSync(settingsPath)).toBe(true);
  });

  test("a new settings.json file should have the default values", async () => {
    await run({ rootDir });

    const createdSettings = await readFile(settingsPath, { encoding: "utf-8" });

    expect(JSON.parse(createdSettings)).toMatchObject(
      JSON.parse(defaultSettings)
    );
  });

  test("an existing settings.json file should have missing default values added", async () => {
    const parsedDefaultSettings = JSON.parse(defaultSettings);
    const nonDefaultSettings = { "editor.cursorBlinking": "expand" };

    // This check ensures that the test case doesn't become a default setting in the future
    expect(
      Object.keys(nonDefaultSettings).every(
        (k) => !(k in parsedDefaultSettings)
      )
    );

    await mkdir(testPath);
    await writeFile(settingsPath, JSON.stringify(nonDefaultSettings, null, 2));

    await run({ rootDir });

    const createdSettings = await readFile(settingsPath, { encoding: "utf-8" });

    expect(JSON.parse(createdSettings)).toMatchObject({
      ...parsedDefaultSettings,
      ...nonDefaultSettings,
    });
  });
});

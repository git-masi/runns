import { rm, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { getChoicesFromDir } from "./file-system.js";
import { fileURLToPath } from "node:url";
import inquirer from "inquirer";

describe("file system tests", () => {
  const testPath = new URL("./test/", import.meta.url);

  beforeEach(async () => {
    await mkdir(testPath);
  });

  afterEach(async () => {
    if (existsSync(testPath)) {
      await rm(testPath, { recursive: true, force: true });
    }
  });

  test("the test directory should be created before each test", () => {
    expect(existsSync(testPath)).toBe(true);
  });

  test("given only one file in the test dir it should return an array with the file name", async () => {
    const scriptName = "script-one.ts";

    await writeFile(new URL(scriptName, testPath), "");

    const result = await getChoicesFromDir(fileURLToPath(testPath));

    expect(result).toMatchObject([scriptName]);
  });

  test("given two files in the test dir it should return an array with both file names", async () => {
    const scriptName1 = "script-one.ts";
    const scriptName2 = "script-two.ts";

    await Promise.all(
      [scriptName1, scriptName2].map((name) =>
        writeFile(new URL(name, testPath), "")
      )
    );

    const result = await getChoicesFromDir(fileURLToPath(testPath));

    expect(result).toMatchObject([scriptName1, scriptName2]);
  });

  test("given one sub dir in the test dir it should return an array with one `inquirer.Separator`", async () => {
    await mkdir(new URL("./subDir/", testPath));

    const result = await getChoicesFromDir(fileURLToPath(testPath));

    result.forEach((el) => expect(el).toBeInstanceOf(inquirer.Separator));
  });

  test("given a JSON file it should return an empty array", async () => {
    const scriptName = "data.json";

    await writeFile(new URL(scriptName, testPath), '{ "test": true }');

    const result = await getChoicesFromDir(fileURLToPath(testPath));

    expect(result.length).toBe(0);
  });

  test("given test files it should return an empty array", async () => {
    const scriptName1 = "data.spec.ts";
    const scriptName2 = "data.test.ts";

    await Promise.all(
      [scriptName1, scriptName2].map((name) =>
        writeFile(new URL(name, testPath), '{ "test": true }')
      )
    );

    const result = await getChoicesFromDir(fileURLToPath(testPath));

    expect(result.length).toBe(0);
  });
});

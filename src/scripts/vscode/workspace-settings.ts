import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";

export async function run<
  T extends {
    rootDir: string;
  }
>(params: T) {
  const parentDir = new URL(".", import.meta.url);
  const dotvscodePath = new URL("./.vscode/", params.rootDir);
  const settingsPath = new URL("./settings.json", dotvscodePath);
  const defaultSettings = await readFile(
    new URL("./settings.json", parentDir),
    {
      encoding: "utf-8",
    }
  );

  if (!existsSync(dotvscodePath)) {
    await mkdir(dotvscodePath);
  }

  if (!existsSync(settingsPath)) {
    await writeFile(settingsPath, defaultSettings);
  } else {
    const parsedDefaultSettings = JSON.parse(defaultSettings);
    const existingSettings = JSON.parse(
      await readFile(settingsPath, { encoding: "utf-8" })
    );
    await writeFile(
      settingsPath,
      JSON.stringify({ ...parsedDefaultSettings, ...existingSettings }, null, 2)
    );
  }
}

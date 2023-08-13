import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

export async function run<
  T extends {
    rootDir: string;
  }
>(params: T) {
  const parentDir = fileURLToPath(new URL(".", import.meta.url));
  const dotvscodePath = join(params.rootDir, ".vscode/");
  const settingsPath = join(dotvscodePath, "settings.json");
  const defaultSettings = await readFile(join(parentDir, "settings.json"), {
    encoding: "utf-8",
  });

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

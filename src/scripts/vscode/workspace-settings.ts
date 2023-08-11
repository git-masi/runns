import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";

export async function run<
  T extends {
    rootDir: string;
  }
>(params: T) {
  const dotvscodePath = new URL("./.vscode/", params.rootDir);
  const settingsPath = new URL("./settings.json", dotvscodePath);

  if (!existsSync(dotvscodePath)) {
    await mkdir(dotvscodePath);
  }

  if (!existsSync(settingsPath)) {
    await writeFile(settingsPath, "");
  }
}

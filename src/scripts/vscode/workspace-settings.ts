import { existsSync } from "fs";
import { mkdir } from "fs/promises";

export async function run<
  T extends {
    rootDir: string;
  }
>(params: T) {
  const dotvscodePath = new URL("./.vscode/", params.rootDir);

  if (!existsSync(dotvscodePath)) {
    await mkdir(dotvscodePath);
  }
}

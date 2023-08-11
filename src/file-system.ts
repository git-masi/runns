import { readdir } from "node:fs/promises";
import inquirer from "inquirer";
import { startCase } from "lodash-es";

export async function getChoicesFromDir(path: string) {
  const result: Array<inquirer.Separator | string> = [];
  const contents = await readdir(path, { withFileTypes: true });

  for (const dirent of contents) {
    if (dirent.isDirectory()) {
      result.push(new inquirer.Separator(startCase(dirent.name)));
      result.push(...(await getChoicesFromDir(`${dirent.path}${dirent.name}`)));
    } else if (dirent.isFile()) {
      result.push(dirent.name);
    }
  }

  return result;
}

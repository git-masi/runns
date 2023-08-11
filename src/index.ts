import { URL, fileURLToPath } from "node:url";
import inquirer from "inquirer";
import { getChoicesFromDir } from "./file-system.js";

const scriptsDir = fileURLToPath(new URL("./scripts/", import.meta.url));
const choices = await getChoicesFromDir(scriptsDir);

const selectedScripts = await inquirer.prompt([
  {
    type: "checkbox",
    message: "Select scripts to run",
    name: "scripts",
    choices: choices,
    validate(answer) {
      if (answer.length < 1) {
        return "You must choose at least one script.";
      }

      return true;
    },
  },
]);

console.log(selectedScripts);

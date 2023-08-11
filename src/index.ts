import { URL, fileURLToPath } from "node:url";
import inquirer from "inquirer";
import { getChoicesFromDir } from "./file-system.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const choices = getChoicesFromDir(__dirname);

const selectedScripts = await inquirer.prompt([
  {
    type: "checkbox",
    message: "Select scripts to run",
    name: "scripts",
    choices: choices,
    validate(answer) {
      if (answer.length < 1) {
        return "You must choose at least one topping.";
      }

      return true;
    },
  },
]);

console.log(selectedScripts);

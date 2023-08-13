import inquirer from "inquirer";
import { cwd } from "node:process";
import { run } from "./scripts/vscode/workspace-settings.js";

(async () => {
  try {
    const fns = {
      "workspace-settings": run,
    };

    const choices = Object.keys(fns);

    const selectedChoices = await inquirer.prompt<{
      scripts: Array<keyof typeof fns>;
    }>([
      {
        type: "checkbox",
        message: "Select scripts to run",
        name: "scripts",
        choices,
        validate(answer) {
          if (answer.length < 1) {
            return "You must choose at least one script.";
          }

          return true;
        },
      },
    ]);

    const input = { rootDir: cwd() };

    await Promise.all(selectedChoices.scripts.map((s) => fns[s](input)));
  } catch (error) {
    console.error(error);
  }
})();

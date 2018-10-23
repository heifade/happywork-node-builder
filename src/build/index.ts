import commander from "commander";
import chalk from "chalk";
import { build } from "./build";
import { doc } from "./doc";

export function addBuildCommand() {
  commander
    .command("build")
    .option("--doc", "是否生成文档", false)
    .description("构建项目")
    .action(pars => {
      build()
        .then()
        .catch((e: Error) => {
          console.error(chalk.red(`构建失败： ${e.message}`));
          process.exit(1);
        });

      if (pars.doc) {
        doc(process.cwd());
      }
    });
}

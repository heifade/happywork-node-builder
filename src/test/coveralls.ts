import { print, printSuccess } from "../print";
import { execSync } from "child_process";

export function coveralls(projectPath: string, mochapars: string[]) {
  print("覆盖率开始...");

  let commandText = `nyc report --reporter=text-lcov | coveralls`;

  print(`执行命令：${commandText}`);

  let res = execSync(commandText, { encoding: "utf-8", cwd: projectPath });

  printSuccess("覆盖率完成");
}

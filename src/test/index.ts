import commander from "commander";
import { unlinkSync } from "fs";
import { unitTest, createNycrcFile } from "./unitTest";
import { coveralls } from "./coveralls";

export function addUnitTestCommand() {
  commander
    .command("test")
    .option("--coveralls", "是否进行覆盖率测试", false)
    .description("单元测试")
    .action(pars => {
      const projectPath = process.cwd();
      const nycrcFile = createNycrcFile(projectPath); //创建 .nycrc文件
      unitTest(projectPath, []); // 单元测试
      if (pars.coveralls) {
        coveralls(projectPath, []); // 覆盖率
      }
      unlinkSync(nycrcFile); //删除 .nycrc文件
    });
}

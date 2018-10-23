import commander from "commander";
import { spawnSync, SpawnSyncOptionsWithStringEncoding, execSync } from "child_process";
import { print, printError, printSuccess } from "./print";
import { resolve } from "path";
import { writeFileSync, unlinkSync } from "fs";

function unitTest(projectPath: string, mochapars: string[]) {
  print("单元测试开始...");

  let options: SpawnSyncOptionsWithStringEncoding = {
    encoding: "utf8",
    // cwd: projectPath,
    stdio: [process.stdin, process.stdout, process.stderr],
    shell: true
  };

  print(`执行命令：nyc mocha ${mochapars.join(" ")}`);

  const childProcess = spawnSync("nyc", ["mocha"].concat(mochapars), options);

  if (childProcess.status !== 0) {
    const error = (childProcess.error && childProcess.error.message) || childProcess.stderr;

    if (error) {
      printError(error);
    }

    printError("单元测试不通过！");
    process.exit(childProcess.status);
    return;
  }

  print("单元测试成功结束");
}

// 创建 .nycrc文件
function createNycrcFile(projectPath: string) {
  let nycrcFile = resolve(projectPath, ".nycrc");

  writeFileSync(
    nycrcFile,
    `{
  "include": [
    "src/**/*.ts"
  ],
  "extension": [
    ".ts"
  ],
  "require": [
    "ts-node/register"
  ],
  "sourceMap": true,
  "instrument": true
}`.trim()
  );
  return nycrcFile;
}

function coveralls(projectPath: string, mochapars: string[]) {
  print("覆盖率开始...");

  let commandText = `nyc report --reporter=text-lcov | coveralls`;

  print(`执行命令：${commandText}`);

  let res = execSync(commandText, { encoding: "utf-8", cwd: projectPath });

  printSuccess("覆盖率完成");
}

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

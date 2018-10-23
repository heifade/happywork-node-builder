import { spawnSync, SpawnSyncOptionsWithStringEncoding } from "child_process";
import { print, printError } from "../print";
import { resolve } from "path";
import { writeFileSync } from "fs";

export function unitTest(projectPath: string, mochapars: string[]) {
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
export function createNycrcFile(projectPath: string) {
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

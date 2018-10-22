import { unlinkSync, existsSync } from "fs";
import { spawnSync } from "child_process";

export async function readTs(file: string) {
  return new Promise<any>((resolve, reject) => {
    if (!existsSync(file)) {
      reject(new Error(`build.config.ts 不存在!`));
      return;
    }

    let jsFileName = file.replace(/.ts$/, ".js");

    if (existsSync(jsFileName)) {
      unlinkSync(jsFileName);
    }

    const childProcess = spawnSync("tsc", [file, "--module", "commonjs"], { shell: true, encoding: "utf8" });
    // if (childProcess.status !== 0) {
    if (!existsSync(jsFileName)) {
      const error = (childProcess.error && childProcess.error.message) || childProcess.stderr;
      reject(new Error(`编译"build.config.ts"时出错！${error}`));
    } else {
      const content = require(jsFileName).default;
      resolve(content);
      unlinkSync(jsFileName);
    }
  });
}

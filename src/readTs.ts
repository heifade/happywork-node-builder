import { resolve as resolvePath, dirname, basename } from "path";
import { unlinkSync, existsSync, mkdirSync, rmdirSync } from "fs";
import { spawn } from "child_process";

export async function readTs(file: string) {
  return new Promise<any>((resolve, reject) => {
    let jsFileName = basename(file).replace(/.ts$/, ".js");
    const dir = resolvePath(dirname(file), `temp_${new Date().getTime().toString()}`);
    jsFileName = resolvePath(dir, jsFileName);

    const typescript = require.resolve("typescript");
    const tsc = resolvePath(dirname(typescript), "../bin/tsc");

    if (!existsSync(tsc)) {
      throw new Error("tsc is not exists!");
    }
    if (existsSync(jsFileName)) {
      unlinkSync(jsFileName);
    }
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }

    const client = spawn(tsc, [file, "--module", "commonjs", "--outDir", dir], { shell: true });

    client.on("close", (code, signal) => {
      if (existsSync(jsFileName)) {
        const content = require(jsFileName).default;
        resolve(content);
        unlinkSync(jsFileName);
        rmdirSync(dir);
      } else {
        reject(`编译${file}时出错！code:${code} signal:${signal}`);
      }
    });
  });
}

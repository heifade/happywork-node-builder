import { unlinkSync, existsSync, readFileSync } from "fs";
import { spawnSync } from "child_process";
import { transpileModule, ModuleKind, ScriptTarget } from "typescript";

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

function compile(tsFile: string) {
  const code = readFileSync(tsFile, { encoding: "utf8" });
  const transformed = transpileModule(code, {
    compilerOptions: {
      noEmitHelpers: false,
      isolatedModules: false,
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2015,
      noImplicitUseStrict: true
    }
  });
  return transformed.outputText;
}

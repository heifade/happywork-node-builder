import { resolve as resolvePath } from "path";
import { unlinkSync, existsSync } from "fs";
import { spawn } from "child_process";
import { BuildConfig } from "./build.config";
import merge from "lodash-es/merge";

export async function readBuildConfig() {
  return new Promise<BuildConfig>((resolve, reject) => {
    const CWD = process.cwd();

    const buildConfigTs = resolvePath(CWD, "./build.config.ts");
    const tempConfigFile = resolvePath(CWD, `./build.config.js`);

    const tscPath = "../node_modules/.bin/tsc";
    let tsc = resolvePath(__dirname, tscPath);
    if (!existsSync(tsc)) {
      tsc = resolvePath(CWD, tscPath);
    }

    if (!existsSync(tsc)) {
      throw new Error("tsc is not exists!");
    }

    const client = spawn(tsc, [buildConfigTs, "--module", "commonjs"], { shell: true });

    client.on("exit", (code, signal) => {
      if (code === 0) {
        readConfig(tempConfigFile).then(buildConfig => {
          resolve(buildConfig);
          unlinkSync(tempConfigFile);
        });
      } else {
        reject(`编译${buildConfigTs}时出错！code:${code} signal:${signal}`);
      }
    });
  });
}

async function readConfig(file: string) {
  const defaultContent = {
    input: "src/index.ts",
    output: {
      dir: "dist",
      file: "index.js",
      mini: false,
      format: "cjs"
    }
  };
  const config: any = {};

  const fileContent = require(file).default as BuildConfig;

  merge(config, defaultContent, fileContent);

  return config as BuildConfig;
}

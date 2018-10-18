import { resolve as resolvePath } from "path";
import { unlinkSync, existsSync } from "fs";
import { spawn } from "child_process";
import { BuildConfig } from "./build.config";
import merge from "lodash-es/merge";

export async function readBuildConfig() {
  return new Promise<BuildConfig>((resolve, reject) => {
    let CWD = process.cwd();

    let buildConfigTs = resolvePath(CWD, "./build.config.ts");
    let tempConfigFile = resolvePath(CWD, `./build.config.js`);

    let tsc = require.resolve('tsc');

    console.log('tsc path', tsc);

    // let tsc = resolvePath(__dirname, "../node_modules/.bin/tsc");
    let client = spawn(tsc, [buildConfigTs, "--module", "commonjs"], { shell: true });


    console.log('tsc exists', tsc,  existsSync(tsc))

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

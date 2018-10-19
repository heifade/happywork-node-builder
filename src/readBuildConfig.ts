import { BuildConfig } from "./build.config";
import merge from "lodash-es/merge";
import { readTs } from "./readTs";
import { resolve as resolvePath } from "path";

export async function readBuildConfig() {
  const CWD = process.cwd();
  const buildConfig = resolvePath(CWD, "./build.config.ts");

  const content = await readTs(buildConfig);

  return await readConfig(content);
}

async function readConfig(content: any) {
  const defaultContent = {
    input: "src/index.ts",
    external: [],
    output: {
      dir: "dist",
      file: "index.js",
      mini: false,
      format: "cjs"
    }
  };
  const config: any = {};

  merge(config, defaultContent, content);

  return config as BuildConfig;
}

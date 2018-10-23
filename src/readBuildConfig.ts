import { BuildConfig, Output } from "../config/build.config";
import merge from "lodash-es/merge";
import { readTs } from "./readTs";
import { resolve as resolvePath } from "path";

export async function readBuildConfig() {
  const buildConfig = resolvePath(process.cwd(), "./build.config.ts");
  const content = await readTs(buildConfig);
  return await readConfig(content);
}

function mergeOutput(output: Output) {
  return {
    ...{
      dir: "dist",
      file: "index.js",
      format: "cjs"
    },
    ...output
  };
}

async function readConfig(content: BuildConfig) {
  let output: Output = null;
  let outputList: Output[] = null;

  if (content.output instanceof Array) {
    outputList = new Array<Output>();

    content.output.map(h => {
      outputList.push(mergeOutput(h));
    });
  } else {
    output = mergeOutput(content.output);
  }

  const defaultContent = {
    input: "src/index.ts",
    external: []
  };
  const config: any = {};

  merge(config, defaultContent, content, {
    output: output || outputList
  });

  return config as BuildConfig;
}

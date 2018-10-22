import commander from "commander";
import { rollup, RollupFileOptions, OutputOptions, RollupWarning, RollupSingleFileBuild } from "rollup";
import { readBuildConfig } from "./readBuildConfig";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import chalk from "chalk";
import { terser } from "rollup-plugin-terser";
import { Output } from "./build.config";

async function build() {
  const buildConfig = await readBuildConfig();

  console.log("buildConfig", buildConfig);

  const inputOptions: RollupFileOptions = {
    input: buildConfig.input || "src/index.ts",
    plugins: [
      typescript(),
      json(),
      resolve({
        module: true,
        jsnext: true,
        main: true,
        preferBuiltins: false
      }),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      buildConfig.mini && terser()
    ],
    external: [].concat(buildConfig.external),
    onwarn: (warning: RollupWarning) => {
      const { code, message, loc, frame } = warning;

      // 跳过某些警告
      if (code === "UNRESOLVED_IMPORT") {
        return;
      }
      // 抛出异常
      if (code === "NON_EXISTENT_EXPORT") {
        throw new Error(message);
      }

      // 打印位置（如果适用）
      if (loc) {
        console.warn(`${loc.file} (${loc.line}:${loc.column}) ${message}`);
        if (frame) console.warn(frame);
      } else {
        console.warn(message);
      }
    }
  };
  const bundle = await rollup(inputOptions);
  if (buildConfig.output instanceof Array) {
    buildConfig.output.map(output => {
      resolveOutput(output, bundle);
    });
  } else {
    resolveOutput(buildConfig.output, bundle);
  }
}

async function resolveOutput(output: Output, bundle: RollupSingleFileBuild) {
  const outputOptions: OutputOptions = {
    dir: output.dir || "dist",
    file: output.file || "index.js",
    format: output.format || "cjs",
    banner: output.banner || "",
    footer: output.footer || ""
  };

  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects

  const { code, map } = await bundle.generate(outputOptions);

  await bundle.write(outputOptions);
}

export function addBuildCommand() {
  commander
    .command("build")
    .description("构建项目")
    .action(pars => {
      build()
        .then()
        .catch((e: Error) => {
          console.error(chalk.red(`构建失败： ${e.message}`));
          process.exit(1);
        });
    });
}

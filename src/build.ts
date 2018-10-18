import { rollup, RollupFileOptions, OutputOptions, RollupWarning } from "rollup";
const typescript = require("rollup-plugin-typescript");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const babel = require("rollup-plugin-babel");
const { terser } = require("rollup-plugin-terser");

import { readBuildConfig } from "./readBuildConfig";

async function build() {
  const buildConfig = await readBuildConfig();

  const inputOptions: RollupFileOptions = {
    input: buildConfig.input || "src/index.ts",
    plugins: [
      typescript(),
      resolve({
        module: true,
        jsnext: true,
        main: true
      }),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      buildConfig.output.mini && terser()
    ],
    external: ["path"],
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
  const outputOptions: OutputOptions = {
    dir: buildConfig.output.dir || "dist",
    file: buildConfig.output.file || "index.js",
    format: buildConfig.output.format || "cjs"
  };

  const bundle = await rollup(inputOptions);

  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects

  const { code, map } = await bundle.generate(outputOptions);

  await bundle.write(outputOptions);
}

build();

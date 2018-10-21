import { rollup, RollupFileOptions, OutputOptions, RollupWarning } from "rollup";
import { readBuildConfig } from "./readBuildConfig";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

async function build() {
  const buildConfig = await readBuildConfig();

  const inputOptions: RollupFileOptions = {
    input: buildConfig.input || "src/index.ts",
    plugins: [
      typescript(),
      json(),
      resolve({
        module: true,
        jsnext: true,
        main: true,
        customResolveOptions: {
          moduleDirectory: 'node_modules'
        }
      }),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      buildConfig.output.mini && terser()
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
  const outputOptions: OutputOptions = {
    dir: buildConfig.output.dir || "dist",
    file: buildConfig.output.file || "index.js",
    format: buildConfig.output.format || "cjs",
    banner: buildConfig.output.banner || "",
    footer: buildConfig.output.footer || ""
  };

  const bundle = await rollup(inputOptions);

  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects

  const { code, map } = await bundle.generate(outputOptions);

  await bundle.write(outputOptions);
}

build()
  .then()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

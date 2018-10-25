import { rollup, RollupDirOptions, OutputOptions, RollupWarning, RollupBuild } from "rollup";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import { resolve as resolvePath } from "path";
import { readTs } from "../readTs";
import { BuildConfig } from "../../config/build.config";

export async function build() {
  const buildConfig: BuildConfig = await readTs(resolvePath(process.cwd(), "./build.config.ts"));

  const inputOptions: RollupDirOptions = {
    experimentalCodeSplitting: true,
    input: buildConfig.input || ["src/index.ts"],
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
    external: buildConfig.external,
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

async function resolveOutput(output: OutputOptions, bundle: RollupBuild) {
  const outputOptions: OutputOptions = {
    dir: output.dir || "dist",
    format: output.format || "cjs",
    banner: output.banner || "",
    footer: output.footer || "",
    sourcemap: output.sourcemap || false
  };

  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects
  // const { code, map } = await bundle.generate(outputOptions);

  await bundle.write(outputOptions);
}

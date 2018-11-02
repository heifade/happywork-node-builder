import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import { dirname } from "path";
import pkg from "./package.json";

export default {
  experimentalCodeSplitting: true,
  input: {
    index: "src/index.ts"
  },
  output: {
    dir: "./bin",
    format: "cjs",
    banner: "#!/usr/bin/env node",
    sourcemap: false
  },
  onwarn: ({ code, message, loc, frame }) => {
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
  },
  plugins: [
    // multiEntry(),
    typescript(),
    json(),
    replace({
      __dirname: id => `"${dirname(id)}"`,
      exclude: ['./src/build/build.ts'],
    }),
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
    terser()
  ],
  external: Object.keys(pkg.dependencies).concat(["fs", "path"])
};

import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    dir: "./bin",
    file: "index.js",
    format: "cjs",
    banner: "#!/usr/bin/env node",
    sourcemap: true
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
    terser()
  ],
  external: [
    "rollup",
    "rollup-plugin-typescript",
    "rollup-plugin-node-resolve",
    "rollup-plugin-commonjs",
    "rollup-plugin-babel",
    "rollup-plugin-terser",
    "rollup-plugin-json",
    "tslib",
    "typescript",
    "@babel"
  ]
};

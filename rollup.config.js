import json from "rollup-plugin-json";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: {
    dir: "./dist",
    file: "index.js",
    format: "cjs"
  },
  plugins: [
    typescript(),
    json(),
    resolve({
      module: true,
      jsnext: true,
      main: true
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**"
    }),
    terser()
  ]
};

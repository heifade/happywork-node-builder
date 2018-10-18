import { rollup, RollupFileOptions, OutputOptions } from "rollup";
const typescript = require("rollup-plugin-typescript");

const inputOptions: RollupFileOptions = {
  input: "src/index.ts",
  plugins: [typescript()]
};
const outputOptions: OutputOptions = {
  dir: "dist",
  file: "index.js",
  format: "cjs"
};

async function build() {
  const bundle = await rollup(inputOptions);

  // console.log(bundle.imports); // an array of external dependencies
  // console.log(bundle.exports); // an array of names exported by the entry point
  // console.log(bundle.modules); // an array of module objects

  const { code, map } = await bundle.generate(outputOptions);

  await bundle.write(outputOptions);
}

build();

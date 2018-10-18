const { resolve } = require("path");
const { copyFileSync } = require("fs");

copyFileSync(resolve(__dirname, "../src/build.config.ts"), resolve(__dirname, "../dist/build.config.ts"));

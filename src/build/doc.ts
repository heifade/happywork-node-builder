
import { print } from "../print";
import { resolve as pathResolve } from "path";
import { spawnSync } from "child_process";
import { format } from "typedoc-format";

export async function doc(projectPath: string) {
  print("正在生成文档...");
  let docs = pathResolve(projectPath, "docs");
  let src = pathResolve(projectPath, "src");

  print(`执行命令：typedoc --out ${docs} ${src} --module commonjs --hideGenerator --lib lib.es6.d.ts`);
  await spawnSync("typedoc", ["--out", docs, src, "--module", "commonjs", "--hideGenerator", "--lib", "lib.es6.d.ts"]);

  await format(docs);
}

import { readTs } from "./readTs";
import { resolve as resolvePath } from "path";

export async function readBuildConfig() {
  const buildConfig = resolvePath(process.cwd(), "./build.config.ts");
  return await readTs(buildConfig);
}

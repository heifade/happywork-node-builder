import { resolve } from "path";

export function readBuildConfig(): Promise<any> {
  return new Promise((promiseResolve, promiseReject) => {
    const file = resolve(process.cwd(), "build.config.json");
    try {
      import(file).then(value => {
        promiseResolve(value);
      });
    } catch (e) {
      promiseReject(e);
    }
  });
}

import { ExternalOption, OutputOptions } from "rollup";

export interface BuildConfig {
  input: string[] | { [entryName: string]: string };
  external?: ExternalOption;
  output: OutputOptions | OutputOptions[];
  mini: boolean;
}

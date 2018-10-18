export interface Output {
  dir: string;
  file: string;
  mini: boolean;
  format: "cjs";
}

export interface BuildConfig {
  input: string;
  output: Output;
}

export interface Output {
  dir: string;
  file: string;
  format: "cjs";
  banner?: string;
  footer?: string;
}

export interface BuildConfig {
  input: string;
  external?: string[];
  output: Output | Output[];
  mini: boolean;
}

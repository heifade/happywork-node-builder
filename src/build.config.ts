export interface Output {
  dir: string;
  file: string;
  mini: boolean;
  format: "cjs";
  banner?: string;
  footer?: string;
}

export interface BuildConfig {
  input: string;
  output: Output;
}

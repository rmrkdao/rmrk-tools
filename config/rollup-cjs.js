import config from "./rollup";

config.output = {
  file: "./dist/index.cjs",
  format: "cjs",
  name: "rmrkTools",
  sourcemap: true,
  // inlineDynamicImports: true,
};

export default config;

import fs from "fs";
import path from "path";

export default {
  root: "src/",
  publicDir: "../public/",
  base: "./",
  server: {
    host: true,
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env),
    https: {
      key: fs.readFileSync(path.resolve(__dirname, "./myapp-privateKey.key")),
      cert: fs.readFileSync(path.resolve(__dirname, "./myapp.crt")),
    },
  },
  build: {
    outDir: "../dist/",
    emptyOutDir: true,
    sourcemap: true,
  },
};

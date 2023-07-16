import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts()],
  build: {
    minify: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fragment-wallet",
      fileName: "index",
      formats: ["cjs", "umd", "es"],
    },
  },
});

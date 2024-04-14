import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";
import viteCompression from "vite-plugin-compression";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [viteCompression(), dts()],
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fragment-wallet",
      fileName: "index",
      formats: ["es"],
    },
  },
});

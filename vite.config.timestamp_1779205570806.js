// vite.config.ts
import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
var config = defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "#": resolve(__dirname, "./src")
    },
    tsconfigPaths: true
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()]
});
var vite_config_default = config;
export {
  vite_config_default as default
};

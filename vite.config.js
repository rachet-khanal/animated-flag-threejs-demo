import { defineConfig } from "vite"
import glsl from "vite-plugin-glsl"
import restart from "vite-plugin-restart"

export default defineConfig(({ command }) => ({
  root: "src/",
  publicDir: "../static/",
  server: {
    host: true,
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env),
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",
  },
  base: command === "build" ? "/animated-flag-threejs-demo/" : "/",
  plugins: [restart({ restart: ["../static/**"] }), glsl()],
}))

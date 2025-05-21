/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { execSync } from "child_process";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig(() => {
  process.env.VITE_GIT_COMMIT_DATE = execSync("git log -1 --format=%cI")
    .toString()
    .trimEnd();
  process.env.VITE_GIT_COMMIT_HASH = execSync("git describe --always --dirty")
    .toString()
    .trimEnd();

  return {
    plugins: [react(), tailwindcss()],
    base: "/the-future",
  };
});

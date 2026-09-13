import { cpSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, join, dirname } from "node:path";

const require = createRequire(import.meta.url);

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
  nitro: {
    preset: "vercel",
  },
  hooks: {
    "nitro:init"(nitro) {
      nitro.hooks.hook("compiled", () => {
        // 1. Copia as migrations para a Serverless Function
        const srcMigrations = resolve("infra", "migrations");
        const destMigrations = join(
          nitro.options.output.serverDir,
          "infra",
          "migrations",
        );
        cpSync(srcMigrations, destMigrations, { recursive: true });

        // 2. Copia babel.cjs do jiti (carregado dinamicamente em runtime pelo node-pg-migrate)
        const jitiPkg = require.resolve("jiti/package.json");
        const babelSrc = join(dirname(jitiPkg), "dist", "babel.cjs");
        const jitiDest = join(
          nitro.options.output.serverDir,
          "node_modules",
          "jiti",
          "dist",
        );
        mkdirSync(jitiDest, { recursive: true });
        cpSync(babelSrc, join(jitiDest, "babel.cjs"));
      });
    },
  },
});

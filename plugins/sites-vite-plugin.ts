import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

// Packages the Sites manifest and optional migrations into the Cloudflare build.
// This source is committed because CI must not depend on a locally generated,
// gitignored build/ directory.
export function sites(): Plugin {
  let root = process.cwd();
  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");
      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });
      if (await exists(hostingConfig)) await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      if (await exists(drizzleSource)) await cp(drizzleSource, resolve(outputDirectory, "drizzle"), { recursive: true });
    },
  };
}

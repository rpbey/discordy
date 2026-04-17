/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import path from "node:path";
import { fileURLToPath } from "node:url";

const isBun =
  typeof process !== "undefined" &&
  typeof (process.versions as Record<string, string>).bun === "string";

export function isESM(): boolean {
  return !!import.meta.url;
}

export function dirname(url: string): string {
  return path.dirname(fileURLToPath(url));
}

async function scan(pattern: string): Promise<string[]> {
  if (isBun) {
    const { Glob } = await import("bun");
    const g = new Glob(pattern);
    const out: string[] = [];
    for await (const p of g.scan({ cwd: ".", absolute: true })) out.push(p);
    return out;
  }
  const { glob } = await import("glob");
  return glob(pattern);
}

export async function resolve(...paths: string[]): Promise<string[]> {
  const imports: string[] = [];

  await Promise.all(
    paths.map(async (ps) => {
      const files = await scan(ps.split(path.sep).join("/"));

      files.forEach((file) => {
        if (!imports.includes(file)) {
          imports.push(`file://${file}`);
        }
      });
    }),
  );

  return imports;
}

export async function importx(...paths: string[]): Promise<void> {
  const files = await resolve(...paths);
  await Promise.all(files.map((file) => import(file)));
}

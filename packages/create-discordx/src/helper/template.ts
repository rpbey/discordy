/*
 * Local-template copier — no network needed. Templates are shipped inside the package.
 */
import { promises as fs, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

function selfDir(): string {
  try {
    return dirname(fileURLToPath(import.meta.url));
  } catch {
    return typeof __dirname === "string" ? __dirname : process.cwd();
  }
}

function resolveTemplatesRoot(): string {
  const here = selfDir();
  const candidates = [
    join(here, "..", "templates"),
    join(here, "..", "..", "templates"),
    join(here, "templates"),
  ];
  for (const p of candidates) {
    try {
      if (statSync(p).isDirectory()) return p;
    } catch {}
  }
  return candidates[0]!;
}

async function copyDir(src: string, dest: string): Promise<void> {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

export async function ListTemplates(): Promise<
  { title: string; value: string; description?: string }[]
> {
  const root = resolveTemplatesRoot();
  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => ({
        title: e.name,
        value: e.name,
        description:
          e.name === "basic" ? "Minimal bot — @Slash + ready event" : undefined,
      }));
  } catch {
    return [];
  }
}

export async function TemplateExists(name: string): Promise<boolean> {
  const root = resolveTemplatesRoot();
  try {
    const stat = await fs.stat(join(root, name));
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function CopyTemplate(
  projectRoot: string,
  template: string,
): Promise<void> {
  const src = join(resolveTemplatesRoot(), template);
  await copyDir(src, projectRoot);
}

export async function SubstituteTokens(
  projectRoot: string,
  tokens: Record<string, string>,
): Promise<void> {
  const filesToRewrite = ["package.json", "README.md", ".env.example"];
  for (const rel of filesToRewrite) {
    const path = join(projectRoot, rel);
    try {
      const content = await fs.readFile(path, "utf8");
      let out = content;
      for (const [k, v] of Object.entries(tokens)) {
        out = out.replaceAll(`{{${k}}}`, v);
      }
      if (out !== content) {
        await fs.writeFile(path, out, "utf8");
      }
    } catch {}
  }
}

// Legacy aliases
export const GetTemplates = ListTemplates;
export const IsTemplateExist = TemplateExists;
export const DownloadAndExtractTemplate = CopyTemplate;

/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import { promises as fs } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as tar from "tar";

/**
 * Get templates list from https://github.com/discordx-ts/templates
 *
 * @returns
 */
export async function GetTemplates(): Promise<
  { title: string; value: string }[]
> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/discordx-ts/templates/contents",
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      name: string;
      path: string;
      type: string;
    }[];
    return data
      .filter((row) => row.type === "dir" && /^[0-9].+/.test(row.name))
      .map((row) => ({ title: row.name, value: row.path }));
  } catch {
    return [];
  }
}

/**
 * Check if the template exists on GitHub
 *
 * @param name template name
 * @returns
 */
export async function IsTemplateExist(name: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/discordx-ts/templates/contents/${name}?ref=main`,
    );
    return res.ok;
  } catch {
    return false;
  }
}

async function downloadTar(url: string) {
  const tempFilename = `discordx-template.temp-${Date.now().toString()}`;
  const tempFilePath = join(tmpdir(), tempFilename);

  const res = await fetch(url);
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download template: HTTP ${res.status}`);
  }
  await Bun.write(tempFilePath, res);
  return tempFilePath;
}

/**
 * Download and extract template
 *
 * @param root project path
 * @param name project name
 * @returns
 */
export async function DownloadAndExtractTemplate(
  root: string,
  name: string,
): Promise<void> {
  const tempFile = await downloadTar(
    "https://codeload.github.com/discordx-ts/templates/tar.gz/main",
  );

  await tar.x({
    cwd: root,
    file: tempFile,
    filter: (p) => p.includes(`templates-main/${name}`),
    strip: 2,
  });

  await fs.unlink(tempFile);
}

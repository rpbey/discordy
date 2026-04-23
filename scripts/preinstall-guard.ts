#!/usr/bin/env bun
/*
 * Preinstall guard — prevents duplicate `.bun/` isolated store.
 *
 * When consumed as a sub-workspace of the parent `~/vps` monorepo,
 * `bun install` inside this folder would create a nested
 * `packages/discordy/node_modules/.bun/discord.js@14.26.3` copy —
 * distinct from the outer one. `instanceof discord.js.Client` then
 * fails across package boundaries (discord-player emits
 * `InvalidClientInstance`).
 *
 * Always run `bun install` from the outer workspace root.
 */

const outerLock = Bun.file("../../bun.lock");
if (await outerLock.exists()) {
  const content = await outerLock.text();
  if (
    content.includes('"@rpbey/discordx"') ||
    content.includes("packages/discordy/packages")
  ) {
    console.error(
      "✗ This folder is consumed as a sub-workspace of the outer monorepo (~/vps).",
    );
    console.error(
      "  Running `bun install` here creates a duplicate discord.js store and",
    );
    console.error(
      "  triggers `InvalidClientInstance` warnings from discord-player at runtime.",
    );
    console.error("");
    console.error(
      "  → Run `bun install` from the outer workspace root instead.",
    );
    console.error("");
    console.error(
      "  If you really want a standalone install (e.g. for CI publish), set",
    );
    console.error("  DISCORDY_STANDALONE=1 and retry.");
    if (!Bun.env.DISCORDY_STANDALONE) process.exit(1);
    console.warn("⚠ DISCORDY_STANDALONE=1 set — bypassing guard.");
  }
}

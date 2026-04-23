# Changelog

All notable changes to the **discordy** monorepo.

## 0.1.0 — 2026-04-23

First release under the `@rpbey/*` npm scope. Initial Bun-first fork of [`discordx-ts/discordx`](https://github.com/discordx-ts/discordx).

### Added

- All 12 packages ship under `@rpbey/*` (plus `create-discordx` unscoped):
  - `@rpbey/discordx` — core framework
  - `@rpbey/di` — DI adapters (tsyringe, typedi)
  - `@rpbey/internal` — shared internal types
  - `@rpbey/importer` — Bun-native module auto-loader
  - `@rpbey/utilities` — guards + decorators
  - `@rpbey/pagination` — button + select-menu pagination
  - `@rpbey/music` — worker_threads YTDL player
  - `@rpbey/lava-player` — Lavalink client
  - `@rpbey/lava-queue` — queue manager
  - `@rpbey/plugin-lava-player` — ready Lavalink plugin
  - `@rpbey/plugin-ytdl-player` — ready YTDL plugin
  - `create-discordx` — Bun-first scaffolder with `--with-di`, `--with-music`, `--with-lava`, `--with-ytdl`, `--with-pagination` flags

### Changed (vs. upstream discordx)

- **Bun-native replacements**: `Bun.Glob`, `Bun.color`, `Bun.spawnSync`, global `fetch` (no `axios`/`undici` for HTTP).
- **Dropped**: `lodash`, `backoff`, `chalk`, `rimraf`, `ws`, `node-fetch`.
- **`engines.bun >= 1.2.0`** on every package.
- **`@rpbey/importer`** is Bun-only (uses `Bun.Glob` + `import.meta.dir`).
- **Build**: `plugin-lava-player` and `plugin-ytdl-player` switched to `bunx tsc` to preserve granular `exports` map.
- **create-discordx**: fully rewritten — local-bundled templates (no network round-trip), CLI flags for feature composition, Bun as first-class installer.

### Fixed

- **119 occurrences of deprecated `ephemeral: true`** migrated to `flags: MessageFlags.Ephemeral` (discord.js 14.26+). Affected: `plugin-lava-player`, `plugin-ytdl-player`, `utilities`.
- DTS generation for `plugin-lava-player` now works by adding `"types": ["bun"]` to its `tsconfig.json`.
- DTS generation for `@rpbey/music` was failing because `@types/node` wasn't resolvable; root monorepo now provides it.

### Known

- Legacy stage-2 decorators (`experimentalDecorators: true`) — **not** TC39 stage 3. Consumers must match.
- `@rpbey/importer` does not run on Node.js — use `Bun.Glob` directly or a build-time manifest if you need Node compat.

### Upstream

Fork of [discordx-ts/discordx](https://github.com/discordx-ts/discordx). Core feature parity tracked with upstream; the only intentional divergence is the Bun-native rewrites and the `@rpbey/*` namespace.

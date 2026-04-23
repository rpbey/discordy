# create-discordx

> CLI to scaffold a new **discordy** bot — Bun-first, TypeScript, decorators.

```bash
bun create discordx my-bot
# or
bunx create-discordx my-bot
```

## What it does

Generates a ready-to-run bot directory:

```
my-bot/
├── src/
│   ├── index.ts          # client + login
│   ├── commands/
│   │   └── ping.ts       # @Slash example
│   └── events/
│       └── ready.ts      # @Once('ready')
├── .env.example
├── tsconfig.json         # experimentalDecorators + emitDecoratorMetadata
├── package.json          # @rpbey/discordx + discord.js + reflect-metadata
└── README.md
```

## Flags

```
--template <name>        Choose a template (basic, lava, ytdl, minimal)
--with-music             Include @rpbey/music
--with-lava              Include @rpbey/plugin-lava-player
--with-ytdl              Include @rpbey/plugin-ytdl-player
--with-pagination        Include @rpbey/pagination
--with-di                Wire tsyringe + @rpbey/di
--install | --no-install Run bun install (default: interactive prompt)
--git | --no-git         Init git repo (default: on)
```

## Interactive mode

Running without a name prompts for template, features, package name, and whether to install.

## Requirements

- Bun ≥ 1.2

## License

Apache-2.0

import "reflect-metadata";
import { Client } from "@rpbey/discordx";
import { IntentsBitField } from "discord.js";

import "./commands/ping.js";
import "./events/ready.js";

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
  silent: false,
});

client.once("ready", async () => {
  const guildId = process.env.GUILD_ID;
  if (guildId) {
    await client.initApplicationCommands();
  } else {
    await client.clearApplicationCommands();
    await client.initApplicationCommands();
  }
  console.log(`✓ Logged in as ${client.user?.tag}`);
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("✗ DISCORD_TOKEN is required (see .env.example)");
  process.exit(1);
}

await client.login(token);

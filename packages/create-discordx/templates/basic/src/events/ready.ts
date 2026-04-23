import { Discord, Once } from "@rpbey/discordx";
import type { Client } from "discord.js";

@Discord()
export class ReadyEvent {
  @Once({ event: "ready" })
  ready([client]: [Client]) {
    console.log(
      `✓ Ready (${client.guilds.cache.size} guild${client.guilds.cache.size === 1 ? "" : "s"})`,
    );
  }
}

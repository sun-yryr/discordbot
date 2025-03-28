import {
  type ApplicationCommandManager,
  ApplicationCommandOptionType,
  SlashCommandBuilder,
} from "discord.js";

export async function addSlashCommands(
  commandManager: ApplicationCommandManager,
) {
  console.log("Started refreshing RSS application (/) commands.");
  
  // RSS Add command
  await commandManager.create(
    new SlashCommandBuilder()
      .setName("rss-add")
      .setDescription("Add a new RSS feed to monitor")
      .addStringOption((option) =>
        option
          .setName("url")
          .setDescription("The URL of the RSS feed")
          .setRequired(true)
      )
      .toJSON()
  );
  
  // RSS List command
  await commandManager.create(
    new SlashCommandBuilder()
      .setName("rss-list")
      .setDescription("List all registered RSS feeds")
      .toJSON()
  );
  
  // RSS Remove command
  await commandManager.create(
    new SlashCommandBuilder()
      .setName("rss-remove")
      .setDescription("Remove an RSS feed")
      .addStringOption((option) =>
        option
          .setName("id")
          .setDescription("The ID of the RSS feed to remove")
          .setRequired(true)
      )
      .toJSON()
  );
  
  // RSS Interval command
  await commandManager.create(
    new SlashCommandBuilder()
      .setName("rss-interval")
      .setDescription("Set the RSS check interval (in minutes)")
      .addIntegerOption((option) =>
        option
          .setName("minutes")
          .setDescription("Check interval in minutes (minimum 1)")
          .setRequired(true)
          .setMinValue(1)
      )
      .toJSON()
  );
  
  console.log("Successfully reloaded RSS application (/) commands.");
}
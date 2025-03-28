import { Client, GatewayIntentBits } from "discord.js";
import config from "./config.js";
import { addSlashCommands } from "./services/commands.js";
import { addFeed, getAllFeeds, removeFeed, updateCheckInterval } from "./services/database.js";
import { validateRssFeed } from "./services/rss-parser.js";
import { startScheduler, updateScheduler } from "./services/scheduler.js";

const globalClient = new Client({ intents: [GatewayIntentBits.Guilds] });

async function shutdown() {
  console.log("Shutting down...");
  globalClient.user?.setStatus("invisible");
  await globalClient.destroy();
}
process.addListener("SIGINT", shutdown);
process.addListener("SIGTERM", shutdown);

globalClient.on("ready", async (client) => {
  console.log(`Logged in as ${client.user.tag}!`);
  await addSlashCommands(client.application.commands);
  
  // Start the RSS checker scheduler
  await startScheduler(client);
});

globalClient.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  try {
    switch (interaction.commandName) {
      case "rss-add": {
        await interaction.deferReply();
        const url = interaction.options.getString("url", true);
        
        // Validate the RSS feed
        const isValid = await validateRssFeed(url);
        if (!isValid) {
          await interaction.editReply("Invalid RSS feed URL. Please provide a valid RSS feed.");
          return;
        }
        
        // Add the feed
        try {
          const feed = await addFeed(url, interaction.channelId);
          await interaction.editReply(`RSS feed added successfully! ID: \`${feed.id}\``);
        } catch (error) {
          if (error instanceof Error) {
            await interaction.editReply(`Error: ${error.message}`);
          } else {
            await interaction.editReply("An unknown error occurred.");
          }
        }
        break;
      }
      
      case "rss-list": {
        await interaction.deferReply();
        const feeds = await getAllFeeds();
        
        // Filter feeds for the current channel
        const channelFeeds = feeds.filter(feed => feed.channelId === interaction.channelId);
        
        if (channelFeeds.length === 0) {
          await interaction.editReply("No RSS feeds registered for this channel.");
          return;
        }
        
        // Create a formatted list
        const feedList = channelFeeds.map(feed => {
          return `ID: \`${feed.id}\` - ${feed.title || feed.url}`;
        }).join("\\n");
        
        await interaction.editReply(`RSS feeds in this channel:\\n${feedList}`);
        break;
      }
      
      case "rss-remove": {
        await interaction.deferReply();
        const id = interaction.options.getString("id", true);
        
        // Remove the feed
        const removed = await removeFeed(id);
        
        if (removed) {
          await interaction.editReply(`RSS feed with ID \`${id}\` removed successfully.`);
        } else {
          await interaction.editReply(`No RSS feed found with ID \`${id}\`.`);
        }
        break;
      }
      
      case "rss-interval": {
        await interaction.deferReply();
        const minutes = interaction.options.getInteger("minutes", true);
        
        // Update the check interval
        await updateCheckInterval(minutes);
        
        // Update the scheduler
        await updateScheduler(globalClient);
        
        await interaction.editReply(`RSS check interval updated to ${minutes} minutes.`);
        break;
      }
    }
  } catch (error) {
    console.error("Error handling interaction:", error);
    
    // If the interaction hasn't been replied to yet, reply with an error
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply("An error occurred while processing your command.");
    }
  }
});

await globalClient.login(config.discordToken);
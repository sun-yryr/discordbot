import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { getAllFeeds } from "./database.js";
import { checkFeed, RssItem } from "./rss-parser.js";

// Send notifications for new RSS items
export async function sendNotifications(client: Client): Promise<void> {
  const feeds = await getAllFeeds();
  
  for (const feed of feeds) {
    try {
      const newItems = await checkFeed(feed);
      
      if (newItems.length === 0) {
        continue;
      }
      
      // Get the channel
      const channel = await client.channels.fetch(feed.channelId);
      
      if (!channel || !(channel instanceof TextChannel)) {
        console.error(`Channel ${feed.channelId} not found or not a text channel`);
        continue;
      }
      
      // Send notifications for each new item (newest first)
      for (const item of newItems.reverse()) {
        await sendRssNotification(channel, feed.title || "RSS Feed", item);
      }
      
      console.log(`Sent ${newItems.length} notifications for feed ${feed.title || feed.url}`);
    } catch (error) {
      console.error(`Error sending notifications for feed ${feed.url}:`, error);
    }
  }
}

// Send a notification for a single RSS item
async function sendRssNotification(
  channel: TextChannel,
  feedTitle: string,
  item: RssItem
): Promise<void> {
  const embed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle(item.title)
    .setURL(item.link)
    .setDescription(item.contentSnippet || "No description available")
    .setTimestamp(new Date(item.pubDate))
    .setFooter({ text: `From: ${feedTitle}` });
  
  if (item.author) {
    embed.setAuthor({ name: item.author });
  }
  
  await channel.send({ embeds: [embed] });
}
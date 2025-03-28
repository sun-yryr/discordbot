import Parser from "rss-parser";
import { RssFeed, updateFeed } from "./database.js";

// Create a new RSS parser instance
const parser = new Parser();

export interface RssItem {
  title: string;
  link: string;
  pubDate: string;
  content?: string;
  contentSnippet?: string;
  author?: string;
}

// Check if a feed has new items
export async function checkFeed(feed: RssFeed): Promise<RssItem[]> {
  try {
    const parsedFeed = await parser.parseURL(feed.url);
    
    // Update feed title if available
    if (parsedFeed.title && (!feed.title || feed.title !== parsedFeed.title)) {
      feed.title = parsedFeed.title;
    }
    
    // Get the last update time
    const lastUpdated = new Date(feed.lastUpdated);
    
    // Filter items that are newer than the last update
    const newItems = parsedFeed.items
      .filter((item) => {
        if (!item.pubDate) return false;
        const pubDate = new Date(item.pubDate);
        return pubDate > lastUpdated;
      })
      .map((item) => ({
        title: item.title || "No title",
        link: item.link || "",
        pubDate: item.pubDate || new Date().toISOString(),
        content: item.content,
        contentSnippet: item.contentSnippet,
        author: item.creator || item.author,
      }));
    
    // If there are new items, update the last updated time
    if (newItems.length > 0) {
      // Find the most recent publication date
      const mostRecentPubDate = newItems.reduce((latest, item) => {
        const pubDate = new Date(item.pubDate);
        return pubDate > latest ? pubDate : latest;
      }, lastUpdated);
      
      // Update the feed's last updated time
      await updateFeed(feed.id, mostRecentPubDate.toISOString(), feed.title);
    }
    
    return newItems;
  } catch (error) {
    console.error(`Error checking feed ${feed.url}:`, error);
    return [];
  }
}

// Validate if a URL is a valid RSS feed
export async function validateRssFeed(url: string): Promise<boolean> {
  try {
    const feed = await parser.parseURL(url);
    return !!feed.title; // If we can parse the feed and it has a title, it's valid
  } catch (error) {
    return false;
  }
}
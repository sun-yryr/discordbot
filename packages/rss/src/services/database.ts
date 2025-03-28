import fs from "fs/promises";
import config from "../config.js";

export interface RssFeed {
  id: string;
  url: string;
  channelId: string;
  lastUpdated: string;
  title?: string;
}

export interface RssDatabase {
  feeds: RssFeed[];
  checkInterval: number; // in minutes
}

// Initialize empty database
const defaultDb: RssDatabase = {
  feeds: [],
  checkInterval: parseInt(config.rssCheckInterval, 10),
};

// Load database from file
export async function loadDatabase(): Promise<RssDatabase> {
  try {
    const data = await fs.readFile(config.rssDbPath, "utf-8");
    return JSON.parse(data) as RssDatabase;
  } catch (error) {
    // If file doesn't exist, create it with default values
    await saveDatabase(defaultDb);
    return defaultDb;
  }
}

// Save database to file
export async function saveDatabase(db: RssDatabase): Promise<void> {
  await fs.writeFile(config.rssDbPath, JSON.stringify(db, null, 2), "utf-8");
}

// Add a new RSS feed
export async function addFeed(url: string, channelId: string): Promise<RssFeed> {
  const db = await loadDatabase();
  
  // Check if feed already exists for this channel
  const existingFeed = db.feeds.find(
    (feed) => feed.url === url && feed.channelId === channelId
  );
  
  if (existingFeed) {
    throw new Error("This RSS feed is already registered for this channel");
  }
  
  const newFeed: RssFeed = {
    id: generateId(),
    url,
    channelId,
    lastUpdated: new Date().toISOString(),
  };
  
  db.feeds.push(newFeed);
  await saveDatabase(db);
  
  return newFeed;
}

// Remove an RSS feed
export async function removeFeed(id: string): Promise<boolean> {
  const db = await loadDatabase();
  const initialLength = db.feeds.length;
  
  db.feeds = db.feeds.filter((feed) => feed.id !== id);
  
  if (db.feeds.length === initialLength) {
    return false; // No feed was removed
  }
  
  await saveDatabase(db);
  return true;
}

// Update feed's last updated time and title
export async function updateFeed(id: string, lastUpdated: string, title?: string): Promise<void> {
  const db = await loadDatabase();
  const feed = db.feeds.find((feed) => feed.id === id);
  
  if (!feed) {
    throw new Error(`Feed with ID ${id} not found`);
  }
  
  feed.lastUpdated = lastUpdated;
  if (title) {
    feed.title = title;
  }
  
  await saveDatabase(db);
}

// Update check interval
export async function updateCheckInterval(minutes: number): Promise<void> {
  if (minutes < 1) {
    throw new Error("Check interval must be at least 1 minute");
  }
  
  const db = await loadDatabase();
  db.checkInterval = minutes;
  await saveDatabase(db);
}

// Get all feeds
export async function getAllFeeds(): Promise<RssFeed[]> {
  const db = await loadDatabase();
  return db.feeds;
}

// Get check interval
export async function getCheckInterval(): Promise<number> {
  const db = await loadDatabase();
  return db.checkInterval;
}

// Generate a random ID for feeds
function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
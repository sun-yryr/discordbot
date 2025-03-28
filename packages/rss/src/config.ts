const wrapEnv = (envName: string, defaultValue?: string, message?: string) => {
  const env = process.env[envName];

  if (!env && defaultValue === undefined) {
    console.error(message ?? `${envName} is required.`);
    process.exit(1);
  }

  return env ?? defaultValue;
};

const config = {
  discordToken: wrapEnv("DISCORD_TOKEN"),
  clientId: wrapEnv("CLIENT_ID"),
  // Default RSS check interval is 30 minutes if not specified
  rssCheckInterval: wrapEnv("RSS_CHECK_INTERVAL", "30", "RSS_CHECK_INTERVAL is not set, using default: 30 minutes"),
  // Database file path for storing RSS feeds
  rssDbPath: wrapEnv("RSS_DB_PATH", "./rss_feeds.json", "RSS_DB_PATH is not set, using default: ./rss_feeds.json"),
};

export default config;
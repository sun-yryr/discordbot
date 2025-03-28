import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import {
  loadDatabase,
  saveDatabase,
  addFeed,
  removeFeed,
  updateFeed,
  updateCheckInterval,
  getAllFeeds,
  getCheckInterval,
  RssDatabase,
  RssFeed,
} from "../services/database";

// Mock the fs module
vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

// Mock the config
vi.mock("../config.js", () => ({
  default: {
    rssDbPath: "./test-db.json",
    rssCheckInterval: "30",
  },
}));

// Mock Math.random for predictable IDs
const mockMathRandom = vi.spyOn(Math, "random");
mockMathRandom.mockReturnValue(0.123456789);

describe("RSS Database Service", () => {
  const mockDb: RssDatabase = {
    feeds: [
      {
        id: "abc123",
        url: "https://example.com/feed.xml",
        channelId: "channel1",
        lastUpdated: "2023-01-01T00:00:00.000Z",
        title: "Example Feed",
      },
    ],
    checkInterval: 30,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("loadDatabase", () => {
    it("should load database from file", async () => {
      // Mock readFile to return a JSON string
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));

      const result = await loadDatabase();
      expect(result).toEqual(mockDb);
      expect(fs.readFile).toHaveBeenCalledWith("./test-db.json", "utf-8");
    });

    it("should create a new database if file doesn't exist", async () => {
      // Mock readFile to throw an error
      vi.mocked(fs.readFile).mockRejectedValue(new Error("File not found"));
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await loadDatabase();
      expect(result).toEqual({
        feeds: [],
        checkInterval: 30,
      });
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe("saveDatabase", () => {
    it("should save database to file", async () => {
      vi.mocked(fs.writeFile).mockResolvedValue();

      await saveDatabase(mockDb);
      expect(fs.writeFile).toHaveBeenCalledWith(
        "./test-db.json",
        JSON.stringify(mockDb, null, 2),
        "utf-8"
      );
    });
  });

  describe("addFeed", () => {
    it("should add a new feed", async () => {
      // Mock loadDatabase to return an empty database
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({ feeds: [], checkInterval: 30 }));
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await addFeed("https://new-feed.com/rss", "channel2");
      
      expect(result).toEqual({
        id: "0dzfj3krt9f",
        url: "https://new-feed.com/rss",
        channelId: "channel2",
        lastUpdated: expect.any(String),
      });
      
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it("should throw an error if feed already exists", async () => {
      // Mock loadDatabase to return a database with the feed
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));

      await expect(
        addFeed("https://example.com/feed.xml", "channel1")
      ).rejects.toThrow("This RSS feed is already registered for this channel");
    });
  });

  describe("removeFeed", () => {
    it("should remove a feed by ID", async () => {
      // Mock loadDatabase to return a database with the feed
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));
      vi.mocked(fs.writeFile).mockResolvedValue();

      const result = await removeFeed("abc123");
      
      expect(result).toBe(true);
      expect(fs.writeFile).toHaveBeenCalledWith(
        "./test-db.json",
        expect.stringContaining('"feeds":[]'),
        "utf-8"
      );
    });

    it("should return false if feed not found", async () => {
      // Mock loadDatabase to return a database with the feed
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));

      const result = await removeFeed("nonexistent");
      
      expect(result).toBe(false);
      expect(fs.writeFile).not.toHaveBeenCalled();
    });
  });

  describe("updateFeed", () => {
    it("should update a feed's lastUpdated and title", async () => {
      // Mock loadDatabase to return a database with the feed
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));
      vi.mocked(fs.writeFile).mockResolvedValue();

      const newDate = "2023-02-01T00:00:00.000Z";
      const newTitle = "Updated Feed";
      
      await updateFeed("abc123", newDate, newTitle);
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        "./test-db.json",
        expect.stringContaining(newDate),
        "utf-8"
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        "./test-db.json",
        expect.stringContaining(newTitle),
        "utf-8"
      );
    });

    it("should throw an error if feed not found", async () => {
      // Mock loadDatabase to return a database with the feed
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));

      await expect(
        updateFeed("nonexistent", "2023-02-01T00:00:00.000Z")
      ).rejects.toThrow("Feed with ID nonexistent not found");
    });
  });

  describe("updateCheckInterval", () => {
    it("should update the check interval", async () => {
      // Mock loadDatabase to return a database
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));
      vi.mocked(fs.writeFile).mockResolvedValue();

      await updateCheckInterval(60);
      
      expect(fs.writeFile).toHaveBeenCalledWith(
        "./test-db.json",
        expect.stringContaining('"checkInterval":60'),
        "utf-8"
      );
    });

    it("should throw an error if interval is less than 1", async () => {
      await expect(updateCheckInterval(0)).rejects.toThrow(
        "Check interval must be at least 1 minute"
      );
    });
  });

  describe("getAllFeeds", () => {
    it("should return all feeds", async () => {
      // Mock loadDatabase to return a database with feeds
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));

      const result = await getAllFeeds();
      
      expect(result).toEqual(mockDb.feeds);
    });
  });

  describe("getCheckInterval", () => {
    it("should return the check interval", async () => {
      // Mock loadDatabase to return a database
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockDb));

      const result = await getCheckInterval();
      
      expect(result).toBe(30);
    });
  });
});
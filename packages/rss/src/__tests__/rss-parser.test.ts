import { describe, it, expect, vi, beforeEach } from "vitest";
import Parser from "rss-parser";
import { checkFeed, validateRssFeed } from "../services/rss-parser";
import { updateFeed } from "../services/database";

// Mock the rss-parser module
vi.mock("rss-parser", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      parseURL: vi.fn(),
    })),
  };
});

// Mock the database module
vi.mock("../services/database", () => ({
  updateFeed: vi.fn(),
}));

describe("RSS Parser Service", () => {
  const mockFeed = {
    id: "feed1",
    url: "https://example.com/feed.xml",
    channelId: "channel1",
    lastUpdated: "2023-01-01T00:00:00.000Z",
    title: "Example Feed",
  };

  const mockParsedFeed = {
    title: "Example Feed",
    items: [
      {
        title: "New Item",
        link: "https://example.com/new-item",
        pubDate: "2023-01-02T00:00:00.000Z",
        content: "Content",
        contentSnippet: "Content snippet",
        creator: "Author",
      },
      {
        title: "Old Item",
        link: "https://example.com/old-item",
        pubDate: "2022-12-31T00:00:00.000Z",
        content: "Old content",
        contentSnippet: "Old content snippet",
        creator: "Old author",
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("checkFeed", () => {
    it("should return new items and update the feed", async () => {
      // Mock the parser to return the mock feed
      const parseURLMock = vi.fn().mockResolvedValue(mockParsedFeed);
      Parser.prototype.parseURL = parseURLMock;

      const result = await checkFeed(mockFeed);

      expect(parseURLMock).toHaveBeenCalledWith(mockFeed.url);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("New Item");
      expect(updateFeed).toHaveBeenCalledWith(
        mockFeed.id,
        "2023-01-02T00:00:00.000Z",
        "Example Feed"
      );
    });

    it("should return an empty array if no new items", async () => {
      // Mock the parser to return a feed with only old items
      const oldItemsFeed = {
        ...mockParsedFeed,
        items: [mockParsedFeed.items[1]], // Only the old item
      };
      
      const parseURLMock = vi.fn().mockResolvedValue(oldItemsFeed);
      Parser.prototype.parseURL = parseURLMock;

      const result = await checkFeed(mockFeed);

      expect(parseURLMock).toHaveBeenCalledWith(mockFeed.url);
      expect(result).toHaveLength(0);
      expect(updateFeed).not.toHaveBeenCalled();
    });

    it("should handle errors and return an empty array", async () => {
      // Mock the parser to throw an error
      const parseURLMock = vi.fn().mockRejectedValue(new Error("Network error"));
      Parser.prototype.parseURL = parseURLMock;

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const result = await checkFeed(mockFeed);

      expect(parseURLMock).toHaveBeenCalledWith(mockFeed.url);
      expect(result).toHaveLength(0);
      expect(consoleSpy).toHaveBeenCalled();
      expect(updateFeed).not.toHaveBeenCalled();
    });
  });

  describe("validateRssFeed", () => {
    it("should return true for a valid RSS feed", async () => {
      // Mock the parser to return a valid feed
      const parseURLMock = vi.fn().mockResolvedValue({ title: "Valid Feed" });
      Parser.prototype.parseURL = parseURLMock;

      const result = await validateRssFeed("https://example.com/valid-feed.xml");

      expect(parseURLMock).toHaveBeenCalledWith("https://example.com/valid-feed.xml");
      expect(result).toBe(true);
    });

    it("should return false for an invalid RSS feed", async () => {
      // Mock the parser to throw an error
      const parseURLMock = vi.fn().mockRejectedValue(new Error("Invalid feed"));
      Parser.prototype.parseURL = parseURLMock;

      const result = await validateRssFeed("https://example.com/invalid-feed.xml");

      expect(parseURLMock).toHaveBeenCalledWith("https://example.com/invalid-feed.xml");
      expect(result).toBe(false);
    });

    it("should return false if the feed has no title", async () => {
      // Mock the parser to return a feed without a title
      const parseURLMock = vi.fn().mockResolvedValue({ items: [] });
      Parser.prototype.parseURL = parseURLMock;

      const result = await validateRssFeed("https://example.com/no-title-feed.xml");

      expect(parseURLMock).toHaveBeenCalledWith("https://example.com/no-title-feed.xml");
      expect(result).toBe(false);
    });
  });
});
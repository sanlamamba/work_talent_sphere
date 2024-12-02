const snoowrap = require("snoowrap");
const config = require("../../config/config");
const scrapersConfig = require("../../config/scrapersConfig");
const redditClient = new snoowrap({
  ...config.redditClient,
});

const limiter = scrapersConfig.limiter;
const targetSubreddits = scrapersConfig.targetSubreddits;
const jobTypes = scrapersConfig.jobTypes;
const supportedCurrencies = scrapersConfig.supportedCurrencies;
const priceRegex = scrapersConfig.priceRegex;

async function fetchSubredditPosts(subreddit, limit = 50, depth = 2) {
  let results = [];
  let after = null;

  for (let i = 0; i < depth; i++) {
    try {
      const response = await limiter.schedule(() =>
        redditClient.getSubreddit(subreddit).getNew({ limit, after })
      );
      if (!response.length) break;

      results = results.concat(response);
      after = response[response.length - 1].name;
    } catch (error) {
      console.error(
        `Failed to fetch posts from subreddit ${subreddit} on page ${i + 1}:`,
        error.message
      );
      break;
    }
  }

  return results;
}

function extractPrices(text) {
  return [...text.matchAll(priceRegex)]
    .map((match) => {
      const currencyCode = Object.entries(supportedCurrencies).find(
        ([code, symbol]) =>
          code.toUpperCase() === match[1]?.toUpperCase() || symbol === match[2]
      )?.[0];

      const amount = match[3]?.replace(/,/g, "").replace(/\.?$/, "");

      return currencyCode && amount ? `${currencyCode} ${amount}` : null;
    })
    .filter(Boolean);
}

function determineJobType(text) {
  for (const [type, keywords] of Object.entries(jobTypes)) {
    if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
      return type;
    }
  }
  return "general";
}

async function processSubreddit(subreddit) {
  const posts = await fetchSubredditPosts(subreddit);

  const results = posts.map((post) => {
    try {
      const title = post.title.toLowerCase();
      const description = post.selftext ? post.selftext.toLowerCase() : "";
      if (!title.includes("hiring") && !description.includes("hiring"))
        return null;

      const combinedText = `${title} ${description}`;
      const prices = extractPrices(combinedText);
      const jobType = determineJobType(combinedText);
      const isNSFW = jobType === "nsfw" || post.over_18;

      return {
        title: post.title,
        description: post.selftext || "No description provided",
        source: "reddit",
        link: `https://reddit.com${post.permalink}`,
        price: prices.length > 0 ? prices.join(", ") : "Not specified",
        type: jobType,
        nsfw: isNSFW,
      };
    } catch (error) {
      console.error(
        `Error processing post with title "${post.title}":`,
        error.message
      );
      return null;
    }
  });

  return results.filter(Boolean);
}

module.exports = {
  name: "scrapeReddit",
  description: "Scrape job posts from Reddit",
  execute: async () => {
    const results = [];
    const subredditPromises = targetSubreddits.map((subreddit) =>
      processSubreddit(subreddit)
    );
    const allResults = (await Promise.all(subredditPromises)).flat();
    return allResults;
  },
};

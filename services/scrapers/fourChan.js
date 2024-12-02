const axios = require("axios");
const cheerio = require("cheerio");
const scrapersConfig = require("../../config/scrapersConfig");

const limiter = scrapersConfig.limiter;
const jobTypes = scrapersConfig.jobTypes;
const boards = scrapersConfig.boards;

async function fetch4chanPosts(board) {
  const url = `https://boards.4channel.org/${board}/`;
  try {
    const response = await limiter.schedule(() => axios.get(url));
    const $ = cheerio.load(response.data);

    return $(".thread")
      .map((_, thread) => {
        const title = $(thread).find(".postMessage").text().trim();
        const link = `https://boards.4channel.org/${board}/thread/${$(
          thread
        ).attr("id")}`;
        const description = $(thread).find(".postMessage").text().trim();

        if (
          title.toLowerCase().includes("hiring") ||
          title.toLowerCase().includes("job")
        ) {
          return {
            title,
            description,
            source: "4chan",
            link,
            price: "Not specified",
            type: determineJobType(`${title} ${description}`),
            nsfw:
              board === "b" ||
              board === "hc" ||
              title.toLowerCase().includes("nsfw"),
          };
        }
        return null;
      })
      .get()
      .filter(Boolean);
  } catch (error) {
    console.error(`Failed to fetch posts from /${board}/:`, error.message);
    return [];
  }
}

function determineJobType(text) {
  for (const [type, keywords] of Object.entries(jobTypes)) {
    if (keywords.some((keyword) => text.toLowerCase().includes(keyword))) {
      return type;
    }
  }
  return "general";
}

async function processBoards(boards) {
  try {
    const results = await Promise.all(
      boards.map((board) => fetch4chanPosts(board))
    );
    return results.flat();
  } catch (error) {
    console.error("Error processing boards:", error.message);
    return [];
  }
}

module.exports = {
  name: "scrape4chan",
  description: "Scrape job posts from multiple 4chan boards",
  execute: async () => {
    const results = await processBoards(boards);
    return results;
  },
};

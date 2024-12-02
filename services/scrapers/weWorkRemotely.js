const axios = require("axios");
const cheerio = require("cheerio");
const scrapersConfig = require("../../config/scrapersConfig");

const limiter = scrapersConfig.limiter;
const jobTypes = scrapersConfig.jobTypes;

async function fetchWeWorkRemotelyJobs() {
  try {
    const url = "https://weworkremotely.com/remote-jobs";
    const response = await limiter.schedule(() => axios.get(url));
    console.log();
    const $ = cheerio.load(response.data);

    const jobs = [];
    $(".job-list > li").each((_, el) => {
      const title = $(el).find(".title").text().trim();
      const description = $(el).find(".region").text().trim();
      const link = `https://weworkremotely.com${$(el).find("a").attr("href")}`;

      jobs.push({
        title,
        description,
        source: "weworkremotely",
        link,
        price: "Not specified",
        type: determineJobType(`${title} ${description}`),
        nsfw: false,
      });
    });

    return jobs;
  } catch (error) {
    console.error("Failed to fetch jobs from WeWorkRemotely:", error.message);
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

module.exports = {
  name: "scrapeWeWorkRemotely",
  description: "Scrape job posts from WeWorkRemotely",
  execute: async () => {
    const results = await fetchWeWorkRemotelyJobs();
    return results;
  },
};

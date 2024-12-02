const cron = require("node-cron");
const { scrapeData } = require("../services/scraperService");
const postCleaner = require("./postCleaner");

module.exports = {
  scheduleJobs(client) {
    // Job 1 - every 1st day of the week at 4:00 AM - Clean up posts that are older than 2
    cron.schedule("0 4 * * 1", () => {
      postCleaner.execute(client);
    });

    // Job 2 - every 1 minute - Scape Data and send to data channel
    cron.schedule("* * * * *", () => {
      scrapeData(client, channelIds.dataChannel);
    });
  },
};

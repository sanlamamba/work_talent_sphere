const cron = require("node-cron");
const { scrapeData } = require("../services/scraperService");
const postCleaner = require("./postCleaner");

const channelIds = {
  dataChannel: "CHANNEL_ID_1",
  updatesChannel: "CHANNEL_ID_2",
  alertsChannel: "CHANNEL_ID_3",
};

module.exports = {
  scheduleJobs(client) {
    console.log("Scheduling cron jobs...");
    // Job 1 - at 5:00 AM on the 1st of every month - Clean old posts
    cron.schedule("0 5 1 * *", () => {
      postCleaner.execute(client);
    });

    // Job 2 - every 1 minute - Scape Data and send to data channel
    cron.schedule("0 */6 * * *", () => {
      // TODO - Implement the scrapeData function
    });
  },
};

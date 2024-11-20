const cron = require("node-cron");
const { scrapeData } = require("../services/scraperService");

const channel_id = "";

module.exports = {
  scheduleJobs(client) {
    cron.schedule("0 * * * *", () => {
      scrapeData()
        .then((data) => {
          const channel = client.channels.cache.get(channel_id);
          channel.send(`Scheduled Data: ${data}`);
        })
        .catch(console.error);
    });
  },
};

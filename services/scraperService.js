const postScrapedJobsToForums = require("../utils/postScrapedJobsToForums");
const fourChanScraper = require("./scrapers/fourChan");
const redditScraper = require("./scrapers/reddit");
const weWorkRemotelyScraper = require("./scrapers/weWorkRemotely");

module.exports = {
  /**
   * Scrapes data from multiple sources and posts it to the appropriate job board forums.
   * @param {Client} client - The Discord client instance.
   * @param {string} channelId - ID of the channel to send scraping status updates (optional).
   */
  async scrapeData(client, channelId) {
    try {
      const [redditData, fourChanData, weWorkRemotelyData] = await Promise.all([
        redditScraper.execute(),
        fourChanScraper.execute(),
        weWorkRemotelyScraper.execute(), // TODO fix the iteration error
      ]);

      const data = [...redditData, ...fourChanData, ...weWorkRemotelyData];

      await postScrapedJobsToForums.execute(client, data);
    } catch (error) {
      console.error("❌ Error during scraping:", error);

      if (channelId) {
        try {
          const channel = await client.channels.fetch(channelId);
          if (channel) {
            await channel.send(
              "❌ An error occurred during data scraping. Please check the logs."
            );
          }
        } catch (fetchError) {
          console.error("❌ Failed to notify channel:", fetchError);
        }
      }
    }
  },
};

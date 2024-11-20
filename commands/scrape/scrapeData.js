const { scrapeData } = require("../../services/scraperService");

module.exports = {
  name: "scrapeData",
  description: "Scrape data and post it",
  execute(message) {
    scrapeData()
      .then((data) => message.channel.send(`Data: ${data}`))
      .catch((err) => console.error(err));
  },
};

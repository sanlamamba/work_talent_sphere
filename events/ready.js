const { submitTicket } = require("../config/channels-naming-config");
const ScamReportStarter = require("../utils/ScamReportStarter");
const supportTicketStarter = require("../utils/supportTicketStarter");
const verifyMeStarter = require("../utils/verifyMeStarter");
module.exports = {
  execute(client) {
    const supportChannel = submitTicket;
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get("1303638656342560768").send("Bot is online!");
    client.guilds.cache.forEach((guild) => {
      const channel = guild.channels.cache.find(
        (channel) => channel.name === supportChannel
      );
      const scamReportChannel = guild.channels.cache.find(
        (channel) => channel.name === "report-a-scam"
      );
      const verifyMeChannel = guild.channels.cache.find(
        (channel) => channel.name === "verify-me"
      );
      const dramaChannel = guild.channels.cache.find(
        (channel) => channel.name === "drama"
      );
      const shouldDelete = true;
      if (dramaChannel && shouldDelete) {
        dramaChannel.bulkDelete(100);
        console.log("Deleted all messages in drama channel");
      }
      if (channel) {
        supportTicketStarter.execute(channel);
      }
      if (scamReportChannel) {
        ScamReportStarter.execute(scamReportChannel);
      }
      if (verifyMeChannel) {
        verifyMeStarter.execute(verifyMeChannel);
      }
    });
  },
};

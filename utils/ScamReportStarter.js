const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "ScamReportStarter",
  description: "Initialize the scam report system",
  async execute(channel) {
    try {
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("reportScam")
          .setLabel("Report a Scam")
          .setStyle(ButtonStyle.Danger)
      );

      const messages = await channel.messages.fetch({ limit: 100 });

      const messagesFromThisBot = messages.filter(
        (msg) => msg.author.id === channel.client.user.id
      );

      const existingMessage = messagesFromThisBot.find(
        (msg) =>
          msg.components.length > 0 &&
          msg.components[0].components[0]?.customId === "reportScam"
      );

      if (existingMessage) {
        await existingMessage.edit({
          components: [actionRow],
        });

        const messagesToDelete = messagesFromThisBot.filter(
          (msg) => msg.id !== existingMessage.id
        );
        for (const [, msg] of messagesToDelete) {
          await msg.delete();
        }
      } else {
        await channel.send({
          components: [actionRow],
        });

        for (const [, msg] of messagesFromThisBot) {
          await msg.delete();
        }
      }
    } catch (error) {
      console.error("Error executing ScamReportStarter:", error);
      channel.send(
        "❌ An error occurred while setting up the scam reporting system."
      );
    }
  },
};

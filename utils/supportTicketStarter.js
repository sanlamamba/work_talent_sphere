const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "SupportTicketStarter",
  description: "Start the support ticket system",
  async execute(channel) {
    try {
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("submitTicket")
          .setLabel("Start Support Ticket")
          .setStyle(ButtonStyle.Primary)
      );

      const messages = await channel.messages.fetch({ limit: 100 });

      const messagesFromThisBot = messages.filter(
        (msg) => msg.author.id === channel.client.user.id
      );

      const existingMessage = messagesFromThisBot.find(
        (msg) =>
          msg.components.length > 0 &&
          msg.components[0].components[0]?.customId === "submitTicket"
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
      console.error("Error executing SupportTicketStarter:", error);
      channel.send(
        "❌ An error occurred while setting up the support ticket system."
      );
    }
  },
};

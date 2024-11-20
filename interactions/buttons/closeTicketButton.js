module.exports = {
  name: "closeTicketButton",
  description: "This is a close ticket button",
  async execute(interaction, userIdFromOpen) {
    try {
      const user = await interaction.client.users.fetch(userIdFromOpen);
      const currentUser = interaction.user;
      const ticketClosedMessage = `🎫 Your ticket has been closed by @${currentUser.tag}. If you need further assistance, feel free to open a new ticket.`;
      user.send(ticketClosedMessage, {
        allowedMentions: { parse: [] },
      });
      await interaction.message.delete();
      await interaction.channel.send(
        `🎫 Ticket closed by ${currentUser.tag} for ${
          user.tag
        } on: ${new Date().toLocaleString()}`
      );
    } catch (error) {
      console.error("Error executing closeTicketButton:", error);
      interaction.channel.send(
        "❌ An error occurred while closing the ticket."
      );
    }
  },
};

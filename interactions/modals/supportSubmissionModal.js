const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  customId: "supportSubmissionModal",

  createModal(interaction) {
    const modal = new ModalBuilder()
      .setCustomId(this.customId)
      .setTitle(`Support Ticket a new ticket`);

    const urgencyInput = new TextInputBuilder()
      .setCustomId("urgency")
      .setLabel("Is this an urgent issue? (Yes / No)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const issueTypeInput = new TextInputBuilder()
      .setCustomId("issueType")
      .setLabel("What type of issue? (Billing, Bug, etc.)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const contactInput = new TextInputBuilder()
      .setCustomId("contact")
      .setLabel("Preferred Contact Information")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const detailsInput = new TextInputBuilder()
      .setCustomId("details")
      .setLabel("Describe your issue in detail")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(urgencyInput),
      new ActionRowBuilder().addComponents(issueTypeInput),
      new ActionRowBuilder().addComponents(contactInput),
      new ActionRowBuilder().addComponents(detailsInput)
    );

    return modal;
  },

  async handleModalSubmit(interaction) {
    const urgency = interaction.fields.getTextInputValue("urgency");
    const issueType = interaction.fields.getTextInputValue("issueType");
    const contact = interaction.fields.getTextInputValue("contact");
    const details = interaction.fields.getTextInputValue("details");

    const supportEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Support Ticket from ${interaction.user.tag}`)
      .addFields(
        { name: "Urgency", value: urgency, inline: true },
        { name: "Issue Type", value: issueType, inline: true },
        { name: "Contact Info", value: contact, inline: false },
        { name: "Details", value: details, inline: false }
      )
      .setTimestamp()
      .setFooter({
        text: `User ID: ${interaction.user.id}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const supportChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "tickets"
    );
    if (supportChannel) {
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`closeTicket-${interaction.user.id}`)
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Success)
      );
      await supportChannel.send({
        content: `${interaction.user}`,
        embeds: [supportEmbed],
        components: [actionRow],
      });

      await await interaction.reply({
        content: "✅ Your support ticket has been submitted successfully!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "❌ Support channel not found. Please contact an admin.",
        ephemeral: true,
      });
    }
  },
};

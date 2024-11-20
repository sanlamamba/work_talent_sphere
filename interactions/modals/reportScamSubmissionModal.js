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
  customId: "reportScamSubmissionModal",

  createModal() {
    const modal = new ModalBuilder()
      .setCustomId(this.customId)
      .setTitle("🚨 Report a Scam");

    const scamTypeInput = new TextInputBuilder()
      .setCustomId("scamType")
      .setLabel("Type of Scam (e.g., phishing, impersonation)")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("e.g., Phishing, Fake Offer")
      .setRequired(true);

    const scammerUsernameInput = new TextInputBuilder()
      .setCustomId("scammerUsername")
      .setLabel("Scammer's Username/ID (if available)")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("e.g., @Scammer123 or Discord ID")
      .setRequired(false);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("Describe the scam in detail")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Provide as much detail as possible.")
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(scamTypeInput),
      new ActionRowBuilder().addComponents(scammerUsernameInput),
      new ActionRowBuilder().addComponents(descriptionInput)
    );

    return modal;
  },

  async handleModalSubmit(interaction) {
    const scamType = interaction.fields.getTextInputValue("scamType");
    const scammerUsername =
      interaction.fields.getTextInputValue("scammerUsername") || "Not provided";
    const description = interaction.fields.getTextInputValue("description");

    const scamReportEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("🚨 New Scam Report")
      .setDescription(
        "A new scam report has been submitted. Moderators, please review the details below."
      )
      .addFields(
        { name: "Scam Type", value: scamType, inline: true },
        { name: "Scammer Username/ID", value: scammerUsername, inline: true },
        { name: "Description", value: description, inline: false }
      )
      .setTimestamp()
      .setFooter({
        text: `Reported by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const reportChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "tickets"
    );

    if (reportChannel) {
      const actionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`closeTicket-${interaction.user.id}`)
          .setLabel("Mark as Reviewed")
          .setStyle(ButtonStyle.Success)
      );

      await reportChannel.send({
        content: `🔔 **New Scam Report  ${interaction.user}.**`,
        embeds: [scamReportEmbed],
        components: [actionRow],
      });

      await interaction.reply({
        content:
          "✅ Your scam report has been submitted successfully! Please ensure you have gathered all relevant evidence to assist the moderators.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "❌ Scam reports channel not found. Please contact an admin.",
        ephemeral: true,
      });
    }
  },
};

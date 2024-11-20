const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  customId: "verifyMeSubmissionModal",

  createModal() {
    const modal = new ModalBuilder()
      .setCustomId(this.customId)
      .setTitle("Verification Request - Work and Talent Sphere");

    const socialLinksInput = new TextInputBuilder()
      .setCustomId("socialLinks")
      .setLabel("Social Media Links")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(
        "Provide links to professional profiles (LinkedIn, GitHub, etc.)."
      )
      .setRequired(true);

    const portfolioInput = new TextInputBuilder()
      .setCustomId("portfolio")
      .setLabel("Portfolio or Work Samples")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Provide links to your work or project examples.")
      .setRequired(true);

    const websiteInput = new TextInputBuilder()
      .setCustomId("website")
      .setLabel("Professional/Business Website")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(
        "Optional: Provide your website (e.g., https://example.com)"
      )
      .setRequired(false);

    const endorsementsInput = new TextInputBuilder()
      .setCustomId("endorsements")
      .setLabel("Endorsements")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder(
        "Provide names of verified members or links to endorsements."
      )
      .setRequired(true);

    const reviewsInput = new TextInputBuilder()
      .setCustomId("reviews")
      .setLabel("Client Reviews/Testimonials")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Provide links to client reviews or testimonials.")
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(socialLinksInput),
      new ActionRowBuilder().addComponents(portfolioInput),
      new ActionRowBuilder().addComponents(websiteInput),
      new ActionRowBuilder().addComponents(endorsementsInput),
      new ActionRowBuilder().addComponents(reviewsInput)
    );

    return modal;
  },

  async handleModalSubmit(interaction) {
    console.log(interaction.fields);
    const socialLinks = interaction.fields.getTextInputValue("socialLinks");
    const portfolio = interaction.fields.getTextInputValue("portfolio");
    const website = interaction.fields.getTextInputValue("website") || "N/A";
    const endorsements = interaction.fields.getTextInputValue("endorsements");
    const reviews = interaction.fields.getTextInputValue("reviews");

    const verificationEmbed = new EmbedBuilder()
      .setColor("#FFD700")
      .setTitle("🛡️ Verification Request")
      .setDescription(
        `A member has submitted a verification request. Please review the details below:`
      )
      .addFields(
        { name: "🔗 Social Media Links", value: socialLinks, inline: false },
        { name: "📂 Portfolio/Work Samples", value: portfolio, inline: false },
        { name: "🌐 Website", value: website, inline: false },
        {
          name: "📜 Endorsements",
          value: endorsements,
          inline: false,
        },
        {
          name: "📝 Client Reviews/Testimonials",
          value: reviews,
          inline: false,
        }
      )
      .setTimestamp()
      .setFooter({
        text: `Submitted by ${interaction.user.tag} | ID: ${interaction.user.id}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const verificationChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "tickets"
    );

    if (verificationChannel) {
      await verificationChannel.send({
        content: `🔔 **New Verification Request by ${interaction.user}**`,
        embeds: [verificationEmbed],
      });

      await interaction.reply({
        content:
          "✅ Your verification request has been submitted! A moderator will reach out to you shortly.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "❌ The verification channel could not be found. Please contact a moderator.",
        ephemeral: true,
      });
    }
  },
};

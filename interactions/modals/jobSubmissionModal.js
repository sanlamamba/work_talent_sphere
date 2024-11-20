const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  customId: "jobSubmissionModal",

  createModal(jobType) {
    const modal = new ModalBuilder()
      .setCustomId(this.customId)
      .setTitle("Submit a Job");
    const jobTypeField = new TextInputBuilder()
      .setCustomId("jobTypeField")
      .setLabel("Job Type")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(jobType);

    const titleInput = new TextInputBuilder()
      .setCustomId("title")
      .setLabel("Job Title")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const priceInput = new TextInputBuilder()
      .setCustomId("price")
      .setLabel("Compensation (e.g., $1000, Negotiable)")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const locationInput = new TextInputBuilder()
      .setCustomId("location")
      .setLabel("Location")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descriptionInput = new TextInputBuilder()
      .setCustomId("description")
      .setLabel("Job Description")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder().addComponents(titleInput),
      new ActionRowBuilder().addComponents(jobTypeField),
      new ActionRowBuilder().addComponents(priceInput),
      new ActionRowBuilder().addComponents(locationInput),
      new ActionRowBuilder().addComponents(descriptionInput)
    );

    return modal;
  },

  async handleModalSubmit(interaction) {
    const title = interaction.fields.getTextInputValue("title");
    const price = interaction.fields.getTextInputValue("price");
    const location = interaction.fields.getTextInputValue("location");
    const description = interaction.fields.getTextInputValue("description");
    const jobType = interaction.fields.getTextInputValue("jobTypeField");

    const experienceLevel =
      interaction.client.selectedExperience || "Not specified";

    // delete interaction.client.selectedExperience;
    delete interaction.client.selectedJobType;

    const jobEmbed = new EmbedBuilder()
      .setColor("#4caf50")
      .setTitle(title)
      .setDescription(description)
      .addFields(
        { name: "Compensation", value: price, inline: true },
        { name: "Location", value: location, inline: true },
        { name: "Experience Level", value: experienceLevel, inline: true },
        { name: "Job Type", value: jobType, inline: true }
      )
      .setTimestamp()
      .setFooter({
        text: `Posted by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    const targetChannel = interaction.guild.channels.cache.find(
      (channel) => channel.name === "post-a-job"
    );
    if (targetChannel) {
      targetChannel.send({ embeds: [jobEmbed] });
      await interaction.reply({
        content: "Your job has been posted!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "Job postings channel not found.",
        ephemeral: true,
      });
    }
  },
};

const {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  customId: "jobSubmissionModal",

  /**
   * Creates a modal for job submission based on the job type.
   * @param {string} jobType - The type of job (e.g., design, development, marketing).
   * @returns {ModalBuilder} The constructed modal.
   */
  createModal(jobType) {
    const modal = new ModalBuilder()
      .setCustomId(`${this.customId}_${jobType}`)
      .setTitle(`Submit a ${jobType} Job`);

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
      new ActionRowBuilder().addComponents(priceInput),
      new ActionRowBuilder().addComponents(locationInput),
      new ActionRowBuilder().addComponents(descriptionInput)
    );

    return modal;
  },

  /**
   * Handles modal submission and creates a forum post for the job.
   * @param {Interaction} interaction - The interaction object from the Discord API.
   * @param {string} jobType - The type of job (e.g., design, development, marketing).
   */
  async handleModalSubmit(interaction, jobType) {
    const rolesToTag = {
      design: ["1302736172602363938", "1302736177866211368"],
      development: ["1302736172602363938", "1302736183545299024"],
      marketing: ["1302736172602363938", "1302736188863680542"],
      nsfw: ["1302736172602363938"],
    };

    try {
      const title = interaction.fields.getTextInputValue("title");
      const price = interaction.fields.getTextInputValue("price");
      const location = interaction.fields.getTextInputValue("location");
      const description = interaction.fields.getTextInputValue("description");

      const roleMentions =
        rolesToTag[jobType]?.map((roleId) => `||<@&${roleId}>||`).join(" ") ||
        "";

      const jobEmbed = new EmbedBuilder()
        .setColor("#4caf50")
        .setTitle(title)
        .setDescription(description)
        .addFields(
          { name: "Compensation", value: price, inline: true },
          { name: "Location", value: location, inline: true },
          { name: "Job Type", value: jobType, inline: true },
          {
            name: "Posted By",
            value: `||<@${interaction.user.id}>||`,
            inline: false,
          }
        )
        .setTimestamp()
        .setFooter({
          text: `Posted by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.reply({
        content: "✅ Your job has been posted!",
        ephemeral: true,
      });

      const jobBoardChannel = interaction.guild.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildForum &&
          channel.name === `${jobType}-job-board`
      );

      const generalJobBoardChannel = interaction.guild.channels.cache.find(
        (channel) =>
          channel.type === ChannelType.GuildForum &&
          channel.name === "job-board"
      );

      if (jobBoardChannel) {
        await jobBoardChannel.threads.create({
          name: title,
          message: {
            embeds: [jobEmbed],
            content: `📢 **New Job Has been Posted** \n ${roleMentions}`,
            allowedMentions: { roles: rolesToTag[jobType] },
          },
        });
      } else {
        console.log(`⚠️ Job board channel for ${jobType} not found.`);
      }

      if (generalJobBoardChannel) {
        await generalJobBoardChannel.threads.create({
          name: `${title}`,
          message: {
            embeds: [jobEmbed],
            content: `📢 **New ${jobType} Job has been Posted!**\n${roleMentions}`,
            allowedMentions: { roles: rolesToTag[jobType] },
          },
        });
      } else {
        console.log("⚠️ General job board channel not found.");
      }
    } catch (error) {
      console.error("❌ Error handling job submission modal:", error);
      await interaction.reply({
        content: "❌ There was an error posting your job. Please try again.",
        ephemeral: true,
      });
    }
  },
};

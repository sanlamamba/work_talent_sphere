const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "postjob",
  description: "Post a job with an interactive form",
  async execute(message) {
    const jobEmbed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Job Posting")
      .setDescription(
        "Click the button below to start submitting a job listing."
      );

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("submitJob")
        .setLabel("Submit Job")
        .setStyle(ButtonStyle.Primary)
    );

    await message.channel.send({ embeds: [jobEmbed], components: [row] });
  },
};

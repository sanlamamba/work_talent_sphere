const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  async execute(interaction) {
    const jobTypeSelect = new StringSelectMenuBuilder()
      .setCustomId("jobType")
      .setPlaceholder("Select Job Type")
      .addOptions(
        { label: "Design", value: "Design" },
        { label: "Development", value: "Development" },
        { label: "DevOps", value: "DevOps" },
        { label: "Marketing", value: "Marketing" },
        { label: "Sales", value: "Sales" }
      );

    const row1 = new ActionRowBuilder().addComponents(jobTypeSelect);

    await interaction.reply({
      content: "Please select the job type.",
      components: [row1],
      ephemeral: true,
    });
  },
};

module.exports = {
  // FIX Add the necessary code to complete the jobTypeSelect interaction
  async execute(interaction) {
    interaction.client.selectedJobType = interaction.values[0];

    await interaction.deferUpdate();
  },
};

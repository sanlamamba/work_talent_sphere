module.exports = {
  async execute(interaction) {
    // Store the selected job type
    interaction.client.selectedJobType = interaction.values[0];

    // Acknowledge the interaction with a deferred response
    await interaction.deferUpdate();
  },
};

const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  async execute(interaction, jobType) {
    const jobSubmissionModal = require("../modals/jobSubmissionModal.js");
    const modal = jobSubmissionModal.createModal(jobType);
    await interaction.showModal(modal);
  },
};

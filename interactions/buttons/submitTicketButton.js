const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
  async execute(interaction) {
    const modalFile = require("../modals/supportSubmissionModal.js");
    const modal = modalFile.createModal();
    await interaction.showModal(modal);
  },
};

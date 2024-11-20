module.exports = {
  async execute(interaction) {
    console.log("Experience level interaction received.");

    // if (interaction.customId !== "experienceLevel") {
    //   console.error("Unexpected customId for experience level interaction.");
    //   return;
    // }

    console.log("Selected experience level:", interaction.values[0]);

    interaction.client.selectedExperience = interaction.values[0];

    await interaction.deferUpdate();

    if (interaction.client.selectedJobType) {
      const modalFile = require("../modals/jobSubmissionModal.js");
      const modal = modalFile.createModal();
      await interaction.showModal(modal);
    }
  },
};

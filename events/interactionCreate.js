const fs = require("fs");
const path = require("path");
const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isButton()) {
        if (interaction.customId.startsWith("closeTicket-")) {
          const buttonFile = path.join(
            __dirname,
            "../interactions/buttons/closeTicketButton.js"
          );
          if (fs.existsSync(buttonFile)) {
            const buttonHandler = require(buttonFile);
            await buttonHandler.execute(
              interaction,
              interaction.customId.split("-")[1]
            );
          }
        }
        if (interaction.customId.startsWith("submitJob_")) {
          const buttonFile = path.join(
            __dirname,
            "../interactions/buttons/submitJobButton.js"
          );
          if (fs.existsSync(buttonFile)) {
            const buttonHandler = require(buttonFile);
            await buttonHandler.execute(
              interaction,
              interaction.customId.split("_")[1]
            );
          }
        }

        const buttonFile = path.join(
          __dirname,
          "../interactions/buttons",
          `${interaction.customId}Button.js`
        );
        if (fs.existsSync(buttonFile)) {
          const buttonHandler = require(buttonFile);
          await buttonHandler.execute(interaction);
        }
      }

      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === "jobType") {
          const jobTypeModal = require("../interactions/modals/jobSubmissionModal.js");
          const modal = jobTypeModal.createModal();
          await interaction.showModal(modal);
        }
        const selectFile = path.join(
          __dirname,
          "../interactions/selects",
          `${interaction.customId}Select.js`
        );
        if (fs.existsSync(selectFile)) {
          const selectHandler = require(selectFile);
          await selectHandler.execute(interaction);
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith("jobSubmissionModal_")) {
          const modalFile = path.join(
            __dirname,
            "../interactions/modals/jobSubmissionModal.js"
          );
          if (fs.existsSync(modalFile)) {
            const modalHandler = require(modalFile);
            await modalHandler.handleModalSubmit(
              interaction,
              interaction.customId.split("_")[1]
            );
          }
        }
        console.log("Handling modal submit for", interaction.customId);
        const modalFile = path.join(
          __dirname,
          "../interactions/modals",
          `${interaction.customId}.js`
        );
        if (fs.existsSync(modalFile)) {
          const modalHandler = require(modalFile);
          await modalHandler.handleModalSubmit(interaction);
        }
      }
    } catch (error) {
      console.error("Error handling interaction:", error);
      interaction.reply({
        content: "There was an error processing your request.",
        ephemeral: true,
      });
    }
  },
};

const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  name: "SubmitJobStarter",
  description: "Start the submit job system with multiple job types",
  async execute(channel) {
    try {
      const jobTypes = [
        {
          id: "submitJob_design",
          label: "Submit Design Job",
          style: ButtonStyle.Primary,
        },
        {
          id: "submitJob_development",
          label: "Submit Development Job",
          style: ButtonStyle.Success,
        },
        {
          id: "submitJob_marketing",
          label: "Submit Marketing Job",
          style: ButtonStyle.Secondary,
        },
        {
          id: "submitJob_nsfw",
          label: "Submit NSFW Job",
          style: ButtonStyle.Danger,
        },
      ];

      const row = new ActionRowBuilder();
      jobTypes.forEach((job) => {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(job.id)
            .setLabel(job.label)
            .setStyle(job.style)
        );
      });

      const messages = await channel.messages.fetch({ limit: 100 });
      const messagesFromThisBot = messages.filter(
        (msg) => msg.author.id === channel.client.user.id
      );
      const existingMessage = messagesFromThisBot.find(
        (msg) =>
          msg.components.length > 0 &&
          msg.components[0].components.some((component) =>
            jobTypes.map((job) => job.id).includes(component.customId)
          )
      );

      if (existingMessage) {
        await existingMessage.edit({
          components: [row],
        });

        const messagesToDelete = messagesFromThisBot.filter(
          (msg) => msg.id !== existingMessage.id
        );
        for (const [, msg] of messagesToDelete) {
          await msg.delete();
        }
      } else {
        await channel.send({
          components: [row],
        });

        for (const [, msg] of messagesFromThisBot) {
          await msg.delete();
        }
      }
    } catch (error) {
      console.error("Error executing SubmitJobStarter:", error);
      await channel.send(
        "❌ An error occurred while setting up the job submission system."
      );
    }
  },
};

const { EmbedBuilder, ChannelType } = require("discord.js");

const jobBoards = [
  "design-job-board",
  "dev-job-board",
  "marketing-job-board",
  "nsfw-job-board",
  "job-board",
];

module.exports = {
  name: "purge",
  description: "Clear all job board forums",
  /**
   * Clears all job board forums and provides a response embed.
   * @param {Message} message - The Discord message object.
   */
  async execute(message) {
    try {
      const startTime = Date.now();
      const tempMessage = await message.channel.send(
        "🧹 Clearing job boards..."
      );

      const clearedBoards = [];
      const failedBoards = [];

      for (const boardName of jobBoards) {
        const jobBoardChannel = message.guild.channels.cache.find(
          (channel) =>
            channel.type === ChannelType.GuildForum &&
            channel.name === boardName
        );

        if (!jobBoardChannel) {
          console.warn(`⚠️ Job board not found: ${boardName}`);
          failedBoards.push(boardName);
          continue;
        }

        try {
          const activeThreads = await jobBoardChannel.threads.fetchActive();
          const archivedThreads = await jobBoardChannel.threads.fetchArchived();

          const allThreads = [
            ...activeThreads.threads.values(),
            ...archivedThreads.threads.values(),
          ];

          for (const thread of allThreads) {
            await thread.delete();
          }

          clearedBoards.push(boardName);
        } catch (error) {
          console.error(`❌ Failed to clear job board: ${boardName}`, error);
          failedBoards.push(boardName);
        }
      }

      const latency = Date.now() - startTime;
      const timeTaken = (latency / 1000).toFixed(2) + "s";
      const apiLatency = Math.round(message.client.ws.ping);

      const embed = new EmbedBuilder()
        .setColor("#00bfff")
        .setTitle("🧹 Job Boards Cleared!")
        .setDescription(
          clearedBoards.length
            ? `Successfully cleared the following job boards:\n${clearedBoards
                .map((name) => `• ${name}`)
                .join("\n")}`
            : "No job boards were cleared."
        )
        .addFields(
          {
            name: "⚠️ Failed to clear",
            value:
              failedBoards.length > 0
                ? failedBoards.map((name) => `• ${name}`).join("\n")
                : "None",
            inline: true,
          },
          { name: "Bot Latency", value: `${latency}ms`, inline: true },
          { name: "API Latency", value: `${apiLatency}ms`, inline: true },
          { name: "Time Taken", value: timeTaken, inline: true }
        )
        .setFooter({
          text: `Command executed by @${message.author.tag}`,
          iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp();

      await tempMessage.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error("❌ An error occurred while clearing job boards:", error);
      await message.channel.send(
        "❌ Failed to clear job boards. Please try again."
      );
    }
  },
};

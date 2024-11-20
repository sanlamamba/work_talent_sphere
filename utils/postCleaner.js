const { ChannelType } = require("discord.js");

module.exports = {
  name: "postCleaner",

  /**
   * Cleans posts older than a month from job board forums.
   * @param {Client} client - The Discord client instance.
   */
  async execute(client) {
    console.log("Post cleaner started...");

    const jobBoardNames = [
      "job-board",
      "design-job-board",
      "dev-job-board",
      "marketing-job-board",
      "nsfw-job-board",
    ];

    try {
      client.guilds.cache.forEach(async (guild) => {
        jobBoardNames.forEach(async (boardName) => {
          const forumChannel = guild.channels.cache.find(
            (channel) =>
              channel.type === ChannelType.GuildForum &&
              channel.name === boardName
          );

          if (!forumChannel) {
            console.log(
              `⚠️ Forum channel "${boardName}" not found in guild "${guild.name}".`
            );
            return;
          }

          const threads = await forumChannel.threads.fetchActive();
          const now = Date.now();

          threads.threads.forEach(async (thread) => {
            const threadAge = now - thread.createdTimestamp;
            const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

            if (threadAge > oneMonthInMs) {
              try {
                await thread.delete();
                console.log(
                  `🗑️ Deleted thread "${thread.name}" in "${forumChannel.name}".`
                );
              } catch (error) {
                console.error(
                  `❌ Failed to delete thread "${thread.name}":`,
                  error
                );
              }
            }
          });
        });
      });

      // TODO add the ability to clean the messages from the scrapers too

      console.log("Post cleaner completed. 🗑️");
    } catch (error) {
      console.error("❌ Error during post cleaning:", error);
    }
  },
};

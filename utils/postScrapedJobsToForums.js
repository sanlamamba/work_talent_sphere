const { ChannelType, EmbedBuilder } = require("discord.js");
const scrapersConfig = require("../config/scrapersConfig");

const JOB_TYPE_COLORS = scrapersConfig.colors;

module.exports = {
  name: "postScrapedJobsToForums",
  description: "Post scraped job data to the job board forums",
  /**
   * Posts scraped job data to the job board forums.
   * @param {Client} client - The Discord client instance.
   * @param {Object[]} jobData - An array of job data objects.
   */
  async execute(client, jobData) {
    if (!jobData || !Array.isArray(jobData) || jobData.length === 0) {
      console.warn("⚠️ No valid job data provided.");
      return;
    }

    client.guilds.cache.forEach((guild) => {
      const jobBoardChannels = guild.channels.cache.filter(
        (channel) =>
          channel.type === ChannelType.GuildForum &&
          (channel.name === "job-board" || channel.name.endsWith("-job-board"))
      );

      if (!jobBoardChannels.size) {
        console.warn(`⚠️ No job board forums found in guild: ${guild.name}`);
        return;
      }

      jobData.forEach(async (job) => {
        try {
          if (!job.title || !job.type || !job.link) {
            console.warn("⚠️ Skipping invalid job data:", job);
            return;
          }

          const jobType = job.type.toLowerCase();
          const targetChannel = jobBoardChannels.find(
            (channel) =>
              channel.name === `${jobType}-job-board` ||
              channel.name === "job-board"
          );

          if (!targetChannel) {
            console.warn(`⚠️ No forum found for job type: ${jobType}`);
            return;
          }

          const threadName =
            job.title.length > 100 ? `${job.title.slice(0, 97)}...` : job.title;

          const description =
            job.description && job.description.length > 256
              ? `${job.description.slice(0, 250)}...`
              : job.description || "No description provided.";

          const embedColor =
            JOB_TYPE_COLORS[jobType] || JOB_TYPE_COLORS.default;

          const jobEmbed = new EmbedBuilder()
            .setColor(embedColor)
            .setTitle(job.title)
            .setDescription(description)
            .addFields(
              {
                name: "💰 Compensation",
                value: job.price || "Not specified",
                inline: true,
              },
              {
                name: "🔗 Source",
                value: job.link ? `[View Post](${job.link})` : "Not available",
                inline: true,
              },
              {
                name: "📂 Job Type",
                value: jobType.charAt(0).toUpperCase() + jobType.slice(1),
                inline: true,
              }
            )
            .setTimestamp()
            .setFooter({
              text: "Job Scraped from External Source",
            });

          await targetChannel.threads.create({
            name: threadName,
            message: {
              embeds: [jobEmbed],
            },
          });
        } catch (error) {
          console.error(
            `❌ Failed to post job: "${job.title || "unknown"}"`,
            error
          );
        }
      });
    });
  },
};

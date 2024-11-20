const { ActivityType } = require("discord.js");

// Define the list of activities
const activities = [
  { type: ActivityType.Watching, message: "like a big brother" },
  { type: ActivityType.Playing, message: "with your feelings" },
  { type: ActivityType.Listening, message: "to your secrets" },
  { type: ActivityType.Streaming, message: "your life" },
  { type: ActivityType.Custom, message: "Finding you a job" },
  { type: ActivityType.Custom, message: "Finding your next partner" },
  { type: ActivityType.Custom, message: "Blocking a scammer" },
  { type: ActivityType.Custom, message: "Reporting a scammer" },
];

let currentIndex = 0;

module.exports = {
  /**
   * Sets a single activity for the bot.
   * @param {Client} client - The Discord client instance.
   * @param {Boolean} random - Whether to set a random activity from the list.
   */
  setSingleActivity(client, random = false) {
    index = random
      ? Math.floor(Math.random() * activities.length)
      : currentIndex;
    const { type, message } = activities[index];
    client.user.setActivity(message, { type });

    console.log(`🔄 Single Activity set: ${message} (${ActivityType[type]})`);
    currentIndex = (index + 1) % activities.length;
  },

  /**
   * Starts rotating the bot's activity through the predefined activities at a specified interval.
   * @param {Client} client - The Discord client instance.
   * @param {number} interval - Interval in seconds to rotate activities.
   */
  startActivityRotation(client, interval = 30) {
    const updateActivity = () => {
      const { type, message } = activities[currentIndex];
      client.user.setActivity(message, { type });
      console.log(`🔄 Activity updated: ${message} (${ActivityType[type]})`);

      currentIndex = (currentIndex + 1) % activities.length;
    };

    updateActivity();
    setInterval(updateActivity, interval * 1000);
  },
};

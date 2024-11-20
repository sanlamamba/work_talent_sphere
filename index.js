const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config/config.js");
const { scheduleJobs } = require("./utils/scheduler.js");
const client = require("./bot/bot.js");

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

fs.readdirSync(commandsPath).forEach((folder) => {
  const folderPath = path.join(commandsPath, folder);

  if (fs.lstatSync(folderPath).isDirectory()) {
    fs.readdirSync(folderPath).forEach((file) => {
      const commandPath = path.join(folderPath, file);

      if (fs.lstatSync(commandPath).isFile() && file.endsWith(".js")) {
        const command = require(commandPath);
        client.commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
      }
    });
  }
});

const eventsPath = path.join(__dirname, "events");

fs.readdirSync(eventsPath).forEach((file) => {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];
  client.on(eventName, (...args) => event.execute(...args, client));
});

client.login(config.token).then(() => {
  scheduleJobs(client);

  console.log("Bot is online and running.");

  process.on("SIGINT", async () => {
    console.log("Shutting down bot...");
    const shutdownChannelId = "1303638656342560768";
    const shutdownChannel = client.channels.cache.get(shutdownChannelId);

    if (shutdownChannel) {
      try {
        await shutdownChannel.send("Bot is going offline. See you later! 👋");
      } catch (error) {
        console.error("Failed to send shutdown message:", error);
      }
    }

    client.destroy();
    console.log("Bot disconnected.");
    process.exit(0);
  });
});

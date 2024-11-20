module.exports = {
  name: "messageCreate",
  execute(message) {
    const config = require("../config/config.js");

    if (!message.content.startsWith(config.prefix) || message.author.bot)
      return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);

    if (!command) {
      return message.reply(
        `Unknown command. Type \`${config.prefix}help\` to see available commands.`
      );
    }

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("There was an error executing that command.");
    }
  },
};

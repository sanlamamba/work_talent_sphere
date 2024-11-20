const helpCommandContent = require("../../utils/helpCommandContent");

module.exports = {
  name: "help",
  description: "List available commands",
  execute(message) {
    const commands = message.client.commands;

    const embedBuilder = helpCommandContent.execute(commands, message);

    if (embedBuilder instanceof Object && "setTitle" in embedBuilder) {
      message.channel.send({ embeds: [embedBuilder] });
    } else {
      message.channel.send(embedBuilder);
    }
  },
};

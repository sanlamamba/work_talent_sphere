const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Ping the bot to check responsiveness",
  async execute(message) {
    const startTime = Date.now();
    const tempMessage = await message.channel.send("🏓 Calculating ping...");

    const latency = Date.now() - startTime;
    const apiLatency = Math.round(message.client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor("#00bfff")
      .setTitle("🏓 Pong!")
      .setDescription(`Here are the response times:`)
      .addFields(
        { name: "I am alive!", value: "I am alive! ⛑" },
        { name: "Bot Latency", value: `${latency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      )
      .setFooter({
        text: `Ping command executed by @${message.author.tag}`, // TODO mention user
        iconURL: message.author.displayAvatarURL(),
      })
      .setTimestamp();
    await message.delete();
    await tempMessage.edit({ content: null, embeds: [embed] });
  },
};

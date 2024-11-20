const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "restrict",
  description: "Give a user a role that restricts their access to the server",
  async execute(message) {
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("Please mention the user you want to restrict");
    }
    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply("User is not in the server");
    }
    const role = message.guild.roles.cache.find(
      (role) => role.name === "Restricted"
    );
    if (!role) {
      return message.reply("Role not found");
    }
    member.roles.add(role);
    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setTitle("Restricted Access")
      .setDescription(
        `You have been restricted from accessing the server. Please contact a moderator for more information.`
      );
    try {
      await member.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error sending message to user:", error);
      return message.reply(
        "User has been restricted, but I could not send them a DM"
      );
    }
    // send a ephemeral message to the moderator
    const dramaChannel = message.guild.channels.cache.find(
      (channel) => channel.name === "drama"
    );
    if (dramaChannel) {
      dramaChannel.send({
        content: `🔒 **Restricted User:** ${member}`,
        embeds: [embed],
      });
    }

    return await message.delete();
  },
};

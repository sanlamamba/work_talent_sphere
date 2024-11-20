const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "unrestrict",
  description: "Remove a user's restricted role",
  async execute(message) {
    const user = message.mentions.users.first();
    if (!user) {
      return message.reply("Please mention the user you want to unrestrict.");
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply("User is not in the server.");
    }

    const role = message.guild.roles.cache.find(
      (role) => role.name === "Restricted"
    );
    if (!role) {
      return message.reply("Role not found.");
    }

    try {
      await member.roles.remove(role);
    } catch (error) {
      console.error("Error removing role:", error);
      return message.reply("Failed to remove the restricted role.");
    }

    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("Access Restored")
      .setDescription(
        `Your restricted access has been lifted. You may now freely interact within the server.`
      );

    try {
      await member.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error sending message to user:", error);
      return message.reply(
        "User has been unrestricted, but I could not send them a DM."
      );
    }

    const dramaChannel = message.guild.channels.cache.find(
      (channel) => channel.name === "drama"
    );
    if (dramaChannel) {
      dramaChannel.send({
        content: `🔓 **User Unrestricted:** ${member}`,
        embeds: [embed],
      });
    }

    return await message.delete();
  },
};

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "helpCommandContent",
  description: "List available commands",
  execute(commands, message) {
    const embedBuilder = new EmbedBuilder()
      .setColor("#00bfff")
      .setTitle("🤖 Welcome to the Server's Assistant!")
      .setDescription(
        "Hello, and welcome to our community! I'm your friendly server assistant, here to provide you with useful tools, information, and a little bit of fun along the way! Below, you'll find details about me, the server, and all the commands you can use to interact with me. 🌟"
      )
      .addFields(
        {
          name: "🌐 About This Server",
          value: `This server is a thriving community where members come together to share ideas, collaborate on projects, and enjoy quality discussions. Whether you're here to learn, connect, or just hang out, there's a place for everyone! 🤝\n\n**Server Members**: We currently have **${message.guild.memberCount}** amazing members! 🎉`,
        },
        {
          name: "🛠️ About This Bot",
          value:
            "I'm an all-in-one assistant designed to make your experience in this server smooth and enjoyable. From gathering information, scheduling events, sending reminders, to providing up-to-date data from the web, I aim to keep things interactive and easy for you! 💡\n\n**Key Features**:\n- **Data Scraping**: Get the latest info delivered to the right channels.\n- **Direct Messaging**: Personalized messages, reminders, and more.\n- **Interactive Commands**: Explore various features by using commands.",
        }
      );

    if (!commands || commands.size === 0) {
      embedBuilder.addFields({
        name: "🚫 Commands",
        value:
          "Currently, there are no commands available. Stay tuned for upcoming features! ⚙️",
      });
    } else {
      const commandList = commands
        .map(
          (cmd) =>
            `🔹 \`${cmd.name}\` - ${
              cmd.description || "No description available."
            }`
        )
        .join("\n");
      embedBuilder.addFields({
        name: "📋 Available Commands",
        value: `Here are the commands you can use to get the most out of the server:\n${commandList}`,
      });
    }

    embedBuilder
      .addFields({
        name: "🔗 Useful Links",
        value:
          "[Community Guidelines](https://example.com/guidelines) | [Official Website](https://example.com) | [Support](https://example.com/support)",
      })
      .setThumbnail("https://example.com/bot-thumbnail.png")
      .setImage("https://example.com/server-banner.png")
      .setFooter({
        text: "Pro tip: Use the prefix '!' before each command to activate it. For example: `!ping`. Happy exploring! 🚀",
        iconURL: "https://example.com/footer-icon.png",
      })
      .setTimestamp();

    return embedBuilder;
  },
};

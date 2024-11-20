const { sendMessageToUser } = require("../../services/messageService");

module.exports = {
  name: "sendMessage",
  description: "Send a private message to a user",
  execute(message, args) {
    const userId = args[0];
    const msgContent = args.slice(1).join(" ");
    sendMessageToUser(userId, msgContent);
  },
};

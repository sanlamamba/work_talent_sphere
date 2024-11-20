module.exports = {
  sendMessageToUser(userId, content) {
    client.users
      .fetch(userId)
      .then((user) => user.send(content))
      .catch(console.error);
  },
};

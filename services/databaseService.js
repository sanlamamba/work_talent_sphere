const { execute } = require("../interactions/buttons/submitTicketButton");

// class DatabaseService  which is a class that will initialize the database connection sqllite3 and will have methods to perform CRUD operations

module.exports = {
  name: "databaseService",
  description:
    "This is a database service it will handle all the database related operations",
};

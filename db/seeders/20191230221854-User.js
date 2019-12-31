"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "Jane Doe",
          username: "jane",
          email: "janedoe@example.com",
          password: "janepass",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Jon Doe",
          username: "jon",
          email: "jondoe@example.com",
          password: "jonpass",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};

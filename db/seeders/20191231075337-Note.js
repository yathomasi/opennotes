"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Notes",
      [
        {
          title: "title1",
          content: "this is a content",
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "title2",
          content: "this is a content",
          UserId: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "title3",
          content: "this is a content",
          UserId: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Notes", null, {});
  }
};

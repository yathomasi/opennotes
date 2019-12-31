"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Notes", "UserId", {
      type: Sequelize.INTEGER,
      references: {
        model: "Users",
        key: "userId"
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn("Notes", "UserId");
  }
};

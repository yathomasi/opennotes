"use strict";
const Sequelize = require("sequelize");

module.exports = sequelize => {
  const Fbuser = sequelize.define(
    "Fbuser",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      facebookid: {
        type: Sequelize.BIGINT,
        allowNull: false
      }
    },
    {}
    //   isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  );
  return Fbuser;
};

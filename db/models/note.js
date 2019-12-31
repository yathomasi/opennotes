"use strict";
const Sequelize = require("sequelize");

module.exports = sequelize => {
  const Note = sequelize.define(
    "Note",
    {
      noteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "userId"
        }
      }
    },
    {}
  );
  Note.associate = function(models) {
    // associations can be defined here
    Note.belongsTo(models.User, {
      foreignKey: "UserId",
      as: "User",
      onDelete: "CASCADE"
    });
  };
  return Note;
};

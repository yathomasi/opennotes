"use strict";
const Sequelize = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = sequelize => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {
      hooks: {
        beforeCreate: user => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      instanceMethods: {
        validPassword: function(password) {
          return bcrypt.compareSync(password, this.password);
        }
      }
    }
    //   isAdmin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Note, {
      foreignKey: "UserId",
      as: "notes",
      onDelete: "CASCADE"
    });
  };
  return User;
};

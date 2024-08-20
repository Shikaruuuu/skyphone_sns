const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      coverPicture: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      desc: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Post, { foreignKey: "userId" });
  };

  return User;
};

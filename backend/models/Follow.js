const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Follow = sequelize.define(
    "Follow",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
      },
      followerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      foreignKey: "followerId",
      as: "followerUser",
    });
    Follow.belongsTo(models.User, {
      foreignKey: "followingId",
      as: "followingUser",
    });
  };

  return Follow;
};

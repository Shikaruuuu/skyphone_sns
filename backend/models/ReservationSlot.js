const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ReservationSlot = sequelize.define(
    "ReservationSlot",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
        unique: true,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      slotDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

  ReservationSlot.associate = function (models) {
    ReservationSlot.belongsTo(models.Post, { foreignKey: "postId" });
  };

  return ReservationSlot;
};

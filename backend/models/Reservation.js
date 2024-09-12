const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Reservation = sequelize.define(
    "Reservation",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: true,
        autoIncrement: true,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      requestedDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true, // Emailの形式をバリデーション
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true, // 数字のみを許可するバリデーション
          len: [10, 15], // 電話番号の長さを指定
        },
      },
    },
    {
      timestamps: true,
    }
  );

  Reservation.associate = function (models) {
    Reservation.belongsTo(models.User, { foreignKey: "userId" });
    Reservation.belongsTo(models.Post, { foreignKey: "postId" });
  };

  return Reservation;
};

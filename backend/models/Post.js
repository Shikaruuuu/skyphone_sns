const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Post = sequelize.define(
    "Post",
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
      category: {
        type: DataTypes.ENUM(
          "business",
          "study",
          "love",
          "relationship",
          "family",
          "other"
        ),
        allowNull: false,
        defaultValue: "other",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 100],
        },
        defaultValue: "無題の相談",
      },
      content: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [0, 500],
        },
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      likes: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  Post.associate = function (models) {
    Post.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Post;
};

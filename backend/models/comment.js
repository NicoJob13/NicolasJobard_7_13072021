'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User);
      
      models.Comment.belongsTo(models.Post);
    }
  };

  Comment.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    text: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  
  return Comment;
};
'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User);

      models.Post.hasMany(models.Comment);
    }
  };

  Post.init({
    userName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userRole: {
      allowNull: false,
      type: DataTypes.STRING
    },
    text: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Post',
  });
  
  return Post;
};
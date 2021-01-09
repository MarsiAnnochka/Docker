'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class model extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  model.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    cash: DataTypes.INTEGER,
    basket: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'model',
  });
  return model;
};
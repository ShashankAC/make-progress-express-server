'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.subGoal, { foreignKey: 'subGoalId' });
    }
  }
  Activity.init({
    activityId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    timeSpent: {
      allowNull: false,
      type: DataTypes.DOUBLE
    }
  }, {
    sequelize,
    modelName: 'Activity',
  });
  return Activity;
};
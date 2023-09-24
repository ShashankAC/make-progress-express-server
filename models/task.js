'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Task.belongsTo(models.subGoal, { foreignKey: 'subGoalId' });
    }
  }
  Task.init({
    subGoalId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    taskId: {
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
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};
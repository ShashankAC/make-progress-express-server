'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subGoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      subGoal.belongsTo(models.Goal, { foreignKey: 'goalId' } );
      subGoal.hasMany(models.Task, { foreignKey: 'subGoalId' });
    }
  }
  subGoal.init({
    goalId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    subGoalId: {
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    category: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    endDate: {
      allowNull: true,
      type: DataTypes.DATE
    },
    progress: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'subGoal',
  });
  return subGoal;
};
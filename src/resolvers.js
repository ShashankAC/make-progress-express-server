const bcryptjs = require('bcryptjs');
const { Op } = require('sequelize');

const resolvers = {
    Query: {
      async user(root, { userId }, { models }) {
        return models.User.findById(userId);
      },
      async login(root, { usernameOrEmail, password }, { models }) {
        const user = await models.User.findOne({
          where: {
            [Op.or]: [
              { name: usernameOrEmail },
              { email: usernameOrEmail }
            ]
          }
        });

        if (!user) {
          throw new Error('Invalid username/email or password');
        }
         // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid username/email or password');
        }
        // Return the authenticated user and the JWT
        return user;
      },
      async allGoals(root, args, { models }) {
        return models.Goal.findAll({ where: { userId: args.userId } });
      },
      async getGoal(root, args, { models }) {
        return models.Goal.findById(args.goalId);
      },
      async allSubGoals(root, { goalId }, { models }) {
        return models.subGoal.findAll({ where: { goalId: goalId } });
      },
      async getSubGoal(root, args, { models }) {
        return models.subGoal.findById(args.id);
      },
      async allActivities(root, { subGoalId }, { models }) {
        return models.Activity.findAll({ where: { subGoalId: subGoalId } });
      },
      async getActivity(root, args, { models }) {
        return models.Activity.findById(args.id);
      },
    },
    Mutation: {
      async createUser(root, { name, email, password }, { models }) {
        return models.User.create({
        name,
        email,
        password: await hash(password, 10),
        });
      },
      async updateUser(root, {userId, name, password}, { models }) {

        try {
          const user = await models.User.findByPk(userId);

          if (!user) {
            throw new Error('User not found');
          }
          const updatedFields = {};
          if (name) {
            updatedFields.name = name;
          }
          if (password) {
            updatedFields.password = await bcryptjs.hash(password, 10);
          }
  
          // Update the user
          await models.User.update(updatedFields, { where: { userId } });
          return models.User.findByPk(userId);
        }
        catch(error) {
          throw new Error(`Failed to update user: ${error.message}`);
        }
      },
      async createGoal(
        root,
        { userId, title, description, category, priority, startDate, progress, status },
        { models }
      ) {
        return models.Goal.create({ userId, title, description, category, priority, startDate, progress, status });
      },
      async updateGoal(
        root,
        { goalId, title, description, category, priority, startDate, progress, status },
        { models }
      ) {
         try {
          const goal = await models.Goal.findByPk(goalId);
          if (!goal) {
            throw new Error('Goal not found');
          }
          const updatedFields = {};
          if (title) {
            updatedFields.title = title;
          }
          if (description) {
            updatedFields.description = description;
          }
          if (category) {
            updatedFields.category = category;
          }
          if (priority) {
            updatedFields.priority = priority;
          }
          if (startDate) {
            updatedFields.startDate = startDate;
          }
          if (progress) {
            updatedFields.progress = progress;
          }
          if (status) {
            updatedFields.status = status;
          }
          await models.Goal.update(updatedFields, { where: { goalId } });
          return models.Goal.findByPk(goalId);
         }
         catch(error) {
          throw new Error(`Failed to update the goal: ${error.message}`);
         }
      },
      async createSubGoal(
        root,
        { goalId, title, description, category, priority, startDate, progress, status },
        { models }
      ) {
        return models.subGoal.create({ goalId, title, description, category, priority, startDate, progress, status });
      },
      async updateSubGoal(
        root,
        { subGoalId, title, description, category, priority, startDate, progress, status },
        { models }
      ) {
          try {
            const subGoal = models.subGoal.findByPk(subGoalId);

            if (!subGoal) {
              throw new Error('subGoal not found');
            }
            const updatedFields = {};
            if (title) {
              updatedFields.title = title;
            }
            if (description) {
              updatedFields.description = description;
            }
            if (category) {
              updatedFields.category = category;
            }
            if (priority) {
              updatedFields.priority = priority;
            }
            if (startDate) {
              updatedFields.startDate = startDate;
            }
            if (progress) {
              updatedFields.progress = progress;
            }
            if (status) {
              updatedFields.status = status;
            }
            await models.subGoal.update(updatedFields, { where: { subGoalId } });
            return models.subGoal.findByPk(subGoalId);
          }
          catch(error) {
            throw new Error(`Failed to update the subGoal: ${error.message}`);
          }
      },
      async createActivity(
        root,
        { subGoalId, title, description, timeSpent },
        { models }
      ) {
        return models.Activity.create({ subGoalId, title, description, timeSpent });
      },
      async updateActivity(
        root,
        { activityId, title, description, timeSpent },
        { models }
      ) {
        try {
          const activity = models.Activity.findByPk(activityId);

          if (!activity) {
            throw new Error('subGoal not found');
          }
          const updatedFields = {};

          if (title) {
            updatedFields.title = title;
          }
          if (description) {
            updatedFields.description = description;
          }
          if (timeSpent) {
            updatedFields.title = timeSpent;
          }
          await models.Activity.update(updatedFields, { where: { activityId } });
          return models.Activity.findByPk(activityId);
        }
        catch(error) {
          throw new Error(`Failed to update the Activity: ${error.message}`);
        }
      }
    },
    User: {
      async goals(user) {
        return user.getGoals();
      },
    },
    Goal: {
      async user(goal) {
        return goal.getUser();
      },
      async subGoals(goal) {
          return goal.getSubGoals(goal);
      }
    },
    subGoal: {
      async goal(subGoal) {
          return subGoal.getGoal();
      },
      async activities(subGoal) {
        return subGoal.getActivities();
      },
    },
    Activity: {
      async subGoal(subGoal) {
        return subGoal.getSubGoal();
      },
    },
};
  
module.exports = resolvers;
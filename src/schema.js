const gql = require('graphql-tag');
const { GraphQLScalarType, Kind } = require('graphql');

const dateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value) {
      if (value instanceof Date) {
        return value.getTime(); // Convert outgoing Date to integer for JSON
      }
      throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value) {
      if (typeof value === 'number') {
        return new Date(value); // Convert incoming integer to Date
      }
      throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        // Convert hard-coded AST string to integer and then to Date
        return new Date(parseInt(ast.value, 10));
      }
      // Invalid hard-coded value (not an integer)
      return null;
    },
  });

const typeDefs = gql`
  scalar Date

  type User {
    userId: Int!
    name: String!
    email: String!
    dob: Date
    goals: [Goal!]!
  }

  type Goal {
    goalId: Int!
    title: String!
    description: String!
    category: String!
    startDate: Date!
    endDate: Date!
    priority: Int!
    progress: Float!
    status: String!
    user: User!
    subGoals: [subGoal!]!
  }

  type subGoal {
    subGoalId: Int!
    goal: Goal!
    title: String!
    description: String!
    category: String!
    startDate: Date!
    endDate: Date!
    progress: Float!
    status: String!
    tasks: [Task!]!
  }

  type Task {
    taskId: Int!
    subGoal: subGoal!
    title: String!
    timeSpent: Float!
    status: String!
  }

  type Query {
    user(userId: Int!): User
    allGoals(userId: Int!): [Goal!]!
    getGoal(goalId: Int!): Goal
    allSubGoals(goalId: Int!): [subGoal!]!
    getSubGoal(subGoalId: Int!): subGoal
    allTasks(subGoalId: Int!): [Task!]!
    getTask(taskId: Int!): Task!
    login(usernameOrEmail: String!, password: String!): User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User!

    createGoal(
      userId: Int!
      title: String!
      description: String!
      category: String!
      priority: Int!
      startDate: Date!
      endDate: Date!
      progress: Float!
      status: String!
    ): Goal!

    createSubGoal(
      goalId: Int!
      title: String!
      description: String!
      category: String!
      priority: Int!
      startDate: Date!
      endDate: Date
      progress: Float!
      status: String!
    ): subGoal!

    createTask(
      subGoalId: Int!
      title: String!
      timeSpent: Float!
      status: String!
    ): Task!

    updateUser(userId: Int!, name: String, password: String): User!

    updateGoal(
      goalId: Int!
      title: String
      description: String
      category: String
      priority: Int
      startDate: Date
      endDate: Date
      progress: Float
      status: String
    ): Goal!

    updateSubGoal(
      subGoalId: Int!
      title: String
      description: String
      category: String
      priority: Int
      startDate: Date
      endDate: Date
      progress: Float
      status: String
    ): subGoal!

    updateTask(
      taskId: Int!
      title: String
      timeSpent: Float
      status: String
    ): Task! 
  }
`;

module.exports = typeDefs;
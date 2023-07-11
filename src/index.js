const { ApolloServer } = require('@apollo/server');
const express = require('express');
const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const typeDefs = require('./schema.js');
const resolvers = require('./resolvers.js');
const models = require('../models/index.js');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
// Required logic for integrating with Express
const app = express();

const httpServer = createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // context: () => { models, res },
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer }), {
    async requestDidStart() {
      return {
        async willSendResponse(requestContext) {
          const { request, response } = requestContext;
          const token = jwt.sign({ data: response.body.singleResult.data.login.userId }, SECRET_KEY, { expiresIn: '1h' });
          response.http.headers.set('Authorization', `Bearer ${token}`);
          response.http.headers.set('Access-Control-Expose-Headers', 'Authorization');
        }
      }
    }
  }],
});

const startServer = async() => await server.start();
startServer().then(() => {
  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    '/',
    cors(),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    bodyParser.json({ limit: '50mb' }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization;
        let decoded = null;
        if(token) {
          decoded = jwt.verify(token, SECRET_KEY, { expiresIn: '1h' });
        }
        return { userData: decoded, models: models };
      },
      listen: { port: 4000 },
    }),
  );
});

(async() => {
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));  
})();
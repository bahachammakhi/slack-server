import express from 'express';
// import bodyParser from 'body-parser';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import models from './models';

const types = loadFilesSync(path.join(__dirname, './schema'));
const mergeResolversArray = loadFilesSync(path.join(__dirname, './resolvers'));
const typeDefs = mergeTypeDefs(types);
const resolvers = mergeResolvers(mergeResolversArray);
const server = new ApolloServer({ typeDefs, resolvers, context: { models, user: { id: 1 } } });

const app = express();
// app.use(bodyParser);
server.applyMiddleware({ app });
models.sequelize.sync({}).then(() => {
  app.listen({ port: 8080 }, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server ready at http://localhost:8080${server.graphqlPath}`);
  });
});

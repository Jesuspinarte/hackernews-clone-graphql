// const fs = require("fs");
// const path = require("path");
const { ApolloServer, PubSub } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { loadFile } = require("graphql-import-files");

const { getUserId } = require("./utils");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const User = require("./resolvers/User");
const Link = require("./resolvers/Link");
const Subscription = require("./resolvers/Subscription");
const Vote = require("./resolvers/Vote");

const prisma = new PrismaClient();
const pubsub = new PubSub();

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
};

const auxToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY1MDE4MjgxOX0.D1cqSCdpy-tfkIVG40AMJf_CS7KT8LQ-jDQo6Gw2L4A";

const server = new ApolloServer({
  typeDefs: loadFile("./src/schema.graphql"),
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      return { ...connection.context, prisma, pubsub };
    } else {
      const auxReq = { ...req };
      req.headers.authorization = auxToken;

      return {
        ...auxReq,
        prisma,
        pubsub,
        userId: req && auxReq.headers.authorization ? getUserId(auxReq) : null,
      };
    }
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

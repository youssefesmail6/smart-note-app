import { ApolloServer } from "apollo-server-express";
import { noteTypeDefs } from "./note.graphQl";
import { noteResolvers } from "./note.resolver";
import { GraphQLScalarType, Kind } from "graphql";

// Custom DateTime scalar for filtering by date
const DateTime = new GraphQLScalarType({
  name: "DateTime",
  description: "Custom scalar for DateTime",
  parseValue(value) {
    return new Date(value); // from client input
  },
  serialize(value) {
    return value instanceof Date ? value.toISOString() : value; // to client
  },
  parseLiteral(ast) {
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  },
});

export const applyGraphQLMiddleware = async (app: any) => {
  const server = new ApolloServer({
    typeDefs: [noteTypeDefs],
    resolvers: [{ DateTime, ...noteResolvers }],
  });

  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
};

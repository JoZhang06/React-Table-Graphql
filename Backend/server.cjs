const { ApolloServer, gql } = require('apollo-server');
const { PrismaClient } = require('@prisma/client');
const { GraphQLDate } = require('graphql-scalars'); // importamos el tipo Date del paquete graphql-scalars


const prisma = new PrismaClient();

const typeDefs = gql`
scalar Date

  type User {
    id: Int!
    name: String!
    email: String!
    createdAt: Date!
    updatedAt: Date!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    updateUser(id: Int!, name: String, email: String): User!
    deleteUser(id: Int!): User!
  }
`;

const resolvers = {
  Date: GraphQLDate,
  Query: {
    users: async () => {
      return await prisma.user.findMany();
    },
    user: async (parent, args) => {
      const { id } = args;
      return await prisma.user.findUnique({ where: { id } });
    },
  },
  Mutation: {
    createUser: async (parent, args) => {
      const { name, email } = args;
      return await prisma.user.create({ data: { name, email } });
    },
    updateUser: async (parent, args) => {
      const { id, name, email } = args;
      return await prisma.user.update({ where: { id }, data: { name, email } });
    },
    deleteUser: async (parent, args) => {
      const { id } = args;
      return await prisma.user.delete({ where: { id } });
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

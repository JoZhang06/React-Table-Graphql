import { ApolloServer, gql } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { GraphQLDate } from 'graphql-scalars'; // importamos el tipo Date del paquete graphql-scalars


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
    users: () => prisma.user.findMany(),
    user: (_parent: any, { id }: { id: number }) => prisma.user.findUnique({ where: { id } }),
  },
  Mutation: {
    createUser: async (_parent: any, { name, email }: { name: string; email: string }) => {
      const user = await prisma.user.create({ data: { name, email } });
      return { success: true, message: `User with ID ${user.id} created successfully`, user };
    },
    updateUser: async (_parent: any, { id, name, email }: { id: number; name?: string; email?: string }) => {
      const updatedUser = await prisma.user.update({ where: { id }, data: { name, email } });
      return { success: true, message: `User with ID ${updatedUser.id} updated successfully`, user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, createdAt: updatedUser.createdAt, updatedAt: updatedUser.updatedAt } };
    },
    deleteUser: async (_parent: any, { id }: { id: number }) => {
      const deletedUser = await prisma.user.delete({ where: { id } });
      return { success: true, message: `User with ID ${deletedUser.id} deleted successfully`, user: deletedUser };
    },
  },
};


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});


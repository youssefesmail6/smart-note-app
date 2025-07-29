import { gql } from "apollo-server-express";

export const noteTypeDefs = gql`
  scalar DateTime

  type User {
    _id: ID!
    name: String
    email: String
  }

  type Note {
    _id: ID!
    title: String!
    content: String!
    createdAt: DateTime!
    owner: User!
  }

  input NotesFilterInput {
    userId: ID
    title: String
    from: DateTime
    to: DateTime
    page: Int
    limit: Int
  }

  type PaginatedNotes {
    notes: [Note!]!
    totalPages: Int!
    currentPage: Int!
  }

  type Query {
    getNotes(filters: NotesFilterInput): PaginatedNotes!
  }
`;

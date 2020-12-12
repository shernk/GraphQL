import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require("graphql");

const app = express();

const authors = [
  {
    id: 1,
    name: "sherkname",
  },
  {
    id: 2,
    name: "Christopher",
  },
  {
    id: 3,
    name: "Alking",
  },
];
const books = [
  {
    id: 1,
    name: "Harry Potter and the Chamber of Secrets",
    authorId: 1,
  },
  {
    id: 2,
    name: "Harry Potter and the Prisoner of Azkaban",
    authorId: 2,
  },
  {
    id: 3,
    name: "Harry Potter and the Goblet of Fire",
    authorId: 3,
  },
  {
    id: 4,
    name: "The Way of Shadows",
    authorId: 3,
  },
  {
    id: 5,
    name: "Tenet",
    authorId: 3,
  },
  {
    id: 6,
    name: "The called",
    authorId: 2,
  },
];

const AuthorType = new GraphQLObjectType({
  name: "Author",
  description: "This represents a author of a book",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter((book) => book.authorId === author.id);
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  description: "This represents a book written by an author",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find((author) => book.authorId === author.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    books: {
      type: new GraphQLList(BookType),
      description: "List of All Books",
      resolve: () => books,
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: "List of All Authors",
      resolve: () => authors,
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => console.log("Server Running"));

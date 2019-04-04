const { gql, ApolloServer } = require("apollo-server-express");
const express = require("express");

// モックデータ
const books = [
  {
    title: "Harry Potter and the Sorcerer's stone",
    author: "J.K. Rowling",
    price: 2000
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton",
    price: 3000
  }
];

// GraphQLのスキーマ情報
const TYPEDEFS = gql`
  type Query {
    books: [Book]
  }
  type Book {
    title: String
    author: String
    price: Int
  }
`;

// resolver(データ処理)の設定
// DBからデータを取得したり、APIを呼び出したりする処理もここで記述
const RESOLVERS = {
  Query: { books: () => books }
};

// playgroundの設定
const PLAYGROUND = {
  endpoint: `http://localhost:4000/graphql`,
  settings: {
    "editor.theme": "light"
  }
};

// GraphQL の server 設定
const SERVER = new ApolloServer({
  typeDefs: TYPEDEFS,
  resolvers: RESOLVERS,
  playground: PLAYGROUND
});

// Expressの初期化
const APP = express();

// GraphQLのエンドポイントの追加
SERVER.applyMiddleware({
  app: APP
});

// GraphiQLのエンドポイントの追加 (テストで使う GraphQLのWeb GUI)

// サーバの起動
APP.listen(4000, () => {
  console.log("Go to http://localhost:4000/graphql to run!");
});

module.exports = APP;

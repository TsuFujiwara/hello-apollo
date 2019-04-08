const { gql, ApolloServer } = require("apollo-server-express");
const express = require("express");
const bacstack = require("./bacnet/readProperty");

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

let objects = [];
// モックデータ2
// readProperty
bacstack.then(res => {
  objects = res;
});

// bacstack();

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

// GraphQLのスキーマ情報
const TYPEDEFS2 = gql`
  type Query {
    objects: [Object]
  }
  type Object {
    objectId: Int
    objectName: String
    ObjectType: Int
    instanceNumber: Int
    units: Int
    maxPresValue: Float
    minPresValue: Float
    notifyType: Int
    highLimit: Float
    lowLimit: Float
    inactiveText: String
    activeText: String
    polarity: Int
    fileType: Int
    fileSize: Int
    numberOfStates: Int
    stateText1: String
    stateText2: String
    stateText3: String
    stateText4: String
    stateText5: String
    stateText6: String
    stateText7: String
    stateText8: String
    stateText9: String
    stateText10: String
    notificationClass: Int
    logDeviceObjectProperty1: Int
    logDeviceObjectProperty2: Int
    logDeviceObjectProperty3: Int
    logDeviceObjectProperty4: Int
    logInterval: Int
    bufferSize: Int
    maxPresValue2: Float
    Scale: Float
    objectIdentifier1: Int
    objectIdentifier2: Int
    memo: String
    covMode: Int
    covInterval: Int
    eventEnable: Boolean
    limitEnable: Boolean
    covIncrement: Int
    timeDelay: Int
    FeedbackToPV: Boolean
    intrinsicEventDisable: Boolean
    profileName: String
    presentValue: Float
    statusFlags: Int
  }
`;

// resolver(データ処理)の設定
// DBからデータを取得したり、APIを呼び出したりする処理もここで記述
const RESOLVERS = {
  Query: { books: () => books }
};

// resolver(データ処理)の設定
// DBからデータを取得したり、APIを呼び出したりする処理もここで記述
const RESOLVERS2 = {
  Query: { objects: () => objects }
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
  typeDefs: TYPEDEFS2,
  resolvers: RESOLVERS2,
  playground: PLAYGROUND
});

// Expressの初期化
const APP = express();

// GraphQLのエンドポイントの追加
SERVER.applyMiddleware({
  app: APP
});

// サーバの起動
APP.listen(4000, () => {
  console.log("Go to http://localhost:4000/graphql to run!");
});

module.exports = APP;

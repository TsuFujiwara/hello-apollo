import React, { Component } from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Books from "./Books";

const localUri = "http://localhost:4000/graphql";
const graphcmsUri =
  "https://api-apeast.graphcms.com/v1/cju2boi1a16lo01ffvlpj6cfy/master";

const client = new ApolloClient({ uri: localUri });
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        {/* ↑ Apolloクライアント(GraphQLのクエリ)を使えるように設定 */}
        <div>
          <h2>My first Apollo app</h2>
          <Books />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;

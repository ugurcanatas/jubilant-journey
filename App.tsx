import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {AppRegistry} from 'react-native';
import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import { StyleSheet, Text, View } from 'react-native';

import {DefRootComponent} from './DefRootComponent';

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache()
})

export default function App() {
  return (
    <ApolloProvider client={client}>
    <DefRootComponent />
    <View style={styles.container}>
      <StatusBar style="auto" />
    </View>
    </ApolloProvider>
  );
}

AppRegistry.registerComponent("GraphQL-Client", () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

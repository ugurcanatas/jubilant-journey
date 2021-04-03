import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppRegistry } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useFonts } from "expo-font";

import { DefRootComponent } from "./DefRootComponent";

const client = new ApolloClient({
  uri: "http://192.168.0.47:4000/graphql",
  cache: new InMemoryCache(),
});

export default function App() {
  const [loaded] = useFonts({
    "Roboto-Condensed-Regular": require("./assets/fonts/RobotoCondensed-Regular.ttf"),
    "Roboto-Condensed-Bold": require("./assets/fonts/RobotoCondensed-Bold.ttf"),
  });

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <DefRootComponent />
          <StatusBar style="auto" />
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
}

AppRegistry.registerComponent("GraphQL-Client", () => App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

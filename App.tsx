import { StatusBar } from "expo-status-bar";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRegistry } from "react-native";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { useFonts } from "expo-font";

//Components
import { DefRootComponent } from "./DefRootComponent";
//Type 1 Components
import { PageType1Query1 } from "./components/pages/pages_type1/PageType1Query1";
import { PageType1Query2 } from "./components/pages/pages_type1/PageType1Query2";
import { PageType1Query3 } from "./components/pages/pages_type1/PageType1Query3";
//Type 2 Components
import { PageType2Query1 } from "./components/pages/pages_type2/PageType2Query1";
import { PageType2Query2 } from "./components/pages/pages_type2/PageType2Query2";
import { PageType2Query3 } from "./components/pages/pages_type2/PageType2Query3";
//Type 3 Components
import { PageType3Query1 } from "./components/pages/pages_type3/PageType3Query1";
import { PageType3Query2 } from "./components/pages/pages_type3/PageType3Query2";
import { PageType3Query3 } from "./components/pages/pages_type3/PageType3Query3";

const client = new ApolloClient({
  uri: "http://192.168.0.47:4000/graphql",
  cache: new InMemoryCache(),
});

const Stack = createStackNavigator();

export default function App() {
  useFonts({
    "Roboto-Condensed-Regular": require("./assets/fonts/RobotoCondensed-Regular.ttf"),
    "Roboto-Condensed-Bold": require("./assets/fonts/RobotoCondensed-Bold.ttf"),
  });

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="GraphQL Client" component={DefRootComponent} />
            <Stack.Screen
              name="PageType1Query1"
              component={PageType1Query1}
              options={{
                headerTitle: "Tip 1 - Query 1",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType1Query2"
              component={PageType1Query2}
              options={{
                headerTitle: "Tip 1 - Query 2",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType1Query3"
              component={PageType1Query3}
              options={{
                headerTitle: "Tip 1 - Query 3",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType2Query1"
              component={PageType2Query1}
              options={{
                headerTitle: "Tip 2 - Query 1",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType2Query2"
              component={PageType2Query2}
              options={{
                headerTitle: "Tip 2 - Query 2",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType2Query3"
              component={PageType2Query3}
              options={{
                headerTitle: "Tip 2 - Query 3",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType3Query1"
              component={PageType3Query1}
              options={{
                headerTitle: "Tip 3 - Query 1",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType3Query2"
              component={PageType3Query2}
              options={{
                headerTitle: "Tip 3 - Query 2",
                headerBackTitle: "Main",
              }}
            />
            <Stack.Screen
              name="PageType3Query3"
              component={PageType3Query3}
              options={{
                headerTitle: "Tip 3 - Query 3",
                headerBackTitle: "Main",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
      <StatusBar style="auto" />
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

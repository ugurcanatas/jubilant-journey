import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { useQuery } from "@apollo/client";
import { query_1 } from "../../../GraphQL/QueriesType_1/Query_1";

export interface CustomIDInterface {
  custom_id: string;
  dateString: string;
}

interface ListItemInterface {
  sumPassengers: number;
  _id: CustomIDInterface;
}

export const PageType1Query1 = () => {
  const { data, error, loading } = useQuery(query_1);
  if (!loading) {
    console.log("Data received ", data);
  }

  const renderListItem = ({ item }: { item: ListItemInterface }) => {
    console.log("RENDERING VIEW");
    const { _id, sumPassengers } = item;
    const { dateString } = _id;
    console.log("RENDERING LIST ITEM", sumPassengers);

    return (
      <View style={styles.listItem}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title1}>Date</Text>
          <Text style={styles.value1}>📅 {dateString}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title2}>Total Passengers</Text>
          <Text style={styles.value2}>🧙🏽‍♀️ {sumPassengers}</Text>
        </View>
      </View>
    );
  };

  const renderView = () => {
    if (!loading) {
      console.log("RENDERING VIEW", data);
      const { findSumOfPassengers } = data;

      return (
        <View style={{ flex: 1 }}>
          <FlatList
            renderItem={renderListItem}
            data={findSumOfPassengers}
            keyExtractor={(item: ListItemInterface) =>
              item._id.custom_id.toString()
            }
          />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#2E246D" />
      </View>
    );
  };

  return <View style={{ flex: 1 }}>{renderView()}</View>;
};

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginHorizontal: 12,
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 6,
  },
  title1: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 20,
  },
  title2: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 20,
  },
  value1: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 24,
  },
  value2: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 24,
  },
});

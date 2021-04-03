import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useQuery } from "@apollo/client";

import { query_3 } from "../../../GraphQL/QueriesType_1/Query_3";

interface InterfaceQ3 {
  trip_distance: number;
  tpep_pickup_datetime: number;
  convertedDate: string;
}

export const PageType1Query3 = () => {
  const { data, error, loading } = useQuery(query_3);

  const renderListItem = ({ item }: { item: InterfaceQ3 }) => {
    const { trip_distance, convertedDate } = item;

    return (
      <View style={styles.listItem}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title1}>Date</Text>
          <Text style={styles.value}>📅 {convertedDate}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title2}>Trip Distance</Text>
          <Text style={styles.value}>🧙🏽‍♀️ {trip_distance}</Text>
        </View>
      </View>
    );
  };

  const renderFlatList = () => {
    if (!loading) {
      const { maxDistanceTrips } = data;

      return (
        <View style={{ flex: 1 }}>
          <FlatList
            renderItem={renderListItem}
            data={maxDistanceTrips}
            keyExtractor={(item: InterfaceQ3) =>
              item.tpep_pickup_datetime.toString()
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

  return <View style={{ flex: 1 }}>{renderFlatList()}</View>;
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
  value: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 24,
  },
});

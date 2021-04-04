import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { useQuery } from "@apollo/client";
import { query_2 } from "../../../GraphQL/QueriesType_2/Query_2";

interface IDField {
  custom_id: number;
  dateString: string;
}

interface FlatListInterface {
  _id: IDField;
  avarageTotalAmount: number;
}

export const PageType2Query2 = () => {
  const { data, loading, error } = useQuery(query_2, {
    variables: {
      sortType: "asc",
    },
  });

  const renderChildItems = ({ item }: { item: FlatListInterface }) => {
    const { _id, avarageTotalAmount } = item;
    const { dateString } = _id;
    return (
      <View style={styles.listItem}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Date</Text>
          <Text style={styles.value}>📅 {dateString}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Avarage Amount</Text>
          <Text style={styles.value}>🧙🏽‍♀️ {avarageTotalAmount}</Text>
        </View>
      </View>
    );
  };

  const renderView = () => {
    console.log("LOADING", loading);
    console.log("ERROR", error);
    console.log("DATA", data);

    if (!loading && data) {
      //return FlatList
      const { getDailyAvarage } = data;
      return (
        <FlatList
          data={getDailyAvarage}
          renderItem={renderChildItems}
          keyExtractor={(item: FlatListInterface) =>
            item._id.custom_id.toString()
          }
        />
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
  title: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 20,
  },
  value: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 24,
  },
});

import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  ActivityIndicator,
  FlatList,
} from "react-native";

import { useLazyQuery, useQuery } from "@apollo/client";
import { query_2 } from "../../../GraphQL/QueriesType_1/Query_2";

import { FlatListTypes } from "../customTypes";

export const PageType1Query2 = () => {
  const [distance, setDistance] = useState("2.0");

  const [loadDistanceDatas, { called, loading, data }] = useLazyQuery(query_2, {
    variables: { trip_distance: distance },
  });

  const renderListItems = ({ item }: { item: FlatListTypes }) => {
    const { total, countOfDate, _id } = item;
    const { dateString } = _id;

    return (
      <View style={styles.listItem}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title1}>Travel Count</Text>
          <Text style={styles.value}>🚕 {countOfDate}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title1}>Date</Text>
          <Text style={styles.value}>📅 {dateString}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title2}>Trip Distance</Text>
          <Text style={styles.value}>🧙🏽‍♀️ {total}</Text>
        </View>
      </View>
    );
  };

  const renderDynamicView = () => {
    console.log("LOADING", loading);
    console.log("LOADING ERROR", called);

    if (!loading && !called) {
      return (
        <View>
          <Text>Click Request Button to get data</Text>
        </View>
      );
    }

    if (loading && called) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
        >
          <ActivityIndicator size="large" color="#2E246D" />
        </View>
      );
    }

    const { mostTraveledUnder } = data;
    console.log("Data", data);

    return (
      <FlatList
        keyExtractor={(item: FlatListTypes) => item._id.custom_id.toString()}
        data={mostTraveledUnder}
        renderItem={renderListItems}
      />
    );
  };

  return (
    <View
      style={{
        flexDirection: "column",
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "column",
          alignSelf: "stretch",
          alignItems: "center",
          backgroundColor: "#EAEAEA",
        }}
      >
        <Text style={styles.filters}>Enter a distance value</Text>
        <View style={{ flexDirection: "column", paddingVertical: 12 }}>
          <TextInput
            style={styles.textInputStyle}
            placeholder="Enter distance"
            placeholderTextColor="#60605e"
            defaultValue={distance}
            returnKeyType="done"
            onSubmitEditing={(event) => setDistance(event.nativeEvent.text)}
          />
          <TouchableOpacity onPress={() => loadDistanceDatas()}>
            <View style={styles.buttonView}>
              <Text style={styles.buttonTitle}>Send Request</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {renderDynamicView()}
    </View>
  );
};

const styles = StyleSheet.create({
  filters: {
    fontSize: 18,
    fontFamily: "Roboto-Condensed-Regular",
    marginTop: 12,
  },
  textInputStyle: {
    width: 250,
    backgroundColor: "white",
    padding: 10,
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Roboto-Condensed-Regular",
  },
  buttonView: {
    marginVertical: 12,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#3CAE6A",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonTitle: {
    textAlign: "center",
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 20,
    color: "white",
  },
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

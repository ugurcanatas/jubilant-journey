import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { query_3 } from "../../../GraphQL/QueriesType_2/Query_3";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

interface CustomDataInterface {
  tpep_pickup_datetime: number;
  trip_distance: number;
  tpep_dropoff_datetime: number;
  startDate: string;
  endDate: string;
}

export const PageType2Query3 = ({ navigation }: { navigation: any }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
          <View style={{ marginHorizontal: 12 }}>
            <AntDesign name="filter" size={32} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [showFilter, setShowFilter] = useState(false);

  const renderStartDatePicker = () => {
    return (
      <View style={{ flex: 0, flexDirection: "column" }}>
        <Text
          style={{
            paddingTop: 24,
            fontSize: 24,
            textAlign: "center",
            fontFamily: "Roboto-Condensed-Regular",
          }}
        >
          Select start date
        </Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={dateStart}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(e, selectedDate) =>
            setDateStart(selectedDate || dateStart)
          }
        />
      </View>
    );
  };

  const renderEndDatePicker = () => {
    return (
      <View style={{ flex: 0, flexDirection: "column" }}>
        <Text
          style={{
            paddingTop: 24,
            fontSize: 24,
            textAlign: "center",
            fontFamily: "Roboto-Condensed-Regular",
          }}
        >
          Select end date
        </Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={dateEnd}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(e, selectedDate) => setDateEnd(selectedDate || dateEnd)}
        />
      </View>
    );
  };

  const [getFilteredData, { loading, called, data }] = useLazyQuery(query_3, {
    variables: {
      date_first: dateStart.toISOString().substring(0, 10),
      date_second: dateEnd.toISOString().substring(0, 10),
    },
  });

  const renderChilds = ({ item }: { item: CustomDataInterface }) => {
    const { startDate, endDate, trip_distance } = item;
    return (
      <View style={styles.listItem}>
        <View style={{ flexDirection: "column" }}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>📅 Pickup Date</Text>
            <Text style={styles.value}>{startDate}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>📅 Dropoff Date</Text>
            <Text style={styles.value}>{endDate}</Text>
          </View>
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.title}>Trip Distance</Text>
          <Text style={styles.value}>🧙🏽‍♀️ {trip_distance}</Text>
        </View>
      </View>
    );
  };

  const renderFlatList = () => {
    if (loading) {
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
    }
    if (!loading && called) {
      const { getMinDistanceTrips } = data;
      return (
        <View style={{ width: "100%" }}>
          <FlatList
            data={getMinDistanceTrips}
            renderItem={renderChilds}
            keyExtractor={(item: CustomDataInterface) =>
              item.tpep_pickup_datetime.toString()
            }
          />
        </View>
      );
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Modal
        style={styles.modalView}
        animationType="slide"
        transparent={false}
        presentationStyle="overFullScreen"
        visible={showFilter}
        onRequestClose={() => setShowFilter(!showFilter)}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginHorizontal: 12,
            }}
          >
            <Text style={{ fontFamily: "Roboto-Condensed-Bold", fontSize: 32 }}>
              Filters
            </Text>
            <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
              <Ionicons name="ios-close" size={32} color="red" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              paddingTop: 24,
              justifyContent: "flex-start",
            }}
          >
            {renderStartDatePicker()}
            {renderEndDatePicker()}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => [getFilteredData(), setShowFilter(false)]}
          >
            <View
              style={{
                backgroundColor: "#3CAE6A",
                padding: 32,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Roboto-Condensed-Bold",
                  color: "white",
                  fontSize: 24,
                }}
              >
                Request
              </Text>
            </View>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
      {renderFlatList()}
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
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
  title: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 20,
  },
  value: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 24,
  },
});

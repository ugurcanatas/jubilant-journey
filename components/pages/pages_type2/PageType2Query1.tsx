import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

import { useQuery, useLazyQuery } from "@apollo/client";
import { GetTaxiZones } from "../../../GraphQL/QueryTaxiZones";
import { query_1 } from "../../../GraphQL/QueriesType_2/Query_1";

interface TaxiZoneDataTypes {
  Borough: string;
  Zone: string;
  LocationID: number;
  service_zone: string;
}

interface Q1_FlatList {
  _id: string;
  countOfVehicles: number;
  lookup_result: TaxiZoneDataTypes;
}

export const PageType2Query1 = ({ navigation }: Props) => {
  const [pickerValue, setPickerValue] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [date_start, setStartDate] = useState(new Date());
  const [date_end, setEndDate] = useState(new Date());

  const { data, error, loading } = useQuery(GetTaxiZones);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => showFilterLayout()}>
          <View style={{ marginHorizontal: 12 }}>
            <AntDesign name="filter" size={32} color="black" />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const showFilterLayout = () => {
    setShowFilter(!showFilter);
    console.log("Show Filter Layout", showFilter);
  };

  const renderPicker = () => {
    if (!loading) {
      const { getLocations } = data;
      return (
        <View>
          <Text
            style={{
              paddingTop: 24,
              fontSize: 24,
              textAlign: "center",
              fontFamily: "Roboto-Condensed-Regular",
            }}
          >
            Select Location
          </Text>
          <Picker
            mode="dialog"
            numberOfLines={5}
            selectedValue={pickerValue}
            onValueChange={(itemValue: number) => setPickerValue(itemValue)}
          >
            {getLocations.map((v: TaxiZoneDataTypes) => {
              const { Borough, Zone, LocationID } = v;
              return (
                <Picker.Item
                  key={LocationID.toString()}
                  label={`${Borough} / ${Zone}`}
                  value={LocationID}
                />
              );
            })}
          </Picker>
        </View>
      );
    }
    return (
      <Picker>
        <Picker.Item label="No Data Received" value="-1" />
      </Picker>
    );
  };

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
          value={date_start}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(e, selectedDate) =>
            setStartDate(selectedDate || date_start)
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
          value={date_end}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(e, selectedDate) => setEndDate(selectedDate || date_end)}
        />
      </View>
    );
  };

  const splitted = date_start.toISOString().substring(0, 10);
  console.log("SPLUTTED", splitted);
  console.log("TYPE OF ", typeof pickerValue);

  const [
    getFilteredData,
    { called: lazyCalled, loading: lazyLoading, data: lazyData },
  ] = useLazyQuery(query_1, {
    variables: {
      LocationID: pickerValue,
      date_start: date_start.toISOString().substring(0, 10),
      date_end: date_end.toISOString().substring(0, 10),
    },
  });

  if (lazyCalled) {
    console.log("REQUEST LAZY");
  }
  if (lazyCalled && lazyLoading) {
    console.log("GETTING");
  }

  console.log("Data Received", lazyData);

  const renderChilds = ({ item }: { item: Q1_FlatList }) => {
    const { _id, countOfVehicles } = item;
    console.log("Childs Rendering...", _id, countOfVehicles);

    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Text>{countOfVehicles}</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    console.log("LAZY CALLED STATUS", lazyCalled);
    console.log("LAZY LOADING STATUS", lazyLoading);

    if (lazyLoading) {
      return <Text>Loading...</Text>;
    }

    if (!lazyLoading && lazyCalled) {
      const { getSpesificLocation } = lazyData;
      console.log("Data RECEIVED", getSpesificLocation);
      const { countOfVehicles, _id, lookup_result } = getSpesificLocation[0];
      const { Borough, Zone } = lookup_result[0];
      return (
        <View
          style={{
            flex: 1,
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingHorizontal: 12,
          }}
        >
          <View style={{ marginVertical: 12 }}>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="date-range" size={24} color="black" />
              <Text style={styles.title}>Başlangıç Tarihi:</Text>
            </View>
            <Text style={[styles.value, { color: "#2da161" }]}>
              {date_start.toISOString().substring(0, 10)}
            </Text>
          </View>
          <View style={{ marginVertical: 12 }}>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="date-range" size={24} color="black" />
              <Text style={styles.title}>Bitiş Tarihi:</Text>
            </View>
            <Text style={[styles.value, { color: "#2da161" }]}>
              {date_end.toISOString().substring(0, 10)}
            </Text>
          </View>
          <View style={{ marginVertical: 12 }}>
            <View style={{ flexDirection: "row" }}>
              <MaterialIcons name="location-on" size={24} color="black" />
              <Text style={styles.title}>Lokasyon Bilgileri:</Text>
            </View>
            <Text style={styles.value}>
              {Zone} - {Borough}
            </Text>
          </View>
          <View style={{ marginVertical: 12 }}>
            <View style={{ flexDirection: "row" }}>
              <Ionicons
                style={{ paddingRight: 8 }}
                name="car-sport"
                size={24}
                color="black"
              />
              <Text style={styles.title}>Hareket eden araç sayısı:</Text>
            </View>

            <Text style={[styles.value, { color: "#ed9624" }]}>
              {countOfVehicles}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        style={styles.modalView}
        animationType="slide"
        transparent={false}
        presentationStyle="overFullScreen"
        visible={showFilter}
        onRequestClose={() => setShowFilter(!showFilter)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            paddingTop: 24,
            justifyContent: "flex-start",
          }}
        >
          {renderPicker()}
          {renderStartDatePicker()}
          {renderEndDatePicker()}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => [getFilteredData(), setShowFilter(false)]}
        >
          <View
            style={{
              marginBottom: 24,
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
      </Modal>

      {renderFlatList()}
    </View>
  );
};

const styles = StyleSheet.create({
  filterTitleText: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 18,
    color: "black",
    textAlign: "center",
    marginTop: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  title: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 24,
    textDecorationStyle: "solid",
    textDecorationLine: "underline",
  },
  value: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 32,
    paddingVertical: 6,
  },
});

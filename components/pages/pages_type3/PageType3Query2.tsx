import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import MapView, { Geojson, Marker, AnimatedRegion } from "react-native-maps";
import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useQuery, useLazyQuery } from "@apollo/client";
import { GetTaxiZones } from "../../../GraphQL/QueryTaxiZones";
import { TaxiZoneDataTypes } from "../customTypes";
import { query_2 } from "../../../GraphQL/QueriesType_3/Query_2";
import { TypeQ2T3, TCoordinates, TFeatureCollection } from "../customTypes";
//turf distance
import destination from "@turf/destination";
import uuid from "uuid";

const apikey =
  "pk.eyJ1IjoieWl5dGVjcCIsImEiOiJjanNtYnMwazIwN2I4NDRxZngwNGt5M3F3In0.eI-qjRstzkOwS7oTBSA9_g";

export const PageType3Query2 = ({ navigation }: { navigation: any }) => {
  const {
    data: locationsData,
    loading: locationsLoading,
    error: locationsError,
  } = useQuery(GetTaxiZones);
  const [showFilter, setShowFilter] = useState(false);
  const [taxizones, setTaxiZones] = useState<TaxiZoneDataTypes[] | []>([]);
  const [flatList, setFlatList] = useState<[TypeQ2T3] | []>([]);
  const [lineStrings, setLineStrings] = useState<TFeatureCollection[] | []>([]);
  const [showFlatList, setShowFlatList] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setShowFlatList(!showFlatList)}>
            <View style={{ marginHorizontal: 12 }}>
              <Entypo name="list" size={32} color="green" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
            <View style={{ marginHorizontal: 12 }}>
              <AntDesign name="filter" size={32} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (!locationsLoading) {
      console.log("Locations Data received", locationsData);
      const { getLocations } = locationsData;
      setTaxiZones(getLocations);
    }

    if (flatList.length > 0) {
      const fetchSet = flatList.map((v: TypeQ2T3) => {
        const { trip_distance, lookup_result } = v;
        const { X, Y } = lookup_result[0];

        const dest = destination([X, Y], trip_distance, 90, {
          units: "miles",
        });
        const { geometry } = dest;
        const { coordinates } = geometry;

        return `https://api.mapbox.com/directions/v5/mapbox/driving/${X},${Y};${coordinates[0]},${coordinates[1]}?geometries=geojson&access_token=${apikey}`;
      });

      console.log("URL FETCH SET", fetchSet);
      fetchSet.map((url: string) =>
        fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
          .then((res: any) => res.json())
          .then((data) => {
            console.log("DATA,", data);
            const { routes } = data;
            const [routeObject] = routes;
            const { geometry } = routeObject;
            const { coordinates } = geometry;
            const fc: TFeatureCollection = createFeaturesLineString(
              coordinates
            );
            setLineStrings((prev) => [...prev, ...[fc]]);
          })
      );
    }
  }, [locationsData, locationsLoading, flatList]);

  const createFeaturesLineString = (
    coordinates: [TCoordinates]
  ): TFeatureCollection => {
    return {
      type: "FeatureCollection",
      properties: {
        id: uuid.v4(),
        visible: true,
        color: genRGBA(),
      },
      features: [
        {
          type: "LineString",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates,
          },
        },
      ],
    };
  };

  const genRGBA = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r},${g},${b},0.5)`;
  };

  return (
    <View style={{ flex: 1 }}>
      {taxizones.length > 0 && (
        <Filters
          pickerData={taxizones}
          showFilter={showFilter}
          modalVisible={(visible: boolean) => setShowFilter(visible)}
          flatListData={(data: [TypeQ2T3]) => setFlatList(data)}
        />
      )}
      {flatList.length > 0 && (
        <FlatListData
          showListModal={showFlatList}
          modalVisible={(visible: boolean) => setShowFlatList(visible)}
          flatlist={flatList}
        />
      )}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {lineStrings.length > 0 &&
          lineStrings.map((v: TFeatureCollection) => (
            <Geojson
              geojson={v}
              key={v.properties?.id}
              strokeColor={v.properties?.color}
              strokeWidth={6}
            />
          ))}
      </MapView>
    </View>
  );
};

type FlatListComponentProps = {
  flatlist: TypeQ2T3[] | [];
  showListModal: boolean;
  modalVisible: (visible: boolean) => void;
};

const FlatListData = ({
  flatlist,
  showListModal,
  modalVisible,
}: FlatListComponentProps) => {
  const renderChilds = ({ item }: { item: TypeQ2T3 }) => {
    const { trip_distance, lookup_result } = item;
    const [lookupObject] = lookup_result;
    const { Borough, Zone, LocationID, X, Y } = lookupObject;
    return (
      <View style={styles.listItem}>
        <View
          style={{
            flexDirection: "column",
            width: "100%",
            paddingHorizontal: 12,
          }}
        >
          <Text style={{ fontFamily: "Roboto-Condensed-Bold", fontSize: 18 }}>
            {Borough}/{Zone}
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 12,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Latitude</Text>
              <Text style={styles.value}>{X}</Text>
            </View>
            <View style={{ flexDirection: "column" }}>
              <Text style={styles.title}>Longitude</Text>
              <Text style={styles.value}>{Y}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderFlatList = () => {
    return (
      <FlatList
        keyExtractor={() => uuid.v4()}
        data={flatlist}
        renderItem={renderChilds}
      />
    );
  };

  return (
    <Modal
      style={styles.modalView}
      animationType="slide"
      transparent={false}
      presentationStyle="overFullScreen"
      visible={showListModal}
      onRequestClose={() => modalVisible(false)}
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
            Request List ({flatlist.length} routes found)
          </Text>
          <TouchableOpacity onPress={() => modalVisible(false)}>
            <Ionicons name="ios-close" size={32} color="red" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {flatlist.length > 0 && renderFlatList()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

type FilterProps = {
  pickerData: TaxiZoneDataTypes[] | [];
  showFilter: boolean;
  modalVisible: (visible: boolean) => void;
  flatListData: (data: [TypeQ2T3]) => void;
};

const Filters = ({
  showFilter,
  modalVisible,
  pickerData,
  flatListData,
}: FilterProps) => {
  const [date, setDate] = useState(new Date());
  const [pickerValue, setPickerValue] = useState<number>(0);

  console.log("Date Updated", date);
  console.log("Picker Updated", pickerValue);

  const [requestFilteredData, { called, loading, data }] = useLazyQuery(
    query_2,
    {
      variables: {
        date: date.toISOString().substring(0, 10),
        LocationID: pickerValue,
      },
    }
  );

  useEffect(() => {
    if (called && !loading) {
      console.log("Data Received Filter", data);
      const { getRandom5 } = data;
      flatListData(getRandom5);
    }
  }, [called, loading, data]);

  const renderDatePicker = () => {
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
          value={date}
          mode="date"
          is24Hour={true}
          display="spinner"
          onChange={(e, selectedDate) => setDate(selectedDate || date)}
        />
      </View>
    );
  };
  const renderLocationPicker = () => {
    if (pickerData.length > 0) {
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
            selectedValue={pickerValue}
            onValueChange={(itemValue) => setPickerValue(Number(itemValue))}
          >
            {pickerData.map((v: TaxiZoneDataTypes) => {
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
  return (
    <Modal
      style={styles.modalView}
      animationType="slide"
      transparent={false}
      presentationStyle="overFullScreen"
      visible={showFilter}
      onRequestClose={() => modalVisible(false)}
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
          <TouchableOpacity onPress={() => modalVisible(false)}>
            <Ionicons name="ios-close" size={32} color="red" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
            }}
          >
            {renderDatePicker()}
            {renderLocationPicker()}
          </View>
        </ScrollView>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => [requestFilteredData(), modalVisible(false)]}
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
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  buttonTouchable: { flex: 1, marginHorizontal: 12 },
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
    fontSize: 18,
    textDecorationLine: "underline",
    textDecorationColor: "black",
    paddingVertical: 6,
  },
  value: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 20,
  },
});

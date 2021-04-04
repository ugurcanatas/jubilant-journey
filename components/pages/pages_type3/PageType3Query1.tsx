import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useLazyQuery } from "@apollo/client";
import destination from "@turf/destination";
import MapView, { Polyline, Geojson } from "react-native-maps";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

import { query_1 } from "../../../GraphQL/QueriesType_3/Query_1";

const apikey =
  "pk.eyJ1IjoieWl5dGVjcCIsImEiOiJjanNtYnMwazIwN2I4NDRxZngwNGt5M3F3In0.eI-qjRstzkOwS7oTBSA9_g";

export const PageType3Query1 = ({ navigation }: { navigation: any }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [date, setDate] = useState(new Date());
  const [buttonDisabled, setDisabled] = useState(true);
  const [draw, setDraw] = useState(false);
  const [polygons, setPolygons] = useState([]);
  const [geojson, setGeojson] = useState({});

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

  const [getData, { loading, called, data }] = useLazyQuery(query_1, {
    variables: {
      date,
    },
  });

  useEffect(() => {
    if (called && !loading) {
      console.log("Received data", data);
      setDisabled(false);
    }

    console.log("USE EFFECT DRAW", draw);
  }, [loading, called, data, draw, polygons]);

  const drawRoute = async () => {
    const { getLongestTripByDate } = data;
    const { lookup_result, trip_distance } = getLongestTripByDate[0];
    const { X: startLat, Y: startLon } = lookup_result[0];
    const finish = destination([startLat, startLon], trip_distance, 90, {
      units: "miles",
    });
    const { geometry } = finish;
    const { coordinates } = geometry;
    //console.log("COORDINATES", coordinates);

    const endpoint = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLat},${startLon};${coordinates[0]},${coordinates[1]}?geometries=geojson&access_token=${apikey}`;

    let resp = await fetch(endpoint, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const response = await resp.json();
    console.log("RESPONSE", response);
    const { routes } = response;
    const [routeData] = routes;
    setGeojson(routeData);
    const { geometry: routeGeometry } = routeData;
    const { coordinates: routeCoordinates } = routeGeometry;
    const namedCoordinates = routeCoordinates.map((v: number[]) => {
      return { latitude: v[0], longitude: v[1] };
    });
    //console.log("NAMED", namedCoordinates);

    setTimeout(() => {
      setDraw(true);
      setPolygons(namedCoordinates);
    }, 5000);
  };

  const renderPolylines = () => {
    if (polygons.length > 0) {
      console.log("RENDERING POLYLINES");

      return (
        <Polyline
          coordinates={polygons}
          strokeWidth={6}
          strokeColor="red"
          fillColor="rgba(100,0,0,0.5)"
        />
      );
    }
  };

  const myPlace = {
    type: "FeatureCollection",
    features: [
      {
        type: "LineString",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [-73.992463, 40.748469],
            [-73.989617, 40.747277],
            [-73.987766, 40.749793],
            [-73.981263, 40.747051],
            [-73.98031, 40.748335],
          ],
        },
      },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
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
          <ScrollView>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              {renderDatePicker()}
            </View>
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => [getData(), setShowFilter(false)]}
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

      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Polyline
          coordinates={polygons}
          strokeWidth={6}
          strokeColor="red"
          fillColor="red"
        />
        <Geojson
          geojson={myPlace}
          strokeColor="red"
          fillColor="green"
          strokeWidth={2}
        />
      </MapView>

      <View style={{ width: "100%", position: "absolute", bottom: 8 }}>
        <TouchableOpacity
          onPress={() => drawRoute()}
          disabled={buttonDisabled}
          activeOpacity={0.8}
          style={styles.buttonTouchable}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: buttonDisabled ? "#9ca4ba" : "#315fe8",
              paddingVertical: 24,
              borderRadius: 8,
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
              Draw Route
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
  },
  buttonTouchable: { flex: 1, marginHorizontal: 12 },
});

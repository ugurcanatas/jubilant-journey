import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import destination from "@turf/destination";
import uuid from "uuid";
import MapView, { Geojson } from "react-native-maps";
import { useQuery } from "@apollo/client";
import { query_3 } from "../../../GraphQL/QueriesType_3/Query_3";
import {
  TaxiZoneDataTypes,
  TFeatureCollection,
  TCoordinates,
  TMinMax,
} from "../customTypes";

const apikey =
  "pk.eyJ1IjoieWl5dGVjcCIsImEiOiJjanNtYnMwazIwN2I4NDRxZngwNGt5M3F3In0.eI-qjRstzkOwS7oTBSA9_g";

export const PageType3Query3 = () => {
  const { loading, error, data } = useQuery(query_3);
  const [queryData, setQueryData] = useState<TMinMax[] | []>([]);
  const [lineStrings, setLineStrings] = useState<TFeatureCollection[] | []>([]);

  useEffect(() => {
    if (!loading) {
      const { getMin3Passengers } = data;
      console.log("Data Received Min 3 Pass:", getMin3Passengers);

      setQueryData(getMin3Passengers);
    }

    if (queryData.length > 0) {
      requestAPI();
    }
  }, [loading, data, error, queryData]);

  type FnType = {
    x: number;
    y: number;
    distance: number;
  };
  const returnCoordinates = ({ x, y, distance }: FnType) => {
    const dest = destination([x, y], distance, 90, {
      units: "miles",
    });
    const { geometry } = dest;
    const { coordinates } = geometry;
    return coordinates;
  };

  const requestAPI = () => {
    const MaxData = queryData[0];
    console.log("MAX DATA RECEIVED", MaxData);

    const { max: max_distance, lookup_result: maxLookup } = MaxData;
    const { X: maxX, Y: maxY } = maxLookup[0];
    const maxCoords = returnCoordinates({
      x: maxX,
      y: maxY,
      distance: max_distance,
    });

    const MinData = queryData[queryData.length - 1];
    const { max: min_distance, lookup_result: minLookup } = MinData;
    const { X: minX, Y: minY } = minLookup[0];
    const minCoords = returnCoordinates({
      x: minX,
      y: minY,
      distance: min_distance,
    });
    const apiUrls = [
      `https://api.mapbox.com/directions/v5/mapbox/driving/${maxX},${maxY};${maxCoords[0]},${maxCoords[1]}?geometries=geojson&access_token=${apikey}`,
      `https://api.mapbox.com/directions/v5/mapbox/driving/${minX},${minY};${minCoords[0]},${minCoords[1]}?geometries=geojson&access_token=${apikey}`,
    ];

    apiUrls.map((url: string) =>
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
          const fc: TFeatureCollection = createFeaturesLineString(coordinates);
          setLineStrings((prev) => [...prev, ...[fc]]);
        })
    );
  };

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

const styles = StyleSheet.create({});

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { GraphIcon } from "./CardBGSvg";

interface CustomButtonProps {
  title: string;
  excerpt: string;
  toOnClick: string;
  gradientColors: string[];
}

export const CardComponent = (props: CustomButtonProps) => {
  return (
    <View style={styles.card}>
      <LinearGradient
        style={styles.background}
        colors={props.gradientColors}
        start={[0, 0]}
        end={[1, 1]}
      />
      <View style={styles.cardContent}>
        <GraphIcon style={styles.cardSVGBG} {...props} />
        <Text style={styles.cardTitle}>{props.title}</Text>
        <Text style={styles.cardExcerpt}>{props.excerpt}</Text>
        <TouchableOpacity style={styles.buttonWrapper}>
          <View style={styles.buttonView}>
            <Text style={styles.buttonTitle}>Sorgu sayfasına git</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardSVGBG: {
    position: "absolute",
    bottom: 12,
    left: 12,
    opacity: 0.2,
    height: 100,
    width: 100,
  },
  card: {
    flex: 1,
    height: 220,
    width: 350,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
    borderRadius: 8,
    elevation: 10,
  },
  cardContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontFamily: "Roboto-Condensed-Bold",
    fontSize: 24,
    color: "white",
  },
  cardExcerpt: {
    fontFamily: "Roboto-Condensed-Regular",
    fontSize: 20,
    color: "white",
  },
  buttonWrapper: {
    alignSelf: "flex-end",
  },
  buttonView: {
    width: 150,
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
});

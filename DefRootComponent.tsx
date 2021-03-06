import React, { useState } from "react";
import { StyleSheet, Text, View, Button, FlatList } from "react-native";
import { useQuery } from "@apollo/client";

import { queryCardsLayout } from "./GraphQL/QueryCardLayout";

import { CardComponent } from "./components/CardComponent";

//Interface for horizontal cards
interface HorizontalItems {
  custom_field_id: string;
  title: string;
  excerpt: string;
  toOnClick: string;
  gradientColors: string[];
}

//interface for vertical list
interface CardLayout {
  custom_field_id: string;
  title: string;
  items: HorizontalItems[];
}

export const DefRootComponent = () => {
  const [layout, setLayout] = useState({});

  const { data, loading, error } = useQuery(queryCardsLayout);
  console.log("TAXI ZONES", data, loading);

  const renderChildItem = (
    { item }: { item: HorizontalItems },
    custom_field_id: string
  ) => {
    const { excerpt, title, toOnClick, gradientColors } = item;
    return (
      <CardComponent
        excerpt={excerpt}
        title={title}
        toOnClick={toOnClick}
        gradientColors={gradientColors}
        parentID={custom_field_id}
      />
    );
  };

  const renderChildFlatlist = ({ item }: { item: CardLayout }) => {
    const { title, items, custom_field_id } = item;
    return (
      <View style={styles.horizontalListStyle}>
        <Text style={styles.horizontalListTitle}>{title}</Text>
        <FlatList
          horizontal
          data={items}
          renderItem={(item) => renderChildItem(item, custom_field_id)}
          extraData={custom_field_id}
          keyExtractor={(item: HorizontalItems) => item.toOnClick}
        />
      </View>
    );
  };

  const renderLayout = () => {
    if (!loading) {
      const { getCardsLayout } = data;

      return (
        <FlatList
          renderItem={renderChildFlatlist}
          data={getCardsLayout}
          keyExtractor={(item: CardLayout) => item.custom_field_id}
        />
      );
    }
    return <Text>Loading...</Text>;
  };

  return <View>{renderLayout()}</View>;
};

const styles = StyleSheet.create({
  horizontalListStyle: {
    marginVertical: 12,
  },
  horizontalListTitle: {
    fontSize: 30,
    marginHorizontal: 16,
    marginVertical: 8,
    fontFamily: "Roboto-Condensed-Bold",
  },
});

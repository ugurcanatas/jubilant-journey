import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface CustomButtonProps {
    title: string;
    subtitle: string,
    contentList: string[],
    color: string;
    icon: string;
    backgroundImage: string;
    listener: () => void;
  }

const CardComponent = (props: CustomButtonProps) => {
    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default CardComponent

const styles = StyleSheet.create({})

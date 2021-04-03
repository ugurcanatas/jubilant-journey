import React, {useState} from 'react'
import { StyleSheet, Text, View, Button, FlatList, ListRenderItem } from 'react-native'
import {useQuery} from '@apollo/client';


import {queryCardsLayout} from './GraphQL/QueryCardLayout';

interface HorizontalItems {
    title: string,
    excerpt: string,
    toOnClick: string
}

interface CardLayout {
    custom_field_id: string,
    title: string,
    items: HorizontalItems[]
}

export const DefRootComponent = () => {
    
    const [layout, setLayout] = useState({})

    const {data,loading,error} = useQuery(queryCardsLayout);
    console.log("TAXI ZONES", data,loading);

    const renderChildItem = ({item}: {item: HorizontalItems}) => {
        const {excerpt,title,toOnClick} = item;
        return (
            <View>
                <Text>{title}</Text>
                <Text>{excerpt}</Text>
            </View>
        )
    }

    const renderChildFlatlist = ({item}: {item: CardLayout}) => {
        const {title,items} = item;
        return <FlatList horizontal data={items} 
        renderItem={renderChildItem}
            keyExtractor={(item:HorizontalItems) => item.toOnClick}/>
    }

    const renderLayout = () => {
        if(!loading) {
            const {getCardsLayout} = data;
            
            return <FlatList 
            renderItem={renderChildFlatlist}
            data={getCardsLayout} 
            keyExtractor={(item:CardLayout) => item.custom_field_id} />
        }
        return <Text>Loading...</Text>
    }
    

    return (
        <View>
            <Text>Root Component</Text>
            {renderLayout()}
        </View>
    )
}

const styles = StyleSheet.create({})


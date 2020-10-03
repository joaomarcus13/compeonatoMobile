import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Table from './table'
import Jogos from './jogos'

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBarOptions={{
                    activeTintColor: '#fff',
                    activeBackgroundColor:'#2c2c2c',
                    inactiveBackgroundColor:'#3f3f3f',
                    labelStyle: {
                    fontSize: 20,
                    marginBottom:15,
                    
                    },
                    tabStyle: {
                        height: 50 ,
                        marginBottom:20
                      },
                     style: {
                        backgroundColor: '#2c2c2c',
                },
                }}
                >
                <Tab.Screen name="tabela" component={Table} />
                <Tab.Screen name="jogos" component={Jogos} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
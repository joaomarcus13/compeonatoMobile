import React,{useState} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import Table from './table'
import Jogos from './jogos'
import Details from './details'

const Stack = createStackNavigator();

function JogosScreen() {
    return (
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false }} name="jogos" component={Jogos} />
        <Stack.Screen options={{headerShown:false }} name="details" component={Details} />
      </Stack.Navigator>
    );
  }

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
                
                <Tab.Screen name="TABELA" component={Table} />
                <Tab.Screen options={{title:'JOGOS'}} name="jogosScreen" component={JogosScreen} />
               
            </Tab.Navigator>
        </NavigationContainer>
    );
}
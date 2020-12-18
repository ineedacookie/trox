/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import OpenedScreen from './screens/OpenedScreen';
import TypeScreen from './screens/TypeScreen';
import PeopleScreen from './screens/PeopleScreen';
import styles from './styles/styles';

const Tab = createMaterialTopTabNavigator();

const App: () => React$Node = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator

            tabBarOptions={{
                activeTintColor: '#ffffff',
                style: styles.tabNavigator,
                labelStyle: {
                    fontWeight: 'bold',
                    fontSize: 16,
                }
            }}>
            <Tab.Screen name="Projects" component={OpenedScreen} />
            <Tab.Screen name="Types" component={TypeScreen} />
            <Tab.Screen name="People" component={PeopleScreen} />
        </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

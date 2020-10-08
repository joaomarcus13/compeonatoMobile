/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Routes from './src/routes'

import Tabela from './src/table'

import {NameProvider} from './src/context'

const App = () => {


  //const [name,setName] = useState('brasileiro')

  return (
    <>
      <NameProvider>
        <Routes></Routes>
      </NameProvider>
      <StatusBar style="light" backgroundColor="#363636" />
    </>
  );
};

const styles = StyleSheet.create({

});

export default App;

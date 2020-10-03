/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect ,useCallback} from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import api from './services/api'

import logos from './services/table.json'
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/FontAwesome'
Icon.loadFont();


const Header = ({ arrowLeft, arrowRight, rodada, btn }) => (
  <View style={styles.header}>
    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" disabled={btn[0]} onPress={arrowLeft} style={styles.icon}>
      <Icon name="angle-left" size={30} color="#fff"></Icon>
    </TouchableHighlight>
    <Text style={styles.rodada}>{rodada}</Text>
    <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" disabled={btn[1]} onPress={arrowRight} style={styles.icon}>
      <Icon name="angle-right" size={30} color="#fff"></Icon>
    </TouchableHighlight>
  </View>
)



const App = ({ navigation }) => {

  const [selectedValue, setSelectedValue] = useState("brasileiro");
  const [spinner, setSpinner] = useState(true);
  const [rodada, setRodada] = useState("");
  const [jogos, setJogos] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [btnL, setbtnL] = useState(false);
  const [btnR, setbtnR] = useState(false);


  const setStorage = async (arr) => {
    try {
      await AsyncStorage.setItem(
        `JOGOS-${selectedValue}`,
        JSON.stringify(arr)
      );
    } catch (error) {
      console.log('erro setItem')
    }
  }


  const getStorage = async () => {

    const value = await AsyncStorage.getItem(`JOGOS-${selectedValue}`);
    //const r = await AsyncStorage.getItem('rodada')
    //console.log(value);
    if (value) {
      console.log('async storaga')
      //console.log(JSON.parse(value))
      setRodada(Object.keys(JSON.parse(value)))
      setJogos(Object.values(JSON.parse(value))[0])
      setSpinner(false)

    } else {
      // loadData()
      console.log('erro recuperar getitem')
    }

  }

  const getRodada=()=>{
    let sub = String(rodada).substr(0, 2)
    if (sub.substring(1) === 'ª')
      sub = sub.substr(0, 1)

    return sub
  }

  const arrowLeft = () => {
    let r = getRodada()
    setSpinner(true)
    loadData(Number(r)-1)
  }


  const arrowRight = () => {
    let r = getRodada()
    setSpinner(true)
    loadData(Number(r)+1)
  }



  const wait = (timeout) => {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  


  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(1000).then(() => {
      setSpinner(true)
      loadData(getRodada(),'true')
      setRefreshing(false)
    });
  }, [refreshing]);

  const loadData = async (n_rodada = null,refresh='false') => {
    let url = n_rodada ? 
    `jogos/${selectedValue}?n_rodada=${n_rodada}&refresh=${refresh}` : 
    `jogos/${selectedValue}?refresh=${refresh}`

    n_rodada<=1?setbtnL(true) : setbtnL(false)
    n_rodada>=38?setbtnR(true) : setbtnR(false)
    
    console.log(url)
    try {
      console.log('load')
      const data = await api.get(url)
    
      setRodada(Object.keys(data.data))
      setJogos(Object.values(data.data)[0])
      setSpinner(false)
      setStorage(data.data)
    } catch (error) {
      console.log('erro api ',error)
      getStorage()
    }
    
  }

  useEffect(() => {
    console.log('use effect')
    NetInfo.fetch().then(state => {
      state.isConnected ? loadData() : getStorage()
    });
return
  }, [])


  if (spinner) {
    return (
      <SafeAreaView style={styles.container}>
        <Header arrowLeft={arrowLeft} arrowRight={arrowRight} rodada={rodada} btn={[btnL,btnR]}></Header>
        <View style={styles.horizontal}>
          <ActivityIndicator size='large' color="#fff"></ActivityIndicator>
        </View>
      </SafeAreaView>
    )
  } else {

    return (
      <SafeAreaView style={styles.container}>
        <Header arrowLeft={arrowLeft} arrowRight={arrowRight} rodada={rodada} btn={[btnL,btnR]}></Header>
        <ScrollView 
            style={styles.scroll}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
            }>

          {
            jogos!=[]?
            jogos.map(jogo => {
              return (
                <View key={jogo.mandante} style={styles.item} >
                  <Text style={styles.desc}>{jogo.data} {jogo.local} {jogo.horario}</Text>
                  <View style={styles.placar}>
                    <Text style={styles.text}>{jogo.mandante} </Text>
                    <Image style={styles.logo} source={{ uri: `https://json.gazetaesportiva.com/footstats/logos/88x88/${logos[jogo.mandante]}.png` }}></Image>
                    <Text style={styles.text}>  {jogo.golMandante}  x  {jogo.golVisitante}  </Text>
                    <Image style={styles.logo} source={{ uri: `https://json.gazetaesportiva.com/footstats/logos/88x88/${logos[jogo.visitante]}.png` }}></Image>
                    <Text style={styles.text}> {jogo.visitante}</Text>
                  </View>
                </View>
              )
            })
            : <Text>Dados Nao disponiveis</Text>
          }
        </ScrollView>
      </SafeAreaView>


    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    backgroundColor: '#1C1C1C'
  },
  logo: {
    width: 35,
    height: 35,
  },
  desc: {
    marginTop: 10,
    color: 'white',
    fontSize: 12,
    marginBottom: -5,
    color: "#d3d3d3"
  },
  item: {

    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
    marginVertical: 1
  },
  placar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 20
  },
  text: {
    fontSize: 20,
    color: 'white'
  },
  rodada: {
    fontSize: 18,
    color: '#d3d3d3'
  },
  header: {
    backgroundColor: "#1C1C1C",
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  icon: {
    alignItems: 'center',
    justifyContent: "center",
    width: 60,
    height: "100%",


  },
  horizontal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: '#2c2c2c'
  }
});

export default App;

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  RefreshControl,
  Modal
} from "react-native";
import api from './services/api'
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome'
Icon.loadFont();

const Item = ({ item, posicao, style }) => (
  <View style={[styles.item, style]}>
    <Text style={[styles.title, styles.time]} >{posicao} - {item.time} </Text>
    <Text style={[styles.title, styles.stats]}>{item.jogos}</Text>
    <Text style={[styles.title, styles.stats]}>{item.vitorias}</Text>
    <Text style={[styles.title, styles.stats]}>{item.derrotas}</Text>
    <Text style={[styles.title, styles.stats]}>{item.empates}</Text>
    <Text style={[styles.title, styles.stats2]}>{item.gp}:{item.gc} </Text>
    <Text style={[styles.title, styles.stats, { color: 'white' }]}>{item.pontos}</Text>
  </View>
);

const Header = ({ selectedValue, handleSelectedValue, handleRefresh }) => (
  <>
    <View style={styles.header}>
      <Picker
        selectedValue={selectedValue}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => handleSelectedValue(itemValue)}
        mode='dialog'
      >
        <Picker.Item label="Campeonato Brasileiro" value="brasileiro" />
        <Picker.Item label="Campeonato Espanhol" value="espanhol" />
        <Picker.Item label="Campeonato Inglês" value="ingles" />
        <Picker.Item label="Campeonato Italiano" value="italiano" />
        <Picker.Item label="Campeonato Alemão" value="alemao" />
        <Picker.Item label="Campeonato Francês" value="frances" />
        <Picker.Item label="Campeonato Português" value="portugues" />

      </Picker>
      <TouchableOpacity style={styles.icon} onPress={() => { handleRefresh() }}>
        <Icon name="refresh" size={18} color="#FFF" />
      </TouchableOpacity>
    </View>

    <View style={styles.header2}>
      <Text style={[styles.title, styles.time]}></Text>
      <Text style={[styles.title, styles.stats]}>J</Text>
      <Text style={[styles.title, styles.stats]}>V</Text>
      <Text style={[styles.title, styles.stats]}>D</Text>
      <Text style={[styles.title, styles.stats]}>E</Text>
      <Text style={[styles.title, styles.stats2]}>Gols</Text>
      <Text style={[styles.title, styles.stats, { color: 'white' }]}>P</Text>
    </View>
  </>
)

const App = ({ navigation }) => {
  const [spinner, setSpinner] = useState(true);
  const [tabela, setTabela] = useState([])
  const [selectedValue, setSelectedValue] = useState("brasileiro");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [popup, setPopup] = useState(false);


  const onRefresh = () => {
    setRefreshing(true);    
    handleRefresh(selectedValue)
    setRefreshing(false)
    
  };


  const handleRefresh = () => {
    setSpinner(true)
    loadData('true', selectedValue)
  }

  const handleSelectedValue = (itemValue) => {
    setSelectedValue(itemValue)
  }

  const setStorage = async (arr) => {
    try {
      await AsyncStorage.setItem(
        `TABELA-${selectedValue}`,
        JSON.stringify(arr)
      );
    } catch (error) {
      console.log('erro setItem')
    }
  }

  const loadData = async (refresh, nomeCampeonato) => {
    setError(false)
    const arr = []
    try {

      const data = await api.get(`tabela/${nomeCampeonato}?refresh=${refresh}`)
      for (let i = 1; i <= 20; i++) {
        arr.push(data.data[i])
      }
      setSpinner(false)
      setTabela(arr)
      setStorage(arr)
    } catch (error) {
      setSpinner(false)
      handlePopup()
      console.log(error)
    }

  }

  const handlePopup = () => {
    setPopup(true)
    setTimeout(() => { setPopup(false) }, 3000)

  }


  const getStorage = async (nomeCampeonato) => {
    setError(false)
    try {
      const value = await AsyncStorage.getItem(`TABELA-${nomeCampeonato}`);

      if (value) {
        console.log('valuee')
        setTabela(JSON.parse(value))
        setSpinner(false)

      } else {
        loadData('false', nomeCampeonato)
      }
    } catch (error) {
      setSpinner(false)
      setError(true)
      console.log('erro getItem: ', error)
    }

  }

  useEffect(() => {

    getStorage(selectedValue)

  }, [selectedValue])


  if (spinner) {
    return (
      <SafeAreaView style={styles.container}>
        <Header selectedValue={selectedValue}
          handleSelectedValue={handleSelectedValue}
          handleRefresh={handleRefresh}>
        </Header>
        <View style={styles.horizontal}>
          <ActivityIndicator size='large' color="#fff"></ActivityIndicator>
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={styles.container}>

        <Header selectedValue={selectedValue}
          handleSelectedValue={handleSelectedValue}
          handleRefresh={handleRefresh}>
        </Header>

        <Modal
          animationType="fade"
          transparent={true}
          visible={popup}

        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Erro ao atualizar</Text>

            </View>
          </View>
        </Modal>

        <ScrollView style={styles.scroll} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}></RefreshControl>
        }>

          {
            error ?
              <Text style={styles.erro}>dados não disponíveis</Text> :
              tabela.map((tab, index) => {
                return <Item key={index} posicao={index + 1} item={tab} style={{ backgroundColor: "#2c2c2c" }}></Item>
              })
          }

        </ScrollView>
      </SafeAreaView>
    );
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: 'center'
  },
  item: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 0.3

  },
  title: {
    fontSize: 16,
    color: '#d3d3d3'
  },
  time: {
    width: '43%',
    color: 'white'
  },
  stats: {
    fontSize: 15,
    width: '8.5%',
    textAlign: 'center'
  },
  stats2: {
    fontSize: 15,
    width: "15%",
    textAlign: 'center'
  },

  header: {
    backgroundColor: "#1C1C1C",
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  header2: {
    flexDirection: 'row',
    backgroundColor: "#1C1C1C",
    height: 40,
    justifyContent: 'flex-end',

  },
  picker: {
    color: 'white',
    width: '80%',
    height: 90,
  },

  pickerItem: {
    fontSize: 18,
  },
  scroll: {
    backgroundColor: '#1C1C1C'
  },
  icon: {
    backgroundColor: 'transparent',
    padding: 10
  },
  horizontal: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: '#2c2c2c'
  },
  erro: {
    color: 'white',
    textAlign: 'center',
    marginVertical: "70%"
  },



  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'


  },
  modalView: {
    margin: 0,
    backgroundColor: "#191919",
    borderRadius: 15,
    padding: 15,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",

  },
  modalText: {


    color: 'white',

  }
});

export default App;
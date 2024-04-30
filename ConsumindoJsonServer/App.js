import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, ScrollView } from 'react-native';
import axios from 'axios';

const App = () => {
  const [generoFilme, setGeneroFilme] = useState('');
  const [filmesEncontrados, setFilmesEncontrados] = useState([]);
  const [erro, setErro] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const buscarFilmePorGenero = async () => {
    try {
      const response = await axios.get(`http://10.136.63.228:3000/filmes`);
      console.log(response.data);
      if (response.data && response.data.length > 0) {
        const filmesFiltrados = response.data.filter(filme =>
          filme.Genre.toLowerCase().includes(generoFilme.toLowerCase())
        );
        console.log(filmesFiltrados);
        if (filmesFiltrados.length > 0) {
          setFilmesEncontrados(filmesFiltrados);
          setErro('');
          setModalVisible(true);
        } else {
          setFilmesEncontrados([]);
          setErro('Nenhum filme encontrado.');
        }
      } else {
        setFilmesEncontrados([]);
        setErro('Nenhum filme encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar filme:', error);
      setFilmesEncontrados([]);
      setErro('Erro ao buscar filme.');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha o gênero do filme que quer assistir:</Text>
      <TextInput
        style={styles.input}
        placeholder="Gênero do filme. Ex: Action"
        value={generoFilme}
        onChangeText={text => setGeneroFilme(text)}
        keyboardType="default"
      />
      <Button
        title="Buscar"
        onPress={buscarFilmePorGenero}
      />
      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      {/* Modal para exibir os detalhes do filme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <ScrollView>
            {filmesEncontrados.map(filme => (
              <View key={filme.imdbID} style={styles.filmeItem}>
                <Text style={styles.descricao}>{filme.Title}</Text>
                <Text style={styles.descricao}>{filme.Year}</Text>
                <Text style={styles.descricao}>{filme.Director}</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="Fechar" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  filmeItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  descricao: {
    fontSize: 14,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default App;

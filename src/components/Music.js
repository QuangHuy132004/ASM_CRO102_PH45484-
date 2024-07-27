import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, StyleSheet, ScrollView } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import firestore from '@react-native-firebase/firestore';

const Music = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      const data = await firestore().collection('exercises').get();
      const exerciseData = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setExercises(exerciseData);
      setFilteredExercises(exerciseData);
    };

    fetchData();
  }, []);

  const applyFilter = (type) => {
    setFilter(type);
    if (type === 'All') {
      setFilteredExercises(exercises);
    } else {
      const filteredData = exercises.filter(exercise =>
        exercise.title.toLowerCase().includes(type.toLowerCase())
      );
      setFilteredExercises(filteredData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => {
      setSelectedExercise(item);
      setModalVisible(true);
    }}>
      <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
      <View style={styles.itemTextContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#D7D9A9' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Mental Health</Text>
      </View>

      <View style={styles.filterContainer}>
        {['All', 'Yoga', 'Meditation'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.filterButton, filter === type && styles.activeFilterButton]}
            onPress={() => applyFilter(type)}
          >
            <Text style={styles.filterText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredExercises}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <ScrollView contentContainerStyle={styles.modalContent}>
          {selectedExercise && (
            <>
              <Text style={styles.modalTitle}>{selectedExercise.title}</Text>
              <YoutubePlayer
                height={250}
                play={true}
                videoId={selectedExercise.videoUrl}
              />
              <Text style={styles.modalDescription}>{selectedExercise.description}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>

      <TouchableOpacity onPress={() => {
          navigation.navigate('Music2');
        }} style={{
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 110,
        right: 39,
      }}>
        <Image source={require('../img/spotify.png')} style={{width: 90, height: 90}}/>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Image
            style={styles.footerIcon}
            source={require('../img/chatt.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.footerIcon}
            source={require('../img/mind.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Run')}>
          <Image
            style={styles.footerIcon}
            source={require('../img/healthy.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('BMI')}>
          <Image
            style={styles.footerIcon}
            source={require('../img/bmi.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
          <Image
            style={styles.footerIcon}
            source={require('../img/list.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#407332',
    paddingVertical: 17,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEF9F3',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  filterButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#407332',
    borderRadius: 5,
  },
  activeFilterButton: {
    backgroundColor: '#305022',
  },
  filterText: {
    color: '#fff',
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  itemTextContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#888',
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'justify',
  },
  closeButton: {
    backgroundColor: '#407332',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: '#407332',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  footerIcon: {
    height: 37,
    width: 37,
    resizeMode: 'contain',
  },
});

export default Music;

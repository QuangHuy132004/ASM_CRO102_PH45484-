import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image
} from 'react-native';
import TrackPlayer, { useTrackPlayerEvents, usePlaybackState, useProgress, Event, State } from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import { setupPlayer, addTracks, playbackService } from './trackPlayerServices';
import { useNavigation } from '@react-navigation/native'; // For navigation

function Music2() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const navigation = useNavigation(); // For navigation
  
  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }
      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);

  function Playlist() {
    const [queue, setQueue] = useState([]);
    const [currentTrack, setCurrentTrack] = useState(0);

    async function loadPlaylist() {
      const queue = await TrackPlayer.getQueue();
      setQueue(queue);
    }

    useEffect(() => {
      loadPlaylist();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
      if (event.state === State.PlaybackTrackChanged) {
        let index = await TrackPlayer.getCurrentTrack();
        setCurrentTrack(index);
      }
    });

    function PlaylistItem({ index, title, isCurrent }) {
      function handleItemPress() {
        TrackPlayer.skip(index);
      }

      return (
        <TouchableOpacity onPress={handleItemPress}>
          <Text
            style={{
              ...styles.playlistItem,
              backgroundColor: isCurrent ? '#666' : 'transparent',
              color: '#FFF'
            }}>
            {title}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.playlistContainer}>
        <FlatList
          data={queue}
          renderItem={({ item, index }) => (
            <PlaylistItem
              index={index}
              title={item.title}
              isCurrent={currentTrack === index}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  function Controls() {
    const playerState = usePlaybackState();

    async function handlePlayPress() {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }
    }

    return (
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
          <Image
            source={require('../img/previous.png')}
            style={styles.controlIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlayPress}>
          <Image
            source={playerState === State.Playing ? require('../img/pause-button.png') : require('../img/play-button.png')}
            style={styles.controlIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
          <Image
            source={require('../img/nextt.png')}
            style={styles.controlIcon}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function TrackProgress() {
    const { position, duration } = useProgress(200);

    function format(seconds) {
      let mins = (parseInt(seconds / 60)).toString().padStart(2, '0');
      let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }

    return (
      <View style={styles.trackProgressContainer}>
        <Text style={styles.trackProgressText}>
          {format(position)} / {format(duration)}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#FFF"
          maximumTrackTintColor="#000"
          thumbTintColor="#FFF"
          value={position}
          onValueChange={value => TrackPlayer.seekTo(value)}
        />
      </View>
    );
  }

  function Header() {
    const [info, setInfo] = useState({});

    useEffect(() => {
      setTrackInfo();
    }, []);

    useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
      if (event.state === State.PlaybackTrackChanged) {
        setTrackInfo();
      }
    });

    async function setTrackInfo() {
      const track = await TrackPlayer.getCurrentTrack();
      const info = await TrackPlayer.getTrack(track);
      setInfo(info);
    }

    return (
      <View style={styles.header}>
        <Text style={styles.songTitle}>{info.title}</Text>
        <Text style={styles.artistName}>{info.artist}</Text>
      </View>
    );
  }

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#FFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.goBackButton}
            source={require('../img/exit.png')}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Music</Text>
      </View>
      <Header />
      <TrackProgress />
      <Playlist />
      <Controls />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7D9A9' // Reverted background color
  },
  headerContainer: {
    backgroundColor: '#407332',
    paddingVertical: 17,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // To space out items evenly
  },
  goBackButton: {
    width: 30,
    height: 30,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FEF9F3',
    textAlign: 'center',
    flex: 1,
    marginRight: 35,
  },
  playlistContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  playlist: {
    width: '100%'
  },
  playlistItem: {
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 4,
    color: '#FFF', // White text color
    textAlign: 'center'
  },
  trackProgressContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  trackProgressText: {
    fontSize: 24,
    color: '#FFF' // White text color
  },
  slider: {
    width: 300,
    height: 40,
    marginTop: 10
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20
  },
  controlIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10
  },
  songTitle: {
    fontSize: 32,
    marginTop: 20,
    color: '#FFF', // White text color
    textAlign: 'center'
  },
  artistName: {
    fontSize: 24,
    color: '#FFF', // White text color
    textAlign: 'center'
  },
  vinylImage: {
    width: 100,
    height: 100,
    marginVertical: 20
  }
});

export default Music2;

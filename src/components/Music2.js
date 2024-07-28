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
  const [currentTrackInfo, setCurrentTrackInfo] = useState({});
  const navigation = useNavigation(); // For navigation
  
  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }
      setIsPlayerReady(isSetup);
      setTrackInfo(); // Lấy thông tin bài nhạc hiện tại khi khởi động
    }
    setup();
  }, []);

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.state === State.PlaybackTrackChanged) {
      setTrackInfo(); // Cập nhật thông tin bài nhạc hiện tại khi thay đổi
    }
  });

  async function setTrackInfo() {
    const trackId = await TrackPlayer.getCurrentTrack();
    const track = await TrackPlayer.getTrack(trackId);
    setCurrentTrackInfo(track);
  }

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

    function PlaylistItem({ index, title, artist, artwork, isCurrent }) {
      async function handleItemPress() {
        await TrackPlayer.skip(index);
        setTrackInfo(); // Cập nhật thông tin bài nhạc hiện tại khi chọn bài nhạc
      }

      return (
        <TouchableOpacity onPress={handleItemPress} style={styles.playlistItemContainer}>
          {artwork ? (
            <Image source={{ uri: artwork }} style={styles.artwork} />
          ) : (
            <View style={styles.artworkPlaceholder} />
          )}
          <View style={styles.textContainer}>
            <Text
              style={{
                ...styles.playlistItemTitle,
                color: isCurrent ? '#407332' : '#FFF'
              }}>
              {title}
            </Text>
            <Text style={styles.playlistItemArtist}>{artist}</Text>
          </View>
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
              artist={item.artist}
              artwork={item.artwork}
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
    return (
      <View style={styles.header}>
        <Text style={styles.songTitle}>{currentTrackInfo.title}</Text>
        {/* <Text style={styles.artistName}>{currentTrackInfo.artist}</Text> */}
        {currentTrackInfo.artwork && (
          <Image source={{ uri: currentTrackInfo.artwork }} style={styles.headerArtwork} />
        )}
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
    backgroundColor: '#D7D9A9',
  },
  headerContainer: {
    backgroundColor: '#407332',
    paddingVertical: 17,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingHorizontal: 20,
  },
  playlistItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  artwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  artworkPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#555',
    borderRadius: 8,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  playlistItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  playlistItemArtist: {
    fontSize: 14,
    color: '#AAA',
  },
  trackProgressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  trackProgressText: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  slider: {
    width: 300,
    height: 40,
    marginTop: 10,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  controlIcon: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  songTitle: {
    fontSize: 30,
    marginTop: 10,
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  artistName: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
  },
  headerArtwork: {
    width: 220,
    height: 220,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default Music2;

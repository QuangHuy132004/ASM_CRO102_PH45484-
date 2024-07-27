import TrackPlayer, {
    AppKilledPlaybackBehavior,
    Capability,
    RepeatMode,
    Event
} from 'react-native-track-player';

export async function setupPlayer() {
    let isSetup = false;
    try {
        await TrackPlayer.getCurrentTrack();
        isSetup = true;
    }
    catch {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.updateOptions({
            android: {
                appKilledPlaybackBehavior:
                    AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
            },
            capabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
                Capability.SkipToPrevious,
                Capability.SeekTo,
            ],
            compactCapabilities: [
                Capability.Play,
                Capability.Pause,
                Capability.SkipToNext,
            ],
            progressUpdateEventInterval: 2,
        });
        isSetup = true;
    }
    finally {
        return isSetup;
    }
}

export async function addTracks() {
    await TrackPlayer.add([
        {
            id: '1',
            url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3',
            title: 'Password Infinity',
            artist: 'zezo.dev',
        },
        {
            id: '2',
            url: 'https://www.w3schools.com/tags/horse.mp3',
            title: 'horse',
            artist: 'zezo.dev',
        },
        {
            id: '3',
            url: 'https://vnno-pt-6-tf-a128-z3.zmdcdn.me/bd690ffac6989d613740d68b4221f873?authen=exp=1722256528~acl=/bd690ffac6989d613740d68b4221f873/*~hmac=f7b2f29bf100bf8426cfe4f52541c7ad',
            title: 'Từng Quen',
            artist: 'zezo.dev',
        },
        {
            id: '4',
            url: 'https://vnno-pt-5-tf-a128-z3.zmdcdn.me/4849fd84fc54e2d7118869b01f282b93?authen=exp=1722256949~acl=/4849fd84fc54e2d7118869b01f282b93/*~hmac=5a55e958cdad7612ad42e124af770fa0',
            title: 'Đưa Em Về Nhà',
            artist: 'zezo.dev',
        },
    ]);
    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}

export async function playbackService() {
    // Các sự kiện điều khiển từ notification
    TrackPlayer.addEventListener(Event.RemotePause, () => {
        TrackPlayer.pause();
    });
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        TrackPlayer.play();
    });
    TrackPlayer.addEventListener(Event.RemoteNext, () => {
        TrackPlayer.skipToNext();
    });
    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        TrackPlayer.skipToPrevious();
    });
}

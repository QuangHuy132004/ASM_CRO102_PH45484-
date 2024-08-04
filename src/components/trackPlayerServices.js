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
            url: 'https://a128-z3.zmdcdn.me/df6209f36ebabfe13893dce7ffd4deb0?authen=exp=1722802395~acl=/df6209f36ebabfe13893dce7ffd4deb0/*~hmac=2a18df8a1fbcf3e59edc4f17511c9575',
            title: 'Vết Mưa Piano',
            artist: 'Vũ Cát Tường',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w165_r1x1_jpeg/covers/f/c/fc2a6e7c36cda413dae3f9477a2aa95a_1419349898.jpg',
        },
        {
            id: '2',
            url: 'https://a128-z3.zmdcdn.me/76d469e469431f62e3a6d7fc2ff27f99?authen=exp=1722801993~acl=/76d469e469431f62e3a6d7fc2ff27f99/*~hmac=cdcc294e45b6cc565d1acbc3204966ad',
            title: 'Yên Bình Có Quá Đắt Không',
            artist: 'Khiem',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/a/b/b/eabb2337a1df645e56b586d6cffc29d5.jpg',
        },
        {
            id: '3',
            url: 'https://a128-z3.zmdcdn.me/bd690ffac6989d613740d68b4221f873?authen=exp=1722802441~acl=/bd690ffac6989d613740d68b4221f873/*~hmac=20962f995462f206dd7f0a1219e5cba1',
            title: 'Từng Quen',
            artist: 'Wren Evans',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/9/7/4/c/974c4f42b6143c56af330323d86a0b7f.jpg',
        },
        {
            id: '4',
            url: 'https://a128-z3.zmdcdn.me/4849fd84fc54e2d7118869b01f282b93?authen=exp=1722802653~acl=/4849fd84fc54e2d7118869b01f282b93/*~hmac=da35fd8dc8b387ae78666bcfae577412',
            title: 'Đưa Em Về Nhà',
            artist: 'GRET D x CHILLIES',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/4/e/f/c/4efc45625390dc2019ae941edb572b00.jpg',
        },
        {
            id: '5',
            url: 'https://a128-z3.zmdcdn.me/a4b71594c6fbb79d092b99381bbc9230?authen=exp=1722802679~acl=/a4b71594c6fbb79d092b99381bbc9230/*~hmac=9105dc2620f333d876c04a0f6eba542a',
            title: 'Yêu Từ Đâu Mà Ra',
            artist: 'Lil Zpoet',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w165_r1x1_jpeg/cover/1/1/a/6/11a6395562d2eb6e9500d079f8975f32.jpg',
        },
        {
            id: '6',
            url: 'https://a128-z3.zmdcdn.me/25530103b6eac8788450527ee37abf57?authen=exp=1722802708~acl=/25530103b6eac8788450527ee37abf57/*~hmac=67b4d27c48d55390b1cb1d78c50072a6',
            title: 'Bánh Mì Không',
            artist: 'Đạt G',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w165_r1x1_jpeg/cover/2/9/0/6/2906681d4b764cd4677342b66813f25d.jpg',
        },
        {
            id: '7',
            url: 'https://a128-z3.zmdcdn.me/945f3ce83dd0eb820aa0e05cce267c5b?authen=exp=1722802505~acl=/945f3ce83dd0eb820aa0e05cce267c5b/*~hmac=d5a390b4f6a7a46f7428ed164ad61853',
            title: 'Thủy Triều',
            artist: 'Quang Hùng MasterD',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/8/4/7/4/8474eb9fd1a3aa78b974b4c104ff45fc.jpg',
        },
        {
            id: '8',
            url: 'https://a128-z3.zmdcdn.me/350d55e66574dd01f538bfbdf2592457?authen=exp=1722802504~acl=/350d55e66574dd01f538bfbdf2592457/*~hmac=3c958f535e7b6534abb4188c2d087775',
            title: 'Cẩm Tú Cầu',
            artist: 'Hương Ly',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/6/5/c/5/65c525a2b1cb1afa037a19fa35048eca.jpg',
        },
        {
            id: '9',
            url: 'https://a128-z3.zmdcdn.me/759917ed7b67e5e26765e89f46f5cc41?authen=exp=1722802778~acl=/759917ed7b67e5e26765e89f46f5cc41/*~hmac=fce74f7641c5e05290ef3a20f900135c',
            title: 'Chịu Cách Mình Nói Thua',
            artist: 'BAN, Coolkid, và Quang Anh',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/e/3/d/5/e3d541870421859d108f5f982642bd36.jpg',
        },
        {
            id: '10',
            url: 'https://a128-z3.zmdcdn.me/a3840e9bba29ac36e6a1c793b345d1e7?authen=exp=1722802806~acl=/a3840e9bba29ac36e6a1c793b345d1e7/*~hmac=cbecfa963cb15f65d3f15043712fa731',
            title: 'Dân Chơi Thì Sao Phải Khóc',
            artist: 'Andree Right Hand, Quang Anh, và Wokeup',
            artwork: 'https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_jpeg/cover/7/1/b/9/71b955cff065c904f0955d93a2925a83.jpg',
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

import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios"; // thêm axios để fetch dữ liệu

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [track, setTrack] = useState(null);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Thay URL backend đúng đây
  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    const fetchData = () => {
      axios.get(`${API_BASE_URL}/api/album/list`)
        .then((response) => {
          setAlbums(response.data);
        })
        .catch((error) => {
          console.warn("Không kết nối được server album, dùng mock data.");
          setAlbums(mockAlbums);
        });

      axios.get(`${API_BASE_URL}/api/song/list`)
        .then((response) => {
          const enrichedSongs = response.data.map((song, i) => ({
            ...song,
            createdAt: song.createdAt || new Date(Date.now() - i * 86400000).toISOString(),
          }));
          setSongs(enrichedSongs);
          setTrack(enrichedSongs[0]);
        })
        .catch((error) => {
          console.warn("Không kết nối được server song, dùng mock data.");
          const enrichedMockSongs = mockSongs.map((song, i) => ({
            ...song,
            createdAt: song.createdAt || new Date(Date.now() - i * 86400000).toISOString(),
          }));
          setSongs(enrichedMockSongs);
          setTrack(enrichedMockSongs[0]);
        });
    };

    fetchData();
  }, []);

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = (id) => {
    const song = songs.find((s) => s._id === id);
    if (song) setTrack(song);
  };

  const previous = () => {
    const index = songs.findIndex((s) => s._id === track?._id);
    if (index > 0) setTrack(songs[index - 1]);
  };

  const next = () => {
    const index = songs.findIndex((s) => s._id === track?._id);
    if (index < songs.length - 1) setTrack(songs[index + 1]);
  };

  const seekSong = (e) => {
    const percent = e.nativeEvent.offsetX / seekBg.current.offsetWidth;
    audioRef.current.currentTime = percent * audioRef.current.duration;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    audio.src = track.file;
    audio.load();

    const onCanPlay = () => {
      audio.play().catch((err) => console.warn("Playback error:", err));
      setPlayStatus(true);
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        seekBar.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        setTime({
          currentTime: {
            second: Math.floor(audio.currentTime % 60),
            minute: Math.floor(audio.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audio.duration % 60),
            minute: Math.floor(audio.duration / 60),
          },
        });
      }
    };

    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [track]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    albums,
    songs,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      <audio ref={audioRef} />
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;

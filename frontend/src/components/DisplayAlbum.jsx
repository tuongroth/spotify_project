import React, { useContext } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayContext';
import { formatDistanceToNow } from 'date-fns';
import { assets } from '../assets/assets';

const formatDateAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date received:", dateStr);
    return '';
  }
  return formatDistanceToNow(date, { addSuffix: true });
};

const getTotalDuration = (songs = []) => {
  const totalSeconds = songs.reduce((sum, song) => sum + (song.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours > 0 ? `${hours} hr ` : ''}${minutes} min`;
};

const DisplayAlbum = () => {
  const { id } = useParams();
  const { albums, songs, setTrack } = useContext(PlayerContext);

  const album = albums.find((album) => String(album._id) === id);
  if (!album) return <p>Album not found</p>;

  console.log("DisplayAlbum component loaded");
  // Lọc bài hát thuộc album này
  const albumSongs = songs.filter((song) => song.album === album._id);

  // Format likes, fallback 0 nếu undefined
  const likesCount = album.likes ?? 0;
  const formattedLikes = Number(likesCount).toLocaleString() || 'N/A';

  return (
    <>
      <Navbar />
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={album.image} alt={album.name} />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">{album.name}</h2>
          <h4>{album.desc}</h4>
          <p className="mt-1">
  <img
    className="inline-block w-5"
    src={assets.spotify_logo}
    alt="Spotify Logo"
  />{' '}
  <b>Spotify</b> ·  1,323,154 likes  · <b>{albumSongs.length}</b> songs, about 2 hr 30 min
</p>

        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 px-2 text-[#a7a7a7]">
        <p><b className="mr-4">#</b>Title</p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <img className="m-auto w-4"  src={assets.clock_icon} alt="Duration Icon" />
      </div>
      <hr />
      {albumSongs.map((item, index) => (
        <div
          key={item._id || index}
          onClick={() => setTrack(item)}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
        >
          <p className="text-white">
            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
            <img className="inline w-10 mr-5" src={item.image} alt={item.name} />
            {item.name}
          </p>
          <p className="text-[15px]">{album.name}</p>
          <p className="text-[15px] hidden sm:block">{formatDateAgo(item.createdAt)}</p>
          <p className="text-[15px] text-center">{item.duration}</p>
        </div>
      ))}
    </>
  );
};

export default DisplayAlbum;
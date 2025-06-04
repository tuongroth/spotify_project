import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

import SongItem from './SongItem';
import AlbumItem from './AlbumItem';

const DisplayHome = () => {
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    // Fetch albums
    axios.get("http://localhost:4000/api/album/list")
      .then(res => {
        setAlbums(res.data);
      })
      .catch(err => {
        console.warn("Không lấy được albums từ server, có thể fallback sang mock nếu cần");
      });

    // Fetch songs
    axios.get("http://localhost:4000/api/song/list")
      .then(res => {
        setSongs(res.data);
      })
      .catch(err => {
        console.warn("Không lấy được songs từ server, có thể fallback sang mock nếu cần");
      });
  }, []);

  return (
    <>
      <Navbar />

      <div className="mb-4">
        <h1 className="my-5 font-bold text-2xl">Featured Albums</h1>
        <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
          {albums.map((item) => (
            <AlbumItem
              key={item._id || item.id}
              id={item._id || item.id}
              image={item.image}
              name={item.name}
              desc={item.desc}
            />
          ))}
        </div>
      </div>

      <div className="my-4">
        <h1 className="my-5 font-bold text-2xl">Today's biggest hits</h1>
        <div className="flex overflow-x-auto pl-4 space-x-4 scrollbar-hide">
          {songs.map((item) => (
            <SongItem
              key={item._id || item.id}
              id={item._id || item.id}
              name={item.name}
              desc={item.desc}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default DisplayHome;

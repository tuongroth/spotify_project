import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import DisplayHome from './DisplayHome';
import DisplayAlbum from './DisplayAlbum';

const Display = () => {
  const [albums, setAlbums] = useState([]);
  const displayRef = useRef();
  const location = useLocation();

  // Fetch albums từ backend API
  useEffect(() => {
    fetch('http://localhost:4000/api/album/list')
      .then(res => res.json())
      .then(data => setAlbums(data))
      .catch(err => console.error('Lỗi lấy albums:', err));
  }, []);

  const isAlbum = location.pathname.includes("album");
  const albumId = isAlbum ? location.pathname.split("/").pop() : null;

  // Giả sử backend trả album có trường bgColor
  const album = albums.find(a => a._id === albumId);
  const bgColour = album?.bgColour;

  useEffect(() => {
    if (displayRef.current) {
      if (isAlbum && bgColour) {
        displayRef.current.style.background = `linear-gradient(${bgColour}, #121212)`;
      } else {
        displayRef.current.style.background = '#121212';
      }
    }
  }, [location.pathname, bgColour, isAlbum]);

  return (
    <div
      ref={displayRef}
      className='w-[100%] m-2 px-6 rounded text-white overflow-auto lg:w-[75%] lg:ml-0'
    >
      <Routes>
        <Route path='/' element={<DisplayHome />} />
        <Route path='/album/:id' element={<DisplayAlbum />} />
      </Routes>
    </div>
  );
};

export default Display;

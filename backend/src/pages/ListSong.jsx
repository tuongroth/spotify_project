import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';

const ListSong = () => {
  const [data, setData] = useState([]);
  const [albumData, setAlbumData] = useState([]);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setData(response.data);
    } catch (error) {
      console.error("❌ Error fetching songs:", error);
      toast.error("Failed to fetch songs");
    }
  };

  const fetchAlbums = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (Array.isArray(response.data)) {
        setAlbumData(response.data);
      } else if (response.data.success) {
        setAlbumData(response.data.albums || []);
      } else {
        toast.error("Unable to load albums data");
      }
    } catch (error) {
      console.error("❌ Error fetching albums:", error);
      toast.error("Error occurred while fetching albums");
    }
  };

  const removeSong = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/song/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        await fetchSongs();
      }
    } catch (error) {
      toast.error("Error removing song");
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return '--:--';

    // Nếu duration là string, convert về số (giả sử duration là số giây)
    const totalSec = typeof duration === 'string' ? parseInt(duration, 10) : duration;
    if (isNaN(totalSec)) return '--:--';

    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const getAlbumName = (albumId) => {
    if (!albumId || albumId === 'none') return 'No Album';
    const album = albumData.find(a => a._id === albumId);
    return album ? album.name : 'Unknown Album';
  };

  const formatDateAgo = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return formatDistanceToNow(date, { addSuffix: true });
  };

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, []);

  const sortedData = [...data].sort((a, b) =>
    a.name?.trim().toLowerCase().localeCompare(b.name?.trim().toLowerCase())
  );

  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div className='sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100'>
        <b>Image</b>
        <b>Name</b>
        <b>Album</b>
        <b>Duration</b>
        <b>Date Added</b> {/* Cột ngày tạo */}
        <b>Action</b>
      </div>

      {sortedData.map((item, index) => (
        <div
          key={index}
          className='grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.5fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5'
        >
          <img className='w-12' src={item.image} alt={item.name} />
          <p>{item.name?.trim()}</p>
          <p>{getAlbumName(item.album)}</p>
          <p>{formatDuration(item.duration)}</p>
          <p>{formatDateAgo(item.createdAt)}</p> {/* Hiển thị ngày tạo */}
          <button
            onClick={() => removeSong(item._id)}
            className='text-red-500 hover:underline'
          >
            ✖
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListSong;

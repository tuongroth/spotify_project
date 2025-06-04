import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayContext'; // chỉnh lại path nếu cần
import { useNavigate } from 'react-router-dom';

const AlbumItem = ({ image, name, desc, id }) => {
 const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/album/${id}`)}
      className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff0a]'
    >
      <img className='rounded' src={image} alt={name} />
      <p className='font-bold mt-2 mb-1'>{name}</p>
      <p className='text-slate-200 text-sm'>{desc}</p>
    </div>
  );
};

export default AlbumItem;

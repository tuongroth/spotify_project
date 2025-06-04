import React from 'react';
import { assets } from '../assets/assets';


const Sidebar = () => {


  
  return (
    <div className='w-[25%] h-full p-2 flex-col gap-2 text-white hidden lg:flex'>
    <div className='bg-[#121212] h-[15%] rounded flex flex-col justify-around'>
        <div onClick={()=>navigate('/')} className='flex items-center gap-3 pl-8 cursor-pointer'>
          <img src={assets.home_icon} alt="" className='w-6' />
          <p className='text-white font-semibold'>Home</p>
        </div>
      
      <div className='flex items-center gap-3 pl-8 cursor-pointer'>
        <img src={assets.search_icon} alt="" className='w-6' />
        <p className='text-white font-semibold'>Search</p>
      </div>
      </div>
      <div className='bg-[#121212] h-[85%] rounded'>
        <div className='p-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <img src={assets.stack_icon } alt="" className='w-8' />
          <p className='text-white font-semibold'>Your Library</p>
        </div>

        <div className='flex items-center gap-3'>
          <img className='w-5' src={assets.arrow_icon} alt="" />
          <img className='w-5' src={assets.plus_icon} alt="" /></div>
      </div>

          <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start text-white'>
        <h1 className='text-lg mb-1'>Create your first playlist</h1> 
        <p className='font-light text-sm'>It's easy, we’ll help you.</p>
        <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>
          Create Playlist
        </button> </div>
        <div className='p-4 bg-[#242424] m-2 rounded font-semibold flex flex-col items-start justify-start text-white'>
        <h1 className='text-lg mb-1'>Let's find podcasts to follow</h1> 
        <p className='font-light text-sm'>We'll keep you updated with new content.</p>
        <button className='px-4 py-1.5 bg-white text-[15px] text-black rounded-full mt-4'>
          Browse Podcasts
        </button> </div>
        
      
      </div></div>
      
  );
};

export default Sidebar;

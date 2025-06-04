import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { PlayerContext } from '../context/PlayContext'

const Player = () => {
  const {
    track, seekBg, seekBar, playStatus, play, pause, time,
    previous, next, seekSong
  } = useContext(PlayerContext)

  // Bảo vệ: Nếu dữ liệu chưa sẵn sàng, không render
  if (!track || !time?.currentTime || !time?.totalTime) {
    return <div className="text-white p-4">Loading player...</div>
  }

  return (
    <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
      {/* Left Track Info */}
      <div className='hidden lg:flex items-center gap-4'>
        <img className='w-12' src={track.image} alt="track" />
        <div>
          <p>{track.name}</p>
          <p>{track.desc?.slice(0, 12)}</p>
        </div>
      </div>

      {/* Center Controls */}
      <div className='flex flex-col items-center gap-1 m-auto'>
        <div className='flex gap-4'>
          <img className='w-4 cursor-pointer' src={assets.shuffle_icon} alt="Shuffle" />
          <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt="Previous" />

          {playStatus ? (
            <img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt="Pause" />
          ) : (
            <img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt="Play" />
          )}

          <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt="Next" />
          <img className='w-4 cursor-pointer' src={assets.loop_icon} alt="Loop" />
        </div>

        {/* Progress Bar */}
        <div className='flex items-center gap-5'>
          <p>{time.currentTime.minute}:{String(time.currentTime.second).padStart(2, '0')}</p>
          <div
            ref={seekBg}
            onClick={seekSong}
            className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'
          >
            <hr
              ref={seekBar}
              className='h-1 border-none w-0 bg-green-800 rounded-full'
            />
          </div>
          <p>{time.totalTime.minute}:{String(time.totalTime.second).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Right Icons */}
      <div className='hidden lg:flex items-center gap-2 opacity-75'>
        <img className='w-4' src={assets.plays_icon} alt="Plays" />
        <img className='w-4' src={assets.mic_icon} alt="Mic" />
        <img className='w-4' src={assets.queue_icon} alt="Queue" />
        <img className='w-4' src={assets.volume_icon} alt="Volume" />
        <div className='w-20 bg-slate-50 h-1 rounded' />
      </div>
    </div>
  )
}

export default Player

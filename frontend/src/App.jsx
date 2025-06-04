import React, { useContext } from 'react'
import Sidebar from './components/Sidebar'
import Player from './components/Player'
import Display from './components/Display'
import { PlayerContext } from './context/PlayContext'

const App = () => {
  const { audioRef, track } = useContext(PlayerContext)

  return (
    <div className='h-screen bg-black'>
      <div className='h-[90%] flex'>
        <Sidebar />
        <Display />
      </div>
      <div>
        <Player />
        {track && <audio ref={audioRef} src={track.file} preload="auto" />}
      </div>
    </div>
  )
}

export default App

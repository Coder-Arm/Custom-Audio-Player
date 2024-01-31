
import audioObj from '../utils/audioObj'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { useEffect, useRef, useState } from 'react';
import Slider from '@mui/material/Slider';

const AudioPlayer = () => {
    const [currIdx,setCurrIdx] = useState(0)
    const[isPlaying,setIsPlaying] = useState(false);
    const [currentTime,setCurrentTime] = useState(0);
    const [duration,setDuration] = useState(1);
    const[isMute,setIsMute] = useState(false);
   const audioRef = useRef();

    useEffect(() => {
        if(!isPlaying) audioRef.current.pause();
        else audioRef.current.play(); 
    },[currIdx])

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === ' ') {
          handlePlayPause();
        }
        else if(event.key === 'm'){
          handleVolume()
        }
        else if(event.key === 'ArrowLeft'){
          handlePrev()
        }
        else if(event.key === 'ArrowRight'){
          handleNext()
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [handlePlayPause,handleVolume,handlePrev,handleNext]);

    useEffect(() => {
       const audio = audioRef.current;

       audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
        });
       audio.addEventListener('timeupdate',handleUpdate);
       audio.addEventListener('ended',handleEnd)

       return () => {
        audio.removeEventListener('timeupdate',handleUpdate);
        audio.removeEventListener('ended',handleEnd)
       }
    },[])


  function handleUpdate(){
    setCurrentTime(audioRef.current.currentTime) 
  }

  function handleEnd(){
    setCurrIdx(currIdx+1);
    setCurrentTime(0)
  }
    
  function handleSliderChange(e){
     audioRef.current.currentTime = parseInt(e.target.value);
     setCurrentTime(parseInt(e.target.value))
  }

  function handlePlayPause(){
    if(isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  } 
  function handlePrev(){
    if(currIdx === 0){
        setCurrIdx(audioObj.length-1)
    }
    else setCurrIdx(currIdx-1)
  }

  function handleNext(){
    if(currIdx === audioObj.length-1){
        setCurrIdx(0)
        setCurrentTime(0)
    }
    else {
        setCurrIdx(currIdx+1)
        setCurrentTime(0)
    }
  }

  function handleVolume(){
    if(isMute) audioRef.current.volume = 1;
    else audioRef.current.volume = 0;
    setIsMute(!isMute)
  }

   
  function timeFormatter(time){ 
    const totalMins = Math.floor(time/60)
     const min = totalMins < 10 ? `0${totalMins}` : `${totalMins}`;
     const totalSecs = Math.floor(time%60)
     const secs =totalSecs < 10 ? `0${totalSecs}` : `${totalSecs}`;
     return min + " : " + secs;
  }
    
  return (
    <>
    <img className='fixed top-0 left-0 z-[-100] w-[100%] h-[100%] object-cover blur-md' src={audioObj[currIdx].imgSrc} alt='music-pic'/>
    
    <div className="w-[300px] h-[420px] shadow-xl rounded-md flex flex-col p-6 bg-blue-200 gap-2">
    
    <img className='rounded-md h-[62%] object-cover' src={audioObj[currIdx].imgSrc} alt="music-pic"/>
    <div className='flex justify-between'>
    <h1 className='text-lg'>{audioObj[currIdx].name}</h1>
    <span onClick={handleVolume} className='cursor-pointer hover:bg-blue-400 rounded-full'>{!isMute ? <VolumeUpIcon/> : <VolumeOffIcon/>}</span>
    </div>
    <Slider
        defaultValue={currentTime}
        value={currentTime}
        max={duration}
        onChange={handleSliderChange}
      />
     <audio src={audioObj[currIdx].audioSrc} ref={audioRef}/>
     <div className='flex justify-between mt-[-10px]'>
        <span>{timeFormatter(currentTime)}</span>
        <span>{timeFormatter(duration)}</span>
     </div>
     <div className='flex gap-8 justify-center items-center'>
        <span onClick={handlePrev} className='cursor-pointer hover:bg-blue-400 rounded-full'><SkipPreviousIcon style={{fontSize : '2.5rem'}}/></span>

        <span className='cursor-pointer hover:bg-blue-400 rounded-full' 
        onClick={handlePlayPause}>{isPlaying ? <PauseCircleOutlineIcon style={{fontSize : '2.5rem'}}/> : <PlayCircleOutlineIcon style={{fontSize : '2.5rem'}}/>}</span>

        <span onClick={handleNext} className='cursor-pointer hover:bg-blue-400 rounded-full'><SkipNextIcon style={{fontSize : '2.5rem'}}/></span>
        
    </div>
    </div>
    </>
  )
}

export default AudioPlayer

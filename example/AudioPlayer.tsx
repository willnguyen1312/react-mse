import React, { FC } from 'react';
import { Audio, useMediaContext } from '../';

export const AudioPlayer = () => {
  const {
    setPaused,
    paused,
    playbackRate,
    duration,
    isLoading,
    currentTime,
    volume,
    setPlaybackRate,
    setVolume,
    setCurrentBirateIndex,
    bitrates,
  } = useMediaContext();

  const togglePlay = () => setPaused(!paused);

  const changePlaybackRate = () => {
    playbackRate === 1 ? setPlaybackRate(2) : setPlaybackRate(1);
  };

  const changeVolume = () => {
    volume === 1 ? setVolume(0) : setVolume(1);
  };

  return (
    <>
      <h1>Hello Audio</h1>
      <Audio controls />
      <button onClick={togglePlay}>{paused ? 'Play' : 'Pause'}</button>
      <p>{`PlaybackRate: ${playbackRate}`}</p>
      <p>{!!duration && `Duration ${duration}`}</p>
      <button onClick={changePlaybackRate}>Change playbackRate</button>
      <button onClick={changeVolume}>Change volume</button>
      <p>{isLoading && 'Loading'}</p>
      <p>{`Volume: ${volume}`}</p>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setCurrentBirateIndex()}>Auto</button>
        {bitrates.map((bitrateInfo, index) => (
          <button key={index} onClick={() => setCurrentBirateIndex(index)}>
            {`${Math.round(bitrateInfo.bitrate / 1024)} kbp`}
          </button>
        ))}
      </div>
      <p>{currentTime}</p>
    </>
  );
};

import React, { useCallback, FC } from 'react';
import { useMediaContext, Video } from '..';

export const VideoPlayer = ({}) => {
  const {
    paused,
    playbackRate,
    duration,
    isLoading,
    currentTime,
    volume,
    muted,
    bitrates,
    setCurrentBirateIndex,
    setCurrentTime,
    setPlaybackRate,
    setPaused,
    setMuted,
    buffered,
  } = useMediaContext();

  const togglePlay = () => setPaused(!paused);
  const toggleMuted = () => setMuted(!muted);

  const changePlaybackRate = () => {
    playbackRate === 1 ? setPlaybackRate(2) : setPlaybackRate(1);
  };

  return (
    <>
      <h1>{`Hello Video ${isLoading ? 'Loading' : ''}`}</h1>
      <Video
        controls
        style={{
          margin: 'left',
          height: 400,
          display: 'block',
        }}
      />
      <button onClick={togglePlay}>{paused ? 'Play' : 'Pause'}</button>
      <button onClick={changePlaybackRate}>Change playbackRate</button>
      <button onClick={toggleMuted}>Toggle muted</button>
      <p>{`PlaybackRate: ${playbackRate}`}</p>
      <p>{!!duration && `Duration ${duration}`}</p>
      <p>{`Volume: ${volume}`}</p>
      <p>{`Muted: ${muted}`}</p>
      <p>{`Current time: ${currentTime}`}</p>
      <p>Resolution</p>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setCurrentBirateIndex()}>Auto</button>
        {bitrates.map((bitrateInfo, index) => (
          <button key={index} onClick={() => setCurrentBirateIndex(index)}>
            {bitrateInfo.height}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <button onClick={() => setCurrentTime(currentTime - 3)}>
          Prev 3 secconds
        </button>
        <button onClick={() => setCurrentTime(currentTime + 3)}>
          Next 3 secconds
        </button>
      </div>
      <p>Buffered Ranges:</p>
      {buffered &&
        buffered.length > 0 &&
        (() => {
          const timeRanges = Array.from(
            { length: buffered.length },
            (_, index) => {
              return [buffered.start(index), buffered.end(index)];
            }
          );

          return timeRanges.map(timeRange => JSON.stringify(timeRange));
        })()}
    </>
  );
};

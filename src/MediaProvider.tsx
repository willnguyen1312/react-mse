import React, { useEffect, useRef, useState, FC } from 'react';
import { MediaContext } from './MediaContext';
import { convertTimeRangesToSeconds } from './utils';
import { DEFAULT_AUTO_BITRATE } from './constants';
import { Rotate, BitrateInfo, MSEImplementor } from './types';
import { createMseInstance } from './MSE';

interface MediaProviderProps {
  mediaSource?: string;
}

export const MediaProvider: FC<MediaProviderProps> = ({
  children,
  mediaSource,
}) => {
  const _isPlayingRef = useRef<boolean>(false);
  const _mediaElementRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const _mseRef = useRef<MSEImplementor>(null) as React.MutableRefObject<
    MSEImplementor
  >;
  const [bitrates, updateBitrates] = useState<BitrateInfo[]>([]);
  const [currentBirateIndex, updateCurrentBirateIndex] = useState(
    DEFAULT_AUTO_BITRATE
  );
  const [buffered, updateBuffered] = useState<TimeRanges | null>(null);
  const [currentTime, updateCurrentTime] = useState(0);
  const [duration, updateDuration] = useState(0);
  const [ended, updateEnded] = useState(false);
  const [autoBitrateEnabled, setautoBitrateEnabled] = useState(true);
  const [paused, updatePaused] = useState(true);
  const [playbackRate, updatePlaybackRate] = useState(1);
  const [volume, updateVolume] = useState(1);
  const [muted, updateMuted] = useState(false);
  const [rotate, updateRotate] = useState<Rotate>(0);
  const [isLoading, updateIsLoading] = useState(true);
  const [fps, setFps] = useState(0);

  const getMedia = () => {
    const media = _mediaElementRef.current;
    if (!media) {
      throw new Error('media element is not available');
    }
    return media;
  };

  const _getMse = () => {
    const mse = _mseRef.current;
    if (!mse) {
      throw new Error('mse instance is not available');
    }
    return mse;
  };

  const checkMediaHasDataToPlay = () => {
    const media = getMedia();
    const currentTime = media.currentTime;
    const timeRanges = convertTimeRangesToSeconds(media.buffered);

    return timeRanges.some(timeRange => {
      const [start, end] = timeRange;
      return currentTime >= start && currentTime <= end;
    });
  };

  useEffect(() => {
    if (!mediaSource) {
      return;
    }

    const media = getMedia();
    const mseInstance =
      _mseRef.current ||
      createMseInstance({
        media,
        setFps,
        updateBitrates,
        updateCurrentBirateIndex,
      });

    if (!_mseRef.current) _mseRef.current = mseInstance;

    mseInstance.init(mediaSource);

    return () => mseInstance.release();
  }, [mediaSource]);

  const _onSeeking = () => {
    const media = getMedia();
    updateCurrentTime(media.currentTime);
    if (!checkMediaHasDataToPlay()) {
      updateIsLoading(true);
    }
  };

  const _onLoadedMetadata = async () => {
    while (getMedia().duration === Infinity) {
      // Loop until duration is ready
      await new Promise(res => setTimeout(res, 100));
    }

    updateDuration(getMedia().duration);
  };

  const _onRateChange = () => updatePlaybackRate(getMedia().playbackRate);

  const _onVolumeChange = () => {
    const media = getMedia();
    updateMuted(media.muted);
    updateVolume(media.volume);
  };

  const _onPause = () => {
    updatePaused(true);
    _isPlayingRef.current = false;
  };

  const _onPlay = () => {
    updatePaused(false);
    updateEnded(false);
  };

  const _onCanPlay = () => updateIsLoading(false);

  const _onProgress = () => {
    updateIsLoading(false);
    updateBuffered(getMedia().buffered);
  };

  const _onWaiting = () => {
    if (!checkMediaHasDataToPlay()) {
      updateIsLoading(true);
    }
  };

  const _onTimeUpdate = () => updateCurrentTime(getMedia().currentTime);

  const _onEnded = () => updateEnded(true);

  const _onPlaying = () => {
    _isPlayingRef.current = true;
  };

  const setCurrentTime = (currentTime: number) =>
    (getMedia().currentTime = Math.min(
      Math.max(currentTime, 0),
      getMedia().duration
    ));

  const setPlaybackRate = (playbackRate: number) => {
    getMedia().playbackRate = playbackRate;
  };

  const setVolume = (volume: number) => (getMedia().volume = volume);

  const setMuted = (muted: boolean) => (getMedia().muted = muted);

  const setPaused = async (paused: boolean) => {
    updatePaused(paused);
    const media = getMedia();
    if (paused && _isPlayingRef.current) {
      media.pause();
    }

    if (!paused && !_isPlayingRef.current) {
      media.play();
    }
  };

  const setCurrentBirateIndex = (
    bitrateIndex: number = DEFAULT_AUTO_BITRATE
  ) => {
    setautoBitrateEnabled(bitrateIndex === DEFAULT_AUTO_BITRATE);
    updateCurrentBirateIndex(bitrateIndex);
    _getMse().setCurrentBitrateIndex(bitrateIndex);
  };

  const setRotate = (rotate: number) => updateRotate((rotate % 4) as Rotate);
  const media = _mediaElementRef.current;

  return (
    <MediaContext.Provider
      value={{
        _mediaElementRef,
        mediaElement: media,

        // Streaming properties
        fps,
        autoBitrateEnabled,
        bitrates,
        currentBirateIndex,
        setCurrentBirateIndex,

        // Media properties
        currentTime,
        duration,
        ended,
        paused,
        playbackRate,
        volume,
        muted,
        buffered,
        rotate,
        isLoading,

        // Media methods
        setCurrentTime,
        setPlaybackRate,
        setVolume,
        setMuted,
        setPaused,
        setRotate,

        // Media event hanlders
        _onSeeking,
        _onLoadedMetadata,
        _onRateChange,
        _onVolumeChange,
        _onCanPlay,
        _onWaiting,
        _onPause,
        _onPlay,
        _onTimeUpdate,
        _onEnded,
        _onProgress,
        _onPlaying,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};

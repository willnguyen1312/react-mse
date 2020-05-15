import React, { useEffect, useRef, useState, FC } from 'react';
import Hls from 'hls.js';
import { MediaContext } from './MediaContext';
import { convertTimeRangesToSeconds } from './utils';
import { DEFAULT_AUTO_BITRATE } from './constants';
import { Rotate, BitrateInfo } from './types';

interface MediaProviderProps {
  mediaSource?: string;
}

export const MediaProvider: FC<MediaProviderProps> = ({
  children,
  mediaSource,
}) => {
  const _isPlayingRef = useRef<boolean>(false);
  const _mediaElementRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const _hlsRef = useRef<Hls>(null) as React.MutableRefObject<Hls>;
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

  const _getHls = () => {
    const hls = _hlsRef.current;
    if (!hls) {
      throw new Error('HLS instance is not available');
    }
    return hls;
  };

  const releaseHlsResource = () => {
    const hls = _hlsRef.current;
    if (hls) {
      hls.destroy();
    }
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
    releaseHlsResource();

    if (Hls.isSupported()) {
      const newHls = new Hls();
      newHls.attachMedia(media as HTMLVideoElement);
      newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
        newHls.loadSource(mediaSource);
      });

      newHls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const bitrates: BitrateInfo[] = ((data.levels as unknown) as Hls.Level[]).map(
          level => ({
            bitrate: level.bitrate,
            height: level.height,
            width: level.width,
          })
        );

        updateBitrates(bitrates);
      });

      newHls.on(Hls.Events.FRAG_PARSING_DATA, (_, data) => {
        if (data.type === 'video') {
          const fps = data.nb / (data.endPTS - data.startPTS);
          setFps(Math.round(fps));
        }
      });

      newHls.on(Hls.Events.LEVEL_SWITCHED, (_, { level }) => {
        updateCurrentBirateIndex(level);
      });

      _hlsRef.current = newHls;
    } else if (media && media.canPlayType('application/vnd.apple.mpegurl')) {
      // For native support like Apple's safari
      media.src = mediaSource;
    }

    return releaseHlsResource;
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
    const hlsInstance = _getHls();
    if (hlsInstance.currentLevel !== bitrateIndex) {
      hlsInstance.currentLevel = bitrateIndex;
    }
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

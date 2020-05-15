import React, { FC, useEffect, MediaHTMLAttributes } from 'react';

import { _useMediaContext } from '../MediaContext';
import { callAll } from '../utils';

import { MergedEventListeners } from '../types';

interface VideoProps {
  onSwitchedDimensions?: (value: boolean) => void;
}

export const Video: FC<VideoProps & MediaHTMLAttributes<HTMLMediaElement>> = ({
  onSeeking,
  onLoadedMetadata,
  onRateChange,
  onVolumeChange,
  onCanPlay,
  onWaiting,
  onPause,
  onPlay,
  onTimeUpdate,
  onEnded,
  onProgress,
  onPlaying,
  onSwitchedDimensions,
  ...rest
}) => {
  const {
    _mediaElementRef,
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
    rotate,
    isLoading,
  } = _useMediaContext();
  const shouldSwitchDimensions = rotate % 2 === 1;

  useEffect(
    () => onSwitchedDimensions && onSwitchedDimensions(shouldSwitchDimensions),
    [rotate]
  );

  const videoElement = _mediaElementRef.current;

  let scale = 1;

  if (shouldSwitchDimensions && videoElement) {
    const { videoHeight, videoWidth } = videoElement as HTMLVideoElement;
    scale = videoHeight / videoWidth;
  }

  const mergedEventListeners: MergedEventListeners = {
    onSeeking: callAll(_onSeeking, onSeeking),
    onLoadedMetadata: callAll(_onLoadedMetadata, onLoadedMetadata),
    onRateChange: callAll(_onRateChange, onRateChange),
    onVolumeChange: callAll(_onVolumeChange, onVolumeChange),
    onCanPlay: callAll(_onCanPlay, onCanPlay),
    onWaiting: callAll(_onWaiting, onWaiting),
    onPause: callAll(_onPause, onPause),
    onPlay: callAll(_onPlay, onPlay),
    onTimeUpdate: callAll(_onTimeUpdate, onTimeUpdate),
    onEnded: callAll(_onEnded, onEnded),
    onProgress: callAll(_onProgress, onProgress),
    onPlaying: callAll(_onPlaying, onPlaying),
  };

  return (
    <video
      style={{
        transform: `rotate(${rotate / 4}turn) scale(${scale})`,
        height: '100%',
      }}
      ref={_mediaElementRef as React.MutableRefObject<HTMLVideoElement>}
      {...mergedEventListeners}
      {...rest}
    />
  );
};

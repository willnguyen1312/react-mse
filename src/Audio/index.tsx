import React, { FC, MediaHTMLAttributes } from 'react';

import { _useMediaContext } from '../MediaContext';
import { callAll } from '../utils';
import { MergedEventListeners, HTMLMediaElements } from '../types';

export const Audio: FC<MediaHTMLAttributes<HTMLMediaElement>> = ({
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
  } = _useMediaContext();

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

  return <audio {...mergedEventListeners} ref={_mediaElementRef} {...rest} />;
};

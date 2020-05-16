import { SyntheticEvent } from 'react';
import { callAll } from './utils';

export type HTMLMediaElements = HTMLMediaElement | HTMLAudioElement;

export type MediaEventListener = (
  event: SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>
) => void;

type MediaContextInternalEvents =
  | 'onSeeking'
  | 'onLoadedMetadata'
  | 'onRateChange'
  | 'onVolumeChange'
  | 'onCanPlay'
  | 'onWaiting'
  | 'onPause'
  | 'onPlay'
  | 'onTimeUpdate'
  | 'onEnded'
  | 'onProgress'
  | 'onPlaying';
export type MergedEventListeners = Record<
  MediaContextInternalEvents,
  ReturnType<typeof callAll>
>;

export type MediaEventListeners = MediaEventListener | MediaEventListener[];

export interface BitrateInfo {
  bitrate: number;
  width: number;
  height: number;
}

export type Rotate = 0 | 1 | 2 | 3;

export interface MediaContextProps {
  // Media element
  mediaElement: HTMLVideoElement | HTMLAudioElement | null;

  // Streaming properties
  fps: number;
  autoBitrateEnabled: boolean;
  bitrates: BitrateInfo[];
  currentBirateIndex: number;
  setCurrentBirateIndex: (currentBirateIndex?: number) => void;

  // Media properties
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  paused: boolean;
  muted: boolean;
  ended: boolean;
  buffered: TimeRanges | null;
  isLoading: boolean;
  rotate: Rotate;

  // Media control util methods
  setCurrentTime: (currentTime: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
  setVolume: (volume: number) => void;
  setPaused: (paused: boolean) => void;
  setMuted: (muted: boolean) => void;
  setRotate: (rotate: number) => void;
}

export interface MediaContextType extends MediaContextProps {
  // Ref to attach on media
  _mediaElementRef: React.RefObject<HTMLVideoElement | HTMLAudioElement>;

  // Event Listeners
  _onSeeking: MediaEventListener;
  _onLoadedMetadata: MediaEventListener;
  _onRateChange: MediaEventListener;
  _onVolumeChange: MediaEventListener;
  _onCanPlay: MediaEventListener;
  _onWaiting: MediaEventListener;
  _onPause: MediaEventListener;
  _onPlay: MediaEventListener;
  _onTimeUpdate: MediaEventListener;
  _onEnded: MediaEventListener;
  _onProgress: MediaEventListener;
  _onPlaying: MediaEventListener;
}

export interface MediaContextConsumerProps {
  render: (mediaContext: MediaContextProps) => React.ReactNode;
}

export interface MSEImplementorConfig {
  media: HTMLMediaElement;
  updateBitrates: (bitrates: BitrateInfo[]) => void;
  setFps: (value: number) => void;
  updateCurrentBirateIndex: (value: number) => void;
}

export interface MSEImplementor {
  setCurrentBitrateIndex: (value: number) => void;

  config: MSEImplementorConfig;

  init: (mediaSource: string) => void;

  release: () => void;
}

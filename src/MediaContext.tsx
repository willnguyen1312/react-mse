import React, { useContext } from 'react'
import { MediaContextType, MediaContextProps, MediaContextConsumerProps } from './types'

export const MediaContext = React.createContext<MediaContextType | null>(null)

export const _useMediaContext = () => {
  const mediaContext = useContext(MediaContext)

  if (!mediaContext) {
    throw new Error('Please place the component inside MediaContext')
  }

  return mediaContext
}

export const useMediaContext = (): MediaContextProps => {
  const mediaContext = _useMediaContext()

  return {
    // Media properties
    currentTime: mediaContext.currentTime,
    duration: mediaContext.duration,
    ended: mediaContext.ended,
    paused: mediaContext.paused,
    playbackRate: mediaContext.playbackRate,
    volume: mediaContext.volume,
    muted: mediaContext.muted,
    isLoading: mediaContext.isLoading,
    buffered: mediaContext.buffered,
    rotate: mediaContext.rotate,

    // Streaming properties
    fps: mediaContext.fps,
    autoBitrateEnabled: mediaContext.autoBitrateEnabled,
    bitrates: mediaContext.bitrates,
    currentBirateIndex: mediaContext.currentBirateIndex,
    setCurrentBirateIndex: mediaContext.setCurrentBirateIndex,

    // Media properties
    mediaElement: mediaContext.mediaElement,
    setPaused: mediaContext.setPaused,
    setMuted: mediaContext.setMuted,
    setCurrentTime: mediaContext.setCurrentTime,
    setPlaybackRate: mediaContext.setPlaybackRate,
    setVolume: mediaContext.setVolume,
    setRotate: mediaContext.setRotate,
  }
}

export const withMediaContext = <P extends { mediaContext: MediaContextProps }>(Component: React.ComponentType<P>) => (
  props: Omit<P, 'mediaContext'>
) => {
  const mediaContext = useMediaContext()
  return <Component {...(props as P)} mediaContext={mediaContext} />
}

export const MediaConsumer: React.FC<MediaContextConsumerProps> = ({ render }) => {
  const mediaContext = useMediaContext()

  return <>{render(mediaContext)}</>
}

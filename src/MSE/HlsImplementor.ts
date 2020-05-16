import Hls from 'hls.js';

import { MSEImplementorConfig, BitrateInfo, MSEImplementor } from '../types';

export class HlsImplementor implements MSEImplementor {
  config: MSEImplementorConfig;
  _hls: null | Hls = null;

  constructor(config: MSEImplementorConfig) {
    this.config = config;
  }

  getHls = () => {
    if (!this._hls) {
      throw new Error('Hls.js is not available yet');
    }
    return this._hls;
  };

  setCurrentBitrateIndex = (value: number) => {
    const hls = this.getHls();
    if (hls.currentLevel !== value) {
      hls.currentLevel = value;
    }
  };

  init = (mediaSource: string) => {
    const {
      media,
      setFps,
      updateBitrates,
      updateCurrentBirateIndex,
    } = this.config;

    if (media && media.canPlayType('application/vnd.apple.mpegurl')) {
      // For native support like Apple's safari
      media.src = mediaSource;
    } else {
      this._hls = new Hls();

      this._hls.attachMedia(media as HTMLVideoElement);
      this._hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        (this._hls as Hls).loadSource(mediaSource);
      });

      this._hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        const bitrates: BitrateInfo[] = ((data.levels as unknown) as Hls.Level[]).map(
          level => ({
            bitrate: level.bitrate,
            height: level.height,
            width: level.width,
          })
        );

        updateBitrates(bitrates);
      });

      this._hls.on(Hls.Events.FRAG_PARSING_DATA, (_, data) => {
        if (data.type === 'video') {
          const fps = data.nb / (data.endPTS - data.startPTS);
          setFps(Math.round(fps));
        }
      });

      this._hls.on(Hls.Events.LEVEL_SWITCHED, (_, { level }) => {
        updateCurrentBirateIndex(level);
      });
    }
  };

  release = () => this.getHls().destroy();
}

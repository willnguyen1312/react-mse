import { HlsImplementor } from './HlsImplementor';
import { MSEImplementorConfig, MSEImplementor } from '../types';

export const createMseInstance = (
  config: MSEImplementorConfig,
  type: 'hls' | 'dash' = 'hls'
): MSEImplementor => {
  return new HlsImplementor(config);
};

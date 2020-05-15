import { SyntheticEvent } from 'react';

import { MediaEventListener } from './types';

export const callAll = (...fns: (MediaEventListener | undefined)[]) => (
  event: SyntheticEvent<HTMLVideoElement | HTMLAudioElement, Event>
) => {
  const flatFns = flatten<MediaEventListener | undefined>(fns);
  flatFns.forEach(fn => fn && fn(event));
};

const flatten = <T>(arr: T[]): T[] => {
  return arr.reduce((flat, toFlatten) => {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
    );
  }, [] as T[]);
};

export const convertTimeRangesToSeconds = (buffered: TimeRanges) => {
  return Array.from({ length: buffered.length }, (_, index) => [
    Math.round(buffered.start(index)),
    Math.round(buffered.end(index)),
  ]);
};

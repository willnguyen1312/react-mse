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

interface CalculateRelatedCoordinatesArg {
  event: React.PointerEvent<HTMLElement> | PointerEvent;
  element: HTMLElement;
}
export const calculateRelatedCoordinates = ({
  event,
  element,
}: CalculateRelatedCoordinatesArg) => {
  const { left, width } = element.getBoundingClientRect();
  const { clientX } = event;

  let current: number;

  if (clientX < left) {
    current = 0;
  } else if (clientX > left + width) {
    current = width;
  } else {
    current = clientX - left;
  }

  return { x: current };
};

export const convertTimeRangesToSeconds = (buffered: TimeRanges) => {
  return Array.from({ length: buffered.length }, (_, index) => [
    Math.round(buffered.start(index)),
    Math.round(buffered.end(index)),
  ]);
};

// test utils
export const getElement = <K extends keyof HTMLElementTagNameMap>(
  container: HTMLElement,
  element: K
): HTMLElementTagNameMap[K] => {
  const result = container.querySelector(element);
  if (!result) throw new Error(`${element} is not available`);

  return result;
};

/* eslint-disable @typescript-eslint/no-use-before-define */
import { getMilliseconds } from './getMilliseconds';

interface IntervalType {
  iterations: number;
  timeout: number;
}

interface OptionsType {
  intervals: IntervalType[];
  resetAfterMouseMove: boolean;
}

const defaultOptions: OptionsType = {
  intervals: [
    {
      iterations: 6,
      // eslint-disable-next-line @trello/no-module-logic
      timeout: getMilliseconds({ seconds: 10 }),
    },
    {
      iterations: 10,
      // eslint-disable-next-line @trello/no-module-logic
      timeout: getMilliseconds({ minutes: 1 }),
    },
  ],
  resetAfterMouseMove: true,
};

export const decayingInterval = (
  fn: () => void,
  options: OptionsType = defaultOptions,
) => {
  let intervals: number[] = [];
  let idTimeout: number;
  let watchingMouse = false;

  const start = () => {
    cancel();
    intervals = [];

    options.intervals.forEach(({ iterations, timeout }) => {
      Array(iterations)
        .fill(1)
        .forEach(() => {
          intervals.push(timeout);
        });
    });

    nextStep();
  };

  const cancel = () => {
    clearTimeout(idTimeout);
    if (watchingMouse) {
      document.removeEventListener('mousemove', start);
      watchingMouse = false;
    }
  };

  const watchMouse = () => {
    if (options.resetAfterMouseMove && !watchingMouse) {
      document.addEventListener('mousemove', start);
      watchingMouse = true;
    }
  };

  const nextStep = () => {
    let nextInterval;
    if (intervals.length) {
      nextInterval = intervals.shift();
      idTimeout = window.setTimeout(() => {
        fn();

        requestAnimationFrame(nextStep);
      }, nextInterval);

      if (nextInterval && nextInterval > options.intervals[0].timeout) {
        watchMouse();
      }
    } else {
      watchMouse();
    }
  };

  start();

  return cancel;
};

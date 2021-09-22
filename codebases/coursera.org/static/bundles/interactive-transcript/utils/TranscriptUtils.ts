import moment from 'moment';

import Cue from 'bundles/interactive-transcript/models/Cue';
import { LanguageCode } from 'bundles/interactive-transcript/types';

const MAX_TIME_BETWEEN_PARAGRAPHS = 1.0; // A double, in seconds.

const findCueIndexForTimeHelper = (cues: Array<Cue>, start: number, end: number, time: number): number => {
  if (start > end) {
    return -1;
  }

  const midIndex = end - Math.floor((end - start) / 2);

  if (time < cues[midIndex].startTime) {
    return findCueIndexForTimeHelper(cues, start, midIndex - 1, time);
  } else if (midIndex !== cues.length - 1 && time >= cues[midIndex + 1].startTime) {
    return findCueIndexForTimeHelper(cues, midIndex + 1, end, time);
  } else {
    return midIndex;
  }
};

export const findCueIndexForTime = (cues: Array<Cue>, time: number): number => {
  return findCueIndexForTimeHelper(cues, 0, cues.length - 1, time);
};

export const formatTime = (time: number): string => {
  let formatString = 'm:ss';

  const milliseconds = time * 1000;
  const duration = moment.duration(milliseconds);
  const hours = duration.hours();

  if (hours > 0) {
    formatString = 'h:m' + formatString;
  }

  // Timestamp labels are formatted as Latin numerals, colon delimited, even in Arabic
  return moment.utc(milliseconds).locale('en').format(formatString);
};

export const getTimeFromDuration = (time: number) => {
  const milliseconds = time * 1000;
  const duration = moment.duration(milliseconds);
  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();

  return {
    seconds,
    minutes,
    hours,
  };
};

export const buildParagraphs = (cues: Array<Cue>, timeDiff: number = MAX_TIME_BETWEEN_PARAGRAPHS) => {
  const paragraphs: Array<Array<Cue>> = [];

  let paragraph: $TSFixMe;
  let lastCue: $TSFixMe;
  let timeDifference: $TSFixMe;

  cues.forEach((cue) => {
    if (lastCue) {
      timeDifference = cue.startTime - lastCue.endTime;
    }

    if (!paragraph || timeDifference >= timeDiff) {
      paragraph = [];
      paragraphs.push(paragraph);
    }

    paragraph.push(cue);
    lastCue = cue;
  });

  return paragraphs;
};

export const findCuesAroundTime = (cues: Array<Cue>, time: number) => {
  const cueIndex = findCueIndexForTime(cues, time);
  const cue = cues[cueIndex];

  if (!cue) {
    return [];
  }

  return [cue];
};

// @private. exported for testing
// TODO: This is a very naive approach. Handle ambiguity of punctation marks correctly
// See https://en.wikipedia.org/wiki/Sentence_boundary_disambiguation
export const getSentenceCueIndices = (cueIndex: number, cues: Array<Cue>): Array<number> => {
  const cueIndices: Array<number> = [];

  // Look back to find the end of previous sentence
  let previousCueIndex = cueIndex - 1;
  while (previousCueIndex !== -1) {
    const previousCue = cues[previousCueIndex];
    if (previousCue.text[previousCue.text.length - 1] === '.') {
      break;
    }

    cueIndices.unshift(previousCueIndex);
    previousCueIndex -= 1;
  }

  // Look ahead to find the end of next sentence
  let nextCueIndex = cueIndex;
  while (nextCueIndex <= cues.length - 1) {
    const nextCue = cues[nextCueIndex];
    cueIndices.push(nextCueIndex);

    if (nextCue.text[nextCue.text.length - 1] === '.') {
      break;
    }

    nextCueIndex += 1;
  }

  return cueIndices;
};

// @private. exported for testing
export const getAdjancentCueIndices = (cueIndex: number, cueCount: number): Array<number> => {
  const nextIndices: Array<number> = [];
  const previousIndices: Array<number> = [];

  // this method works across all languages and can later be optimized.
  // include two cues on either side of the cueIndex
  if (cueIndex >= 2) {
    previousIndices.push(cueIndex - 2);
  }

  if (cueIndex >= 1) {
    previousIndices.push(cueIndex - 1);
  }

  if (cueIndex < cueCount - 1) {
    nextIndices.push(cueIndex + 1);
  }

  if (cueIndex < cueCount - 2) {
    nextIndices.push(cueIndex + 2);
  }

  return [...previousIndices, cueIndex, ...nextIndices];
};

export const getAdjacentCues = (cues: Array<Cue>, time: number, languageCode: LanguageCode): Array<Cue> => {
  const cueIndex = findCueIndexForTime(cues, time);

  if (cueIndex === -1 && cues.length > 2) {
    return [0, 1, 2].map((index) => cues[index]);
  }

  if (cueIndex < 0 || cueIndex >= cues.length) {
    return [];
  }

  // TODO: Support sentence detection for more languages.
  if (languageCode === 'en') {
    return getSentenceCueIndices(cueIndex, cues).map((index) => cues[index]);
  }

  return getAdjancentCueIndices(cueIndex, cues.length).map((index) => cues[index]);
};

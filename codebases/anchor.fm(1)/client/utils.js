import { COLORS } from 'anchor-server-common/utilities/episode/constants';
import { getInvalidPlacementsForOrderedAudioSet } from 'anchor-server-common/utilities/episode/getInvalidPlacementsForOrderedAudioSet';
import { getBaseUrl, isIOS } from '../helpers/serverRenderingUtils';
import {
  DAY_SECS,
  HR_SECS,
  MONTH_SECS,
  WEEK_SECS,
  YEAR_SECS,
  MIN_SECS,
} from './modules/Date/constants.ts';

export { MAX_FILE_SIZE } from '../helpers/audio/constants';

// TODO (bui): merge these structs
const EDITABLE_AUDIO_TYPES = [
  COLORS.RECORD,
  COLORS.RECORD_WITH_FRIENDS,
  COLORS.CALL_IN,
  COLORS.UPLOAD_FROM_WEB,
  COLORS.DRAFT,
].map(item => item.toLowerCase());

export const isEpisodeAudioEditable = audio =>
  EDITABLE_AUDIO_TYPES.includes(audio.color && audio.color.toLowerCase()) &&
  audio.audioTransformationStatus === 'finished';

export const getIsAudioAdSlot = audio =>
  typeof audio.isAdSlotEnabled !== 'undefined';

export const getIsAdSlotEnabled = audio => audio.isAdSlotEnabled;

export const PODCAST_COLORS = {
  BLACK: {
    colorClass: 'black',
    color: '#282F36',
    colorLight: '#282F36',
    colorDark: '#282F36',
  },
  GRAY: {
    colorClass: 'gray',
    color: '#7f8287',
    colorLight: '#8F9196',
    colorDark: '#55595E',
  },
  LIGHT_GRAY: {
    colorClass: 'lightgray',
    color: '#CCCDCF',
    colorLight: '#d1d2d3',
    colorDark: '#b7b8ba',
  },
  ORANGE: {
    colorClass: 'orange',
    color: COLORS.RECORD,
    colorLight: '#FED1D1',
    colorDark: '#E14040',
  },
  PURPLE: {
    colorClass: 'purple',
    color: '#9458FD',
    colorLight: '#E4D9FA',
    colorDark: '#5000b9',
  },
  BLUE: {
    colorClass: 'blue',
    color: COLORS.MUSIC,
    colorLight: '#C6DDFF',
    colorDark: '#1674FF',
  },
  PINK: {
    colorClass: 'pink',
    color: COLORS.INTERLUDE,
    colorLight: '#F6D4F7',
    colorDark: '#E59ACF',
  },
  CYAN: {
    colorClass: 'cyan',
    color: COLORS.CALL_IN,
    colorLight: '#81E2D1',
    colorDark: '#28BAA1',
  },
  WHITE: {
    colorClass: 'white',
    color: '#FFFFFF',
    colorLight: '#FFFFFF',
    colorDark: '#FFFFFF',
  },
  GREEN: {
    colorClass: 'green',
    color: '#1cee4e',
    colorLight: '#8DF6A6',
    colorDark: '#1cee4e',
  },
};

export const editorPaths = {
  dashboardPath: '/dashboard',
  editEpisodePattern: /\/dashboard\/episode\/[^\/]*\/edit\//,
  newEpisodeBasePath: '/dashboard/episode/new',
};

const podcastColorsByColor = Object.keys(PODCAST_COLORS).reduce(
  (_dict, key) => {
    const dict = _dict;
    const color = PODCAST_COLORS[key];
    dict[color.color] = color;
    return dict;
  },
  {}
);

export function getColorsForAudio(audio) {
  return (
    podcastColorsByColor[audio.color] ||
    getColorsForCreationAreaType(audio.type)
  );
}

export function getColorsForAudioWithExternalAds(audio, containsMusicSegments) {
  if (containsMusicSegments && audio.isValidAdPlacement) {
    return podcastColorsByColor[PODCAST_COLORS.GREEN.color];
  }
  if (
    containsMusicSegments &&
    audio.isMarkedAsExternalAd &&
    !audio.isValidAdPlacement
  ) {
    return podcastColorsByColor[PODCAST_COLORS.GRAY.color];
  }
  return getColorsForAudio(audio);
}

const TYPES_BY_COLOR = {
  '#2dcfb3': 'callIn',
  '#e14040': 'record',
  '#8940fa': 'library',
  '#fface7': 'interlude',
  '#1cee4e': 'sponsorship',
  '#fd6767': 'record',
  '#428eff': 'music',
  '#00b3ce': 'soundfx',
};

export const getAudioTypeByColor = audio =>
  audio.color ? TYPES_BY_COLOR[audio.color.toLowerCase()] : '';

export function getCanApplyBackgroundTrackToAudio(audio) {
  const { audioTransformationStatus } = audio;
  if (!getIsAudioTransformable(getAudioTypeByColor(audio))) return false;
  if (audioTransformationStatus === 'finished') return true;
  return false;
}

export function getIsAudioTransformable(audioType) {
  return ['record', 'library'].includes(audioType);
}

// purple, pink, , secondary color is hex value of color with .3 opacity
// Alternatively return a classname
// TODO (bui): deprecate this and use structs
export function getColorsForCreationAreaType(type) {
  let colors = null;
  switch (type) {
    case 'ad':
      colors = PODCAST_COLORS.GREEN;
      break;
    case 'upload':
      colors = PODCAST_COLORS.BLACK;
      break;
    case 'record':
    case 'mobileRecording':
      colors = PODCAST_COLORS.ORANGE;
      break;
    case 'callins':
    case 'callIn':
      colors = PODCAST_COLORS.CYAN;
      break;
    case 'interludes':
    case 'interlude':
    case 'transitions':
      colors = PODCAST_COLORS.PINK;
      break;
    case 'music':
      colors = PODCAST_COLORS.BLUE;
      break;
    case 'library':
    default:
      colors = PODCAST_COLORS.PURPLE;
      break;
  }
  return colors;
}

// Return string representation of time elapsed since last date (string)
// Todo: months
export function formatDateSinceCreated(date, isDate = false, short = false) {
  if (!date || (!isDate && typeof date !== 'string')) return null;
  const now = Date.now();
  const difference = (!isDate ? now - new Date(date) : now - date) / 1000;
  if (difference < MIN_SECS) {
    return 'Just now';
  }
  if (difference < HR_SECS) {
    const minutes = Math.round(difference / MIN_SECS);
    return `${minutes} minutes ago`;
  }
  if (difference < DAY_SECS) {
    const hours = Math.round(difference / HR_SECS);
    return `${hours} hours ago`;
  }
  const nowYear = new Date().getFullYear();
  const doHideYear =
    (!isDate ? new Date(date) : date).getFullYear() === nowYear;
  return formatDate(date, 'days', { isShortFormat: short, doHideYear });
  /*
  if (difference < WEEK_SECS) {
    const days = Math.round(difference / DAY_SECS);
    return `${days}d ago`;
  }
  if (difference < MONTH_SECS) {
    const weeks = Math.round(difference / WEEK_SECS);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (difference < YEAR_SECS) {
    const months = Math.round(difference / MONTH_SECS);
    return `${months} ${short ? 'mo' : months > 1 ? 'months' : 'month'} ago`;
  }
  const years = Math.round(difference / YEAR_SECS);
  return `${years} year${years > 1 ? 's' : ''} ago`;
  */
}

export function msToHMS(ms) {
  if (!ms) {
    return null;
  }
  let seconds = ms / 1000;
  let minutes = parseInt(seconds / 60, 10);
  const hours = parseInt(minutes / 60, 10);
  seconds = Math.floor(seconds % 60);
  minutes = Math.floor(minutes % 60);
  const minutesSeconds = minutes ? `${minutes}m ${seconds}s` : `${seconds}s`;
  return hours ? `${hours}h ${minutesSeconds}` : minutesSeconds;
}

/**
 *
 * @deprecated use `getFormattedTimestamp`
 */
export function msToDigital(ms) {
  if (ms !== 0 && !ms) {
    return null;
  }
  let seconds = ms / 1000;
  let minutes = parseInt(seconds / 60, 10);
  const hours = parseInt(minutes / 60, 10);
  seconds = Math.floor(seconds % 60);
  minutes = Math.floor(minutes % 60);
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return hours
    ? `${hours}:${minutesStr}:${secondsStr}`
    : `${minutesStr}:${secondsStr}`;
}

// Takes a Javsacript date object and formats it into a date representation
// unit specifies what granularity to represent the date
// Short represents months as the full string
export function formatDate(
  date,
  unit = 'days',
  { doHideYear = false, isShortFormat = false } = {}
) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const year = dateObj.getFullYear();
  if (unit === 'years') {
    return year;
  }
  const locale = 'en-US';
  const month = isShortFormat
    ? dateObj.getMonth() + 1
    : dateObj.toLocaleString(locale, { month: 'short' });
  if (unit === 'months') {
    if (doHideYear) {
      return month;
    }
    return isShortFormat ? `${month}/${year}` : `${month}, ${year}`;
  }
  const day = dateObj.getDate();
  let dateString = isShortFormat ? `${month}/${day}` : `${month} ${day}`;
  if (!doHideYear) {
    dateString =
      dateString +
      (isShortFormat ? `/${year.toString().slice(2)}` : `, ${year}`);
  }
  if (unit === 'days' || unit === 'weeks') {
    return dateString;
  }
  // unit === 'minutes'
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  return `${dateString} ${getAmPmHour(hours)}:${
    minutes < 10 ? `0${minutes}` : minutes
  } ${hours < 12 ? 'AM' : 'PM'}`;
}

export function getAmPmHour(dateHour = 0) {
  return dateHour % 12 || 12;
}

export function getChildPathsFromUrl(url) {
  return url.split('/').filter(Boolean);
}

export function getMaxFromArray(arr) {
  if (arr.length === 0) {
    return null;
  }
  return arr.reduce((a, b) => Math.max(a, b));
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// TODO: refactor this to just take a `shareLinkPath` and not any object
export function getV3ShareUrl(shareObject = {}, activeAudio) {
  // TODO: clean audio title
  return `${getBaseUrl()}${shareObject.shareLinkPath}${
    activeAudio && activeAudio.stationAudioId ? `/a-${activeAudio.audioId}` : ''
  }`;
}

// TODO: refactor this to just take a `shareLinkEmbedPath` and not any object
export function getV3ShareEmbedHtml(shareObject = {}, activeAudio) {
  const url = `${getBaseUrl()}${shareObject.shareLinkEmbedPath}${
    activeAudio && activeAudio.stationAudioId ? `/a-${activeAudio.audioId}` : ''
  }`;
  return `<iframe src="${url}" height="102px" width="400px" frameborder="0" scrolling="no"></iframe>`;
}

export function shuffleArray(arr) {
  const array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * React router v3 would parse the /name-hash/ URL segments properly
 * but v4 does a forward search so it thinks something like this:
 *
 * /hello-there-abc123/
 *
 * Yields a name of "hello" and a hash of "there-abc123"
 * So we do our own regex now
 */
export function getMetadataFromParams({
  episodeHashBeforeHyphen = '',
  episodeHashAfterHyphen = '',
  audioCaptionAndAudioIdHash = '',
}) {
  // re-assemble before parsing (split to differentiate from 2.0 route)
  const episodeNameAndEpisodeIdHash = `${episodeHashBeforeHyphen}-${episodeHashAfterHyphen}`;
  const episodeSplit = splitByLastHyphen(episodeNameAndEpisodeIdHash);
  const audioSplit = audioCaptionAndAudioIdHash
    ? splitByLastHyphen(audioCaptionAndAudioIdHash)
    : [];
  return {
    episodeName: episodeSplit[0],
    episodeIdHash: episodeSplit[1],
    audioCaption: audioSplit[0],
    audioIdHash: audioSplit[1],
  };
}

function splitByLastHyphen(word = '', splitPhrase = '-') {
  const splitWord = word.split(splitPhrase);
  const lastWord = splitWord.pop();
  const firstWord = splitWord.join(splitPhrase);
  return [firstWord, lastWord];
}

// Converts a number into a 'G', 'M', 'k' representation
//   NOTE: the k is only added starting at 100,000. This was
//     a design decision made for the podcast play count graph.
//     If this changes, this function should move to the graph
//     source.
//   Ex:
//     nFormatter(1000) //=> "1.0k"
//     nFormatter(10000) //=> "10.0k"
//     nFormatter(20200) //=> "20.2k"
//     nFormatter(10000000) //=> "1.0M"
export function nFormatter(num) {
  const BILLION = 1000000000;
  const MILLION = 1000000;
  const THOUSAND = 100000;
  if (num >= BILLION) {
    return `${Number(num / BILLION).toFixed(0)}G`;
  }
  if (num >= MILLION) {
    return `${Number(num / MILLION).toFixed(0)}M`;
  }
  if (num >= THOUSAND) {
    return `${Number(num / 1000).toFixed(0)}k`;
  }
  return numberWithCommas(num);
}

export function getSeekAudioIndexFromEpisodeAudiosAndPositionInMs(
  episodeAudios = [],
  positionInMs = 0
) {
  let seekingAudioDuration;
  let seekingDurationPlayed = 0;
  let i;
  for (i = 0; i < episodeAudios.length; i++) {
    seekingAudioDuration = episodeAudios[i].duration;
    if (positionInMs < seekingAudioDuration + seekingDurationPlayed) {
      return {
        audioIndex: i,
        audioPositionInMs: positionInMs - seekingDurationPlayed,
      };
    }
    seekingDurationPlayed = seekingDurationPlayed + seekingAudioDuration;
  }
  return {
    audioIndex: i,
    audioPositionInMs: positionInMs - seekingDurationPlayed,
  };
}

export async function copyTextToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

export const titleCase = ({ str, removeSpace = false }) =>
  str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (!word) return '';
      return word.replace(word[0], word[0].toUpperCase());
    })
    .join(removeSpace ? '' : ' ');

const wait = ms => new Promise(r => setTimeout(r, ms));

export const retryOperation = (operation, delay, times) =>
  new Promise((resolve, reject) =>
    operation()
      .then(resolve)
      .catch(reason => {
        if (times - 1 > 0) {
          return wait(delay)
            .then(retryOperation.bind(null, operation, delay, times - 1))
            .then(resolve)
            .catch(reject);
        }
        return reject(reason);
      })
  );

export const getOriginalAudio = ({
  audioSegments,
  audioWebId,
  originalAudioWebId,
}) => {
  if (originalAudioWebId === audioWebId) {
    return null;
  }
  return { ...audioSegments[originalAudioWebId], audioId: originalAudioWebId };
};

export const getRandomizedVolumeData = (
  _length = 0,
  step = 0.1,
  volume = 0.1
) => {
  // const length = _length;
  const fillMultiple = 3;
  const min = 0;
  const max = 1;
  // const sourceData = Array.apply(null, Array(length)).map(() => (Math.random() * (max - min)) + min);
  const sourceData = [
    volume,
    volume,
    volume,
    volume,
    volume,
    volume,
    volume,
    volume,
  ];
  // const sourceData = [1];
  const { length } = sourceData;
  const filledLength = fillMultiple * length;
  const filledData = [];
  // expand #1
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < fillMultiple; j++) {
      const next = sourceData[i + 1] || sourceData[0];
      const diff = next - sourceData[i];
      filledData.push(sourceData[i] + diff * (j / fillMultiple));
    }
  }
  const expandedData = [];
  const expandedSize = 1 / step;
  // expand #2
  for (let i = 0; i < filledLength; i++) {
    for (let j = 0; j < expandedSize; j++) {
      const next = filledData[i + 1] || filledData[0];
      const diff = next - filledData[i];
      expandedData.push(filledData[i] + diff * (j * step));
    }
  }
  return expandedData;
};

// this function assumes that:
// * images are in s3
// * are in the same directory
// * file names are in order from 1x, 2x, 3x
// * use the image.png, image@2x.png, image@3x.png naming convention
export function getImgSrcSet(imagePaths) {
  return imagePaths
    .map(
      (path, index) =>
        `https://d12xoj7p9moygp.cloudfront.net/${path} ${index + 1}x`
    )
    .join(', ');
}

export function getSortedArrayOfObjects(array, sortKey, sortDirection) {
  // typescript would be cool here, but i dont want to create a new file
  // or convert this entire file to .ts right now
  if (!['asc', 'desc'].includes(sortDirection))
    throw new Error('Invalude sort direction:', sortDirection);
  return [...array].sort((a, b) => {
    const aSortValue = a[sortKey];
    const bSortValue = b[sortKey];
    if (aSortValue < bSortValue) return sortDirection === 'desc' ? 1 : -1;
    if (aSortValue > bSortValue) return sortDirection === 'desc' ? -1 : 1;
    return 0;
  });
}

export function getIsBetweenRange(number, rangeStart, rangeEnd) {
  return (
    number > Math.min(rangeStart, rangeEnd) &&
    number < Math.max(rangeStart, rangeEnd)
  );
}

export function getReorderedArray(array, orderingKeyName, from, to) {
  // if item is not moving anywhere
  // no changes are necessary
  if (from === to) return array;
  return array.map(item => {
    const currentPosition = item[orderingKeyName];
    // if current item is the one that is explicitly moving
    // set the new position
    if (currentPosition === from) return { ...item, [orderingKeyName]: to };

    // if current item is within the range of movement
    // or
    // is in the position where the item is moving to
    // shift it
    if (
      getIsBetweenRange(currentPosition, from, to) ||
      currentPosition === to
    ) {
      // if the moving item is moving up, shift other items down
      // if the moving item is moving down, shift other items up
      return {
        ...item,
        [orderingKeyName]:
          from < to ? currentPosition - 10 : currentPosition + 10,
      };
    }
    // otherwise, the item is outside the range of movement
    // keep it in its current position
    return item;
  });
}

/**
 * Adds `isValidAdPlacement` attribute to episodeAudios based on audio type, sort order and duration
 * TAXI will use isValidAdPlacement to pull only valid ad segments into the published episode
 *
 * @param {Object[]} audios - episodeAudios with metadata representing the order of segments in an episode
 * @returns {Object[]} audios with `isValidAdPlacement` key selectively appended (ad audios only)
 */
export function addIsValidAdPlacementToAudios(audios) {
  const audioMetadataByAudioId = audios.reduce(
    (audioMetadata, audio) => ({
      ...audioMetadata,
      [audio.audioId]: audio,
    }),
    {}
  );
  const invalidPlacements = getInvalidPlacementsForOrderedAudioSet(
    audios,
    audioMetadataByAudioId
  );
  return audios.map((audio, index) => {
    if (!isAudioAd(audio)) return audio;
    return {
      ...audio,
      isValidAdPlacement: !invalidPlacements[index],
    };
  });
}

function isAudioAd(audio) {
  return audio.isMarkedAsExternalAd || audio.type === 'ad';
}

/**
 * Adds audio duration to episode duration; ignores dynamic audio segments.
 * Music segments and ads have variable length and don't count toward calculated episode duration
 * @param {number} episodeDuration - the current length of the episode
 * @param {object} audio - the audio object in the episode builder
 * @param {string} audio.type - one of ['music', 'ad', 'default', 'mobileRecording']
 * @param {number} audio.duration - length of the segment
 * @returns {number} the new episode duration not including dynamic segments
 */
export function addAudioToEpisodeDuration(episodeDuration, audio) {
  const { duration, type } = audio;
  if (duration && !['music', 'ad'].includes(type)) {
    return episodeDuration + duration;
  }
  return episodeDuration;
}

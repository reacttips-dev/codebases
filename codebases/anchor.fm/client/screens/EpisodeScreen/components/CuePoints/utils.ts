import { NewCuePoint, ValidationError, SavedCuePoints, Ranges } from './types';
import { PlacementType } from '../../../../modules/AnchorAPI/v3/episodes/saveAdCuePoints';

/**
 * get the highest and lowest timestamps for each placement type
 */
function getPlacementTypeRanges(savedCuePoints: SavedCuePoints): Ranges | null {
  if (savedCuePoints.length === 0) return null;
  const ranges: Ranges = {
    preRoll: { high: null, low: null },
    midRoll: { high: null, low: null },
    postRoll: { high: null, low: null },
  };
  savedCuePoints.forEach(cuePoint => {
    const { startTime, placementType } = cuePoint;
    const currentRange = ranges[placementType];
    const { high, low } = currentRange;
    if (high === null || startTime > high!) {
      currentRange.high = startTime;
    }
    if (low === null || startTime < low!) {
      currentRange.low = startTime;
    }
  });
  return ranges;
}

/**
 * validates that the new cue point is within the expected timestamp range
 * We expect:
 * - Pre-Roll ads to have a timestamp less than mid-roll and post-roll
 * - Mid-Roll ads to have a timestamp greater than pre-roll and less than post-roll
 * - Post-Roll ads to have a timestamp greater than pre-roll and mid-roll
 *
 * If existing ad slot value is null, we ignore it and treat as valid
 */
function getIsCuepointOrderValid(
  cuePoint: NewCuePoint,
  savedCuePoints: SavedCuePoints
): string | null {
  const ranges = getPlacementTypeRanges(savedCuePoints);
  if (ranges === null) return null;
  const { preRoll, midRoll, postRoll } = ranges;
  const { startTime, startTimeString, placementType } = cuePoint;
  const comparisonStartTime =
    startTime || convertTimestampToMs(startTimeString!);
  switch (placementType) {
    case 'preRoll': {
      const isValid =
        (midRoll.low ? comparisonStartTime < midRoll.low : true) &&
        (postRoll.low ? comparisonStartTime < postRoll.low : true);
      return !isValid
        ? 'Pre-Roll ad timestamp must be set before mid-roll and post-roll ad timestamps.'
        : null;
    }
    case 'midRoll': {
      const isValid =
        (postRoll.low ? comparisonStartTime < postRoll.low : true) &&
        (preRoll.high ? comparisonStartTime > preRoll.high : true);
      return !isValid
        ? 'Mid-Roll ad timestamp must be set after pre-roll and before post-roll timestamps.'
        : null;
    }
    case 'postRoll': {
      const isValid =
        (midRoll.high ? comparisonStartTime > midRoll.high : true) &&
        (preRoll.high ? comparisonStartTime > preRoll.high : true);
      return !isValid
        ? 'Post-Roll ad timestamp must be set after pre-roll and mid-roll timestamps.'
        : null;
    }
    default:
      return null;
  }
}

function getIsValidCuePoint(
  cuePoint: NewCuePoint,
  savedCuePoints: SavedCuePoints,
  mediaDuration?: number
): ValidationError[] | null {
  const { startTime, startTimeString, adCount, placementType } = cuePoint;
  const errors: ValidationError[] = [];

  // validate timestamp
  if (startTimeString === null)
    errors.push({ type: 'startTime', message: 'Timestamp is required.' });
  if (startTimeString && !getIsValidTimestamp(startTimeString)) {
    errors.push({
      type: 'startTime',
      message:
        'Invalid ad slot. Please enter all 9 digits in the following format: 00 (hr) : 00 (min) : 00 (sec) . 000 (msec).',
    });
  }
  const isExistingTimestamp = savedCuePoints.some(
    savedCuePoint => savedCuePoint.startTimeString === cuePoint.startTimeString
  );
  if (isExistingTimestamp) {
    errors.push({
      type: 'startTime',
      message:
        'Timestamp already exists for this ad slot. Try adding a different ad slot.',
    });
  }
  const cuePointOrderError = getIsCuepointOrderValid(cuePoint, savedCuePoints);
  if (cuePointOrderError)
    errors.push({ type: 'startTime', message: cuePointOrderError });
  if (
    startTimeString &&
    !getIsTimestampWithinMediaDuration(
      startTime || convertTimestampToMs(startTimeString),
      mediaDuration
    )
  ) {
    errors.push({
      type: 'startTime',
      message:
        'Invalid ad slot. Timestamps must be less than the episode length.',
    });
  }

  // validate ad counts
  if (adCount === 0)
    errors.push({ type: 'adCount', message: 'Ad count is required.' });
  if (adCount > 5)
    errors.push({ type: 'adCount', message: 'Ad count must be 5 or less.' });

  // validate placement type
  if (placementType === null)
    errors.push({ type: 'placementType', message: 'Ad type is required.' });

  // pod count check
  const currentPlacementTypeCounts = {
    preRoll: 0,
    midRoll: 0,
    postRoll: 0,
  };

  savedCuePoints.forEach(savedCuePoint => {
    switch (savedCuePoint.placementType) {
      case 'preRoll':
        currentPlacementTypeCounts.preRoll =
          currentPlacementTypeCounts.preRoll + 1;
        break;
      case 'midRoll':
        currentPlacementTypeCounts.midRoll =
          currentPlacementTypeCounts.midRoll + 1;
        break;
      case 'postRoll':
        currentPlacementTypeCounts.postRoll =
          currentPlacementTypeCounts.postRoll + 1;
        break;
    }
  });

  switch (cuePoint.placementType) {
    case 'preRoll':
      if (currentPlacementTypeCounts.preRoll >= 1) {
        errors.push({
          type: 'form',
          message: 'Pre-Roll ads can only have one slot.',
        });
      }
      break;
    case 'midRoll':
      if (currentPlacementTypeCounts.midRoll >= 5) {
        errors.push({
          type: 'form',
          message: 'Mid-Roll ads can only have up to five slots.',
        });
      }
      break;
    case 'postRoll':
      if (currentPlacementTypeCounts.postRoll >= 1) {
        errors.push({
          type: 'form',
          message: 'Post-Roll ads can only have one slot.',
        });
      }
      break;
  }
  return errors.length > 0 ? errors : null;
}

function getIsTimestampWithinMediaDuration(
  timestampInMs: number,
  mediaDuration?: number
) {
  if (!mediaDuration) return true;
  return timestampInMs < mediaDuration;
}

// Expects a format like: 34:59:59.432
function getIsValidTimestamp(timestamp: string) {
  return /^\d+[:]([0-5][0-9])[:]([0-5][0-9])(\.\d{1,3})?$/g.test(timestamp);
}

function convertTimestampToMs(timestamp: string) {
  const timeArray = timestamp.split(':').map(time => parseFloat(time));
  return timeArray.reduce((acc, time, index) => {
    // hours
    if (index === 0) {
      return acc + time * 3.6e6;
    }
    // minutes
    if (index === 1) {
      return acc + time * 60000;
    }
    // seconds
    if (index === 2) {
      return acc + time * 1000;
    }
    return acc;
  }, 0);
}

function getPlacementType(placementType: PlacementType) {
  switch (placementType) {
    case 'preRoll':
      return 'Pre-Roll';
    case 'midRoll':
      return ' Mid-Roll';
    case 'postRoll':
    default:
      return 'Post-Roll';
  }
}

export {
  getPlacementType,
  getIsValidCuePoint,
  convertTimestampToMs,
  getIsTimestampWithinMediaDuration,
};

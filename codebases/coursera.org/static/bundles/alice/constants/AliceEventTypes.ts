import keysToConstants from 'js/lib/keysToConstants';

// Note: Only the `PAGEVIEW` event type is appropriate for out of course ALICE events.
const AliceEventTypes = keysToConstants([
  'COURSE_LECTURE_COMPLETE',
  'ITEM_VIEW',
  'ITEM_FAIL',
  'ITEM_SUCCESS',
  'WEEK_START',
  'JUST_ENROLL',
  'PEER_REVIEW_SAVE',
  'PEER_REVIEW_SUBMIT',
  'HIRING_INTEREST',
  'VIDEO_PAUSE',
  'PAGEVIEW',
]);

export const {
  COURSE_LECTURE_COMPLETE,
  ITEM_VIEW,
  ITEM_FAIL,
  ITEM_SUCCESS,
  WEEK_START,
  JUST_ENROLL,
  PEER_REVIEW_SAVE,
  PEER_REVIEW_SUBMIT,
  HIRING_INTEREST,
  VIDEO_PAUSE,
  PAGEVIEW,
} = AliceEventTypes;

export default AliceEventTypes;

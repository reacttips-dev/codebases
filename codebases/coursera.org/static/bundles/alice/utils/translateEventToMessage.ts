import {
  ITEM_VIEW,
  ITEM_FAIL,
  ITEM_SUCCESS,
  COURSE_LECTURE_COMPLETE,
  HIRING_INTEREST,
  WEEK_START,
  PEER_REVIEW_SAVE,
  PEER_REVIEW_SUBMIT,
  VIDEO_PAUSE,
  PAGEVIEW,
  JUST_ENROLL,
} from 'bundles/alice/constants/AliceEventTypes';

import AliceMessageData from 'bundles/alice/models/AliceMessageData';

export default (event: $TSFixMe, messages: $TSFixMe) => {
  let message;

  switch (event.type) {
    case PEER_REVIEW_SUBMIT:
    case PEER_REVIEW_SAVE:
    case VIDEO_PAUSE:
    case ITEM_VIEW:
    case ITEM_SUCCESS:
    case ITEM_FAIL: {
      message = messages.find((m: $TSFixMe) => m.itemId === event.itemId);
      break;
    }

    case WEEK_START: {
      message = messages.find((m: $TSFixMe) => m.week === event.week);
      break;
    }

    case JUST_ENROLL:
    case HIRING_INTEREST:
    case COURSE_LECTURE_COMPLETE:
    case PAGEVIEW: {
      [message] = messages;
      break;
    }

    default:
      break;
  }

  return (
    message &&
    new AliceMessageData(
      message.id,
      message.itemId,
      message.moduleId,
      message.week,
      message.title,
      message.message,
      message.dataSourceDescription,
      message.action,
      message.epicToShowNamespace,
      message.epicToShowParameter,
      message.event
    )
  );
};

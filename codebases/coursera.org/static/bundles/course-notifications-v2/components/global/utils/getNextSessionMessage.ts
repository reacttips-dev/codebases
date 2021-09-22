import { Moment } from 'moment';

import DateTimeUtils from 'js/utils/DateTimeUtils';

import _t from 'i18n!nls/course-notifications-v2';

type Options = {
  currentSessionEndsAt: Moment;
  nextSession?: {
    startsAt: Moment;
    endsAt: Moment;
  };
};

type Message = {
  title: string;
  message: string;
  allowDismiss?: boolean;
};

const getNextSessionMessage = ({ currentSessionEndsAt, nextSession }: Options): Message => {
  const now = DateTimeUtils.momentWithUserTimezone();
  const ended = now.isAfter(currentSessionEndsAt);
  const endingSoon = now.add(1, 'weeks').isAfter(currentSessionEndsAt);
  const formattedCurrentSessionEndsAt = DateTimeUtils.formatDateTimeDisplay(
    currentSessionEndsAt,
    DateTimeUtils.MED_DATETIME_DISPLAY_NO_TZ
  );

  // If there is a next session available
  if (nextSession) {
    const { startsAt, endsAt } = nextSession;

    const formattedNextSessionStartsAt = DateTimeUtils.formatDateTimeDisplay(
      startsAt,
      DateTimeUtils.MED_DATETIME_DISPLAY_NO_TZ
    );

    const formattedNextSessionEndsAt = DateTimeUtils.formatDateTimeDisplay(
      endsAt,
      DateTimeUtils.MED_DATETIME_DISPLAY_NO_TZ
    );

    if (ended) {
      return {
        title: _t('The schedule you’re enrolled in ended on #{date}', { date: formattedCurrentSessionEndsAt }),
        message: _t(
          'If you’d like more time to complete your work, you can switch into the next schedule, which is available from #{start} to #{end}. Your progress will be saved and carry over.',
          {
            start: formattedNextSessionStartsAt,
            end: formattedNextSessionEndsAt,
          }
        ),
      };
    }

    if (endingSoon) {
      return {
        title: _t('The schedule you’re enrolled in ends on #{date}', { date: formattedCurrentSessionEndsAt }),
        message: _t(
          'If you’d like more time to complete your work, you can switch into the next schedule, which is available from #{start} to #{end}. Your progress will be saved and carry over.',
          {
            start: formattedNextSessionStartsAt,
            end: formattedNextSessionEndsAt,
          }
        ),
      };
    }

    return {
      title: _t('The schedule you’re enrolled in ends on #{date}.', { date: formattedCurrentSessionEndsAt }),
      message: _t(
        'It looks like you missed some important deadlines. Try to complete your work before the schedule ends. Optionally, you can switch into the next schedule, which is available from #{start} to #{end}. Your progress will be saved and carry over.',
        {
          start: formattedNextSessionStartsAt,
          end: formattedNextSessionEndsAt,
        }
      ),
      allowDismiss: true,
    };
  }

  if (ended) {
    return {
      title: _t('The schedule you’re enrolled in ended on #{date}', { date: formattedCurrentSessionEndsAt }),
      message: _t('You still have archive access to the content.'),
    };
  }

  if (endingSoon) {
    return {
      title: _t('The schedule you’re enrolled in ends on #{date}', { date: formattedCurrentSessionEndsAt }),
      message: _t(
        'Make sure to complete your work before then! You will still have archive access to the content afterwards.'
      ),
    };
  }

  return {
    title: _t('The schedule you’re enrolled in ends on #{date}.', { date: formattedCurrentSessionEndsAt }),
    message: _t(
      'Make sure to complete your work before then! You will still have archive access to the content afterwards.'
    ),
    allowDismiss: true,
  };
};

export default getNextSessionMessage;

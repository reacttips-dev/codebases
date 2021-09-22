import authoringCourseContextTypes from 'bundles/authoring/common/constants/authoringCourseContexts';
import type { MomentFormat } from 'js/utils/DateTimeUtils';
import { formatDateTimeDisplay, LONG_DATE_ONLY_DISPLAY } from 'js/utils/DateTimeUtils';
import { branchStatus } from 'bundles/author-branches/constants';

import _t from 'i18n!nls/authoring';

import type { AuthoringCourseContextTypeName } from 'bundles/authoring/common/types/authoringCourseContexts';

type ContextDateParams = {
  status: string;
  createdAt?: number;
  startsAt?: number;
  endsAt?: number;
  typeName: AuthoringCourseContextTypeName;
};

export const getContextDateString = (
  { status, createdAt, startsAt, endsAt, typeName }: ContextDateParams,
  dateFormat: MomentFormat = LONG_DATE_ONLY_DISPLAY
) => {
  let resultString = '';
  if (typeName === authoringCourseContextTypes.SESSION_GROUP) {
    resultString = _t('#{startDateString} - #{endDateString}', {
      // @ts-expect-error TODO: startsAt can't be undefined
      startDateString: formatDateTimeDisplay(startsAt, dateFormat),
      // @ts-expect-error TODO: endsAt can't be undefined
      endDateString: formatDateTimeDisplay(endsAt, dateFormat),
    });
  } else {
    switch (status) {
      case branchStatus.NEW:
        if (createdAt) {
          resultString = _t(`Created on #{createdAtString}`, {
            createdAtString: formatDateTimeDisplay(createdAt, dateFormat),
          });
        }
        break;
      case branchStatus.UPCOMING:
      case branchStatus.PENDING:
        resultString = _t(`Starts on #{startDateString}`, {
          // @ts-expect-error TODO: startsAt can't be undefined
          startDateString: formatDateTimeDisplay(startsAt, dateFormat),
        });
        break;
      case branchStatus.LIVE:
        resultString = _t(`#{startDateString} - present`, {
          // @ts-expect-error TODO: startsAt can't be undefined
          startDateString: formatDateTimeDisplay(startsAt, dateFormat),
        });
        break;
      case branchStatus.ARCHIVED:
      default:
        if (startsAt && endsAt) {
          resultString = _t('#{startDateString} - #{endDateString}', {
            startDateString: formatDateTimeDisplay(startsAt, dateFormat),
            endDateString: formatDateTimeDisplay(endsAt, dateFormat),
          });
        } else if (createdAt) {
          resultString = _t(`Created on #{createdAtString}`, {
            createdAtString: formatDateTimeDisplay(createdAt, dateFormat),
          });
        }
    }
  }

  return resultString;
};

export default getContextDateString;

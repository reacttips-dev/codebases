import React from 'react';
import classNames from 'classnames';
/* eslint-disable-next-line import/extensions */
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type momentReactValidator from 'js/lib/moment.validator';
import { getSessionStatus } from 'bundles/authoring/sessions/utils/SessionUtils';
import _t from 'i18n!nls/author-sessions';
import { Pill, color } from '@coursera/coursera-ui';
import type { SessionState } from 'bundles/authoring/sessions/constants/SessionStates';
import SessionStates from 'bundles/authoring/sessions/constants/SessionStates';
import getStatusPillStyle from 'bundles/authoring/common/constants/statusPillStyle';

const StatusColorMap = {
  [SessionStates.UPCOMING]: color.success,
  [SessionStates.LIVE]: color.primary,
  [SessionStates.ARCHIVED]: color.bgDarkGray,
};

const getTranslatedStatusString = (status: SessionState) => {
  const statusStringMap = {
    [SessionStates.UPCOMING]: _t('Upcoming'),
    [SessionStates.LIVE]: _t('Live'),
    [SessionStates.ARCHIVED]: _t('Archived'),
  };

  return statusStringMap[status];
};

type Props = {
  startedAt: momentReactValidator;
  enrollmentEndedAt?: momentReactValidator;
  endedAt: momentReactValidator;
  hideEndedStatus?: boolean;
  noMinWidth?: boolean;
};

const SessionStatusPill = ({ startedAt, enrollmentEndedAt, endedAt, hideEndedStatus, noMinWidth }: Props) => {
  const sessionStatus = getSessionStatus({ startedAt, endedAt, enrollmentEndedAt });
  const classes = classNames('rc-SessionStatusPill', sessionStatus);

  if (sessionStatus === SessionStates.ARCHIVED && hideEndedStatus) {
    return null;
  }

  return (
    <Pill
      type="filled"
      rootClassName={classes}
      fillColor={StatusColorMap[sessionStatus]}
      label={getTranslatedStatusString(sessionStatus)}
      style={{
        ...getStatusPillStyle(),
        minWidth: noMinWidth ? undefined : '95px',
      }}
    />
  );
};

export default SessionStatusPill;

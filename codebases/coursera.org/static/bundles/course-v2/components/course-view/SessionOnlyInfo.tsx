import React from 'react';
import { Box } from '@coursera/coursera-ui';
import { LONG_DATE_ONLY_DISPLAY, formatDateTimeDisplay } from 'js/utils/DateTimeUtils';

import Session from 'bundles/authoring/sessions/models/Session';
import SessionStatusPill from 'bundles/authoring/sessions/components/SessionStatusPill';
import _t from 'i18n!nls/authoring';

/**
 * A component for displaying the status of a session
 */

type Props = {
  session: Session;
  isSessionsV2Enabled: boolean;
};

class SessionOnlyInfo extends React.Component<Props> {
  render() {
    const { session, isSessionsV2Enabled } = this.props;

    const sessionPrivacyLabel = session.isPrivate ? (
      <span style={{ color: '#E85628', marginLeft: '3px', marginRight: '10px' }}> {_t('Private')} </span>
    ) : (
      <span style={{ color: '#0156b8', marginLeft: '3px', marginRight: '10px' }}> {_t('Public')} </span>
    );

    const startTime = formatDateTimeDisplay(session.startedAt, LONG_DATE_ONLY_DISPLAY);
    const endTime = formatDateTimeDisplay(session.endedAt, LONG_DATE_ONLY_DISPLAY);

    const timelineLabel = <span>{`${startTime} - ${endTime}`}</span>;
    const showTimelineLabel = !isSessionsV2Enabled || session.isPrivate;

    return (
      <Box rootClassName="rc-SessionOnlyInfo" justifyContent="start">
        <SessionStatusPill
          startedAt={session.startedAt}
          enrollmentEndedAt={session.enrollmentEndedAt}
          endedAt={session.endedAt}
        />
        {sessionPrivacyLabel}
        {showTimelineLabel && timelineLabel}
      </Box>
    );
  }
}

export default SessionOnlyInfo;

import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'underscore';
import moment from 'moment';
import 'moment-timezone';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

import _t from 'i18n!nls/discussions';
import { FormattedMessage } from 'js/lib/coursera.react-intl';

// duplicated from ondemand/stores/SessionStore - move to a util when we have a common bundle
const TIMEZONE_STRING = 'America/Los_Angeles';
const formatDate = (time) => {
  return moment(time).tz(TIMEZONE_STRING).format('MMMM D');
};

class SessionDetails extends React.Component {
  static propTypes = {
    hasSession: PropTypes.bool,
    startedAt: PropTypes.string,
    endedAt: PropTypes.string,
    isPinned: PropTypes.bool,
    isPersistentForumsEnabled: PropTypes.bool,
  };

  render() {
    const { hasSession, startedAt, endedAt, isPinned, isPersistentForumsEnabled } = this.props;

    if (!hasSession) {
      return null;
    }

    const isVisibleToAllLearners = isPinned || isPersistentForumsEnabled;

    return (
      <div className="rc-SessionDetails mentor-message align-horizontal-center">
        {isVisibleToAllLearners && _t('This thread is visible to all learners.')}

        {!isVisibleToAllLearners && (
          <FormattedMessage
            endDate={endedAt}
            startDate={startedAt}
            message={_t('This thread is only visible to learners in the {startDate} - {endDate} session.')}
          />
        )}
      </div>
    );
  }
}

export default compose(
  connectToStores(['SessionFilterStore'], ({ SessionFilterStore }, { question }) => {
    const questionSession =
      SessionFilterStore.allSessions &&
      SessionFilterStore.allSessions.find((session) => session.id === question.sessionId);

    return {
      hasSession: !!questionSession,
      isPersistentForumsEnabled: SessionFilterStore.getIsPersistentForumsEnabled(),
      startedAt: questionSession && formatDate(questionSession.startedAt),
      endedAt: questionSession && formatDate(questionSession.endedAt),
    };
  })
)(SessionDetails);

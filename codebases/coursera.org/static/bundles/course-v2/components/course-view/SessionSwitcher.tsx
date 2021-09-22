import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'underscore';
import _t from 'i18n!nls/course-v2';

import { DropdownButton, MenuItem } from 'react-bootstrap-33';

import Session from 'bundles/authoring/sessions/models/Session';
import SessionOnlyInfo from 'bundles/course-v2/components/course-view/SessionOnlyInfo';
import { sortByStateAndStartedAtFunc as sessionSortFunc } from 'bundles/authoring/sessions/utils/SessionUtils';

import 'css!./__styles__/SessionSwitcher';

/**
 * A dumb private session switcher
 */

type Props = {
  sessions: Array<Session>;
  selectedSessionId: string;
  onSessionSelect: (x: string) => void;
  isSessionsV2Enabled: boolean;
};

type State = {
  selectedSessionId: string;
};

class SessionSwitcher extends React.Component<Props, State> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    onSessionSelect: () => {},
  };

  handleSessionSelect = (newSessionId: string) => {
    const { onSessionSelect, selectedSessionId } = this.props;
    // Only execute callback function if selected groupId changes
    if (selectedSessionId !== newSessionId) {
      onSessionSelect(newSessionId);
    }
  };

  renderSessionDropdownTitle = (selectedSessionId: string) => {
    const { isSessionsV2Enabled, sessions } = this.props;
    const selectedSession = sessions.find((session) => session.id === selectedSessionId);

    if (!selectedSession) {
      return null;
    }

    return (
      <div className="dropdown-title">
        <SessionOnlyInfo session={selectedSession} isSessionsV2Enabled={isSessionsV2Enabled} />
      </div>
    );
  };

  renderDisabledSessionDropdownTitle = () => {
    return <div className="dropdown-title">{_t('No sessions available for this version')}</div>;
  };

  render() {
    const { sessions, selectedSessionId, isSessionsV2Enabled } = this.props;
    const disableSessionDropdown = sessions.length === 0;

    const sortedSessions = sessions.sort((a, b) => sessionSortFunc(a, b));

    const currentPublicSessions = _(sortedSessions).filter((session) => {
      const { isPrivate, enrollmentEndedAt, startedAt, endedAt } = session;
      const now = moment();
      // checking if the session is current by if it is open or running.
      const isCurrent =
        moment(startedAt).isBefore(now) && (moment(endedAt).isAfter(now) || moment(enrollmentEndedAt).isAfter(now));
      return !isPrivate && isCurrent;
    });

    const visibleSessions = sortedSessions.filter((session) => (isSessionsV2Enabled ? session.isPrivate : true));

    const firstUpcomingPublicSession = _(sortedSessions.reverse()).find((session) => {
      const { isPrivate, startedAt } = session;
      const now = moment();
      return !isPrivate && moment(startedAt).isAfter(now);
    });

    const latestPublicSession = !_(currentPublicSessions).isEmpty()
      ? _(currentPublicSessions).max((session) => session.startedAt)
      : firstUpcomingPublicSession;

    if (isSessionsV2Enabled && latestPublicSession && typeof latestPublicSession !== 'number') {
      visibleSessions.unshift(latestPublicSession);
    }

    return (
      <div className="rc-SessionSwitcher">
        {!disableSessionDropdown && (
          <DropdownButton
            title={this.renderSessionDropdownTitle(selectedSessionId)}
            onSelect={this.handleSessionSelect}
          >
            {visibleSessions.map((session) => {
              if (!session) {
                return null;
              }
              return (
                <MenuItem eventKey={session.id} key={session.id}>
                  <SessionOnlyInfo session={session} isSessionsV2Enabled={isSessionsV2Enabled} />
                </MenuItem>
              );
            })}
          </DropdownButton>
        )}
        {disableSessionDropdown && <DropdownButton title={this.renderDisabledSessionDropdownTitle()} disabled />}
      </div>
    );
  }
}

export default SessionSwitcher;

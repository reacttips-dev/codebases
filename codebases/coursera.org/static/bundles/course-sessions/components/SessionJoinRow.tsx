import React from 'react';

import _t from 'i18n!nls/course-sessions';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandSessions from 'bundles/naptimejs/resources/onDemandSessions.v1';
import 'css!bundles/course-sessions/components/__styles__/SessionSwitchRow';

type Props = {
  session: OnDemandSessions;
  handleSessionSwitch: Function;
};

type State = {
  clickedJoin: boolean;
};

class SessionJoinRow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { clickedJoin: false };
  }

  handleClickJoin() {
    const { session, handleSessionSwitch } = this.props;
    this.setState({ clickedJoin: true });
    handleSessionSwitch(session);
  }

  getButtonText() {
    if (this.state.clickedJoin) {
      return _t('Joining');
    } else {
      return _t('Join');
    }
  }

  render() {
    return (
      <li className="rc-SessionSwitchRow horizontal-box align-items-vertical-center">
        <div className="flex-1">{this.props.session.dateRangeString}</div>
        <button
          className="upcoming-session-button primary"
          disabled={this.state.clickedJoin}
          onClick={() => this.handleClickJoin()}
        >
          {this.getButtonText()}
        </button>
      </li>
    );
  }
}

export default SessionJoinRow;

import React from 'react';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandLearnerSessions from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';
import CMLUtils from 'bundles/cml/utils/CMLUtils';

import { FormattedMessage } from 'js/lib/coursera.react-intl';

import _t from 'i18n!nls/ondemand';

import 'css!./__styles__/SessionSwitchRow';

type Props = {
  courseId: string;
  session: OnDemandLearnerSessions;
  handleSessionSwitch: (session: OnDemandLearnerSessions) => void;
  showChangesDescription?: (session: OnDemandLearnerSessions) => void;
  isRecommended: boolean;
};

type State = {
  clickedJoin: boolean;
};

class SessionSwitchRow extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = { clickedJoin: false };
  }

  handleClickJoin() {
    const { session, handleSessionSwitch, showChangesDescription } = this.props;

    let hasChangesDescription = false;

    if (session.sessionSwitch && session.sessionSwitch.changesDescription) {
      const {
        sessionSwitch: { changesDescription },
      } = session;

      if (changesDescription.cml) {
        hasChangesDescription = !CMLUtils.isEmpty(
          CMLUtils.create(changesDescription.cml.value, changesDescription.cml.dtdId)
        );
      } else {
        hasChangesDescription = !CMLUtils.isEmpty(changesDescription);
      }
    }

    this.setState({ clickedJoin: true });

    if (hasChangesDescription) {
      if (showChangesDescription) {
        showChangesDescription(session);
      }
    } else {
      handleSessionSwitch(session);
    }
  }

  getButtonText() {
    if (this.props.session.isEnrolled) {
      return _t('Enrolled');
    } else if (this.state.clickedJoin) {
      return _t('Joining');
    } else {
      return _t('Join');
    }
  }

  render() {
    const { session, isRecommended } = this.props;
    // allow learners to switch into sessions where enrollment is over
    const isEnrollableNow = (session.enrollmentEnded || session.isEnrollableNow) && session.sessionSwitch.canSwitch;

    return (
      <li className="rc-SessionSwitchRow horizontal-box align-items-vertical-center">
        <div className={isRecommended ? '' : 'flex-1'}>{session.dateRangeString}</div>
        {isRecommended && <div className="flex-1 recommended">{_t('Recommended')}</div>}
        {isEnrollableNow ? (
          <button
            className="upcoming-session-button primary"
            disabled={session.isEnrolled || this.state.clickedJoin}
            onClick={() => this.handleClickJoin()}
          >
            {this.getButtonText()}
          </button>
        ) : (
          <div className="color-hint-text">
            <FormattedMessage
              message={_t('Enrollment starts {enrollmentStarts}')}
              enrollmentStarts={session.enrollmentStartsAtString}
            />
          </div>
        )}
      </li>
    );
  }
}

export default SessionSwitchRow;

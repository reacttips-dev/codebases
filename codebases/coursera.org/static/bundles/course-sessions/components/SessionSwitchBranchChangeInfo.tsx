import React from 'react';

import CML from 'bundles/cml/components/CML';
import type { CmlContent } from 'bundles/cml/types/Content';

import { isVideoHighlightingEnabled } from 'bundles/video-highlighting/utils/highlightingFeatureToggles';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type OnDemandLearnerSession from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';

import _t from 'i18n!nls/ondemand';
import withSessionLabel from '../utils/withSessionLabel';
import type { SessionLabel } from '../utils/withSessionLabel';

type InputProps = {
  handleSessionSwitch: (x0: OnDemandLearnerSession) => void;
  changesDescription: CmlContent;
  sessionToJoin: OnDemandLearnerSession;
  courseId: string;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

type State = {
  submitDisabled: boolean;
};

export class SessionSwitchBranchChangeInfo extends React.Component<Props, State> {
  state = { submitDisabled: false };

  handleClickJoin() {
    const { sessionToJoin, handleSessionSwitch } = this.props;

    this.setState({ submitDisabled: true });
    handleSessionSwitch(sessionToJoin);
  }

  render() {
    const { submitDisabled } = this.state;
    const { sessionLabel, changesDescription, courseId } = this.props;

    let message =
      sessionLabel === 'session'
        ? _t(
            `Your instructor has made some changes to the material from the last session. 
          You may need to complete additional assignments to pass the course in this session.
          Review the information below to learn more.`
          )
        : _t(
            `Your instructor has made some changes to the material from the last schedule. 
            You may need to complete additional assignments to pass the course in this schedule.
            Review the information below to learn more.`
          );

    if (isVideoHighlightingEnabled(courseId)) {
      message =
        sessionLabel === 'session'
          ? _t(
              `Your instructor has made some changes to the material from the last session. 
              You may need to complete additional assignments to pass the course in this session. 
              If the instructor has removed or altered videos, your highlights and notes will be preserved but 
              they may not link back to the original video. Review the information below to learn more.`
            )
          : _t(
              `Your instructor has made some changes to the material from the last schedule. 
            You may need to complete additional assignments to pass the course in this schedule. 
            If the instructor has removed or altered videos, your highlights and notes will be preserved but 
            they may not link back to the original video. Review the information below to learn more.`
            );
    }

    return (
      <div className="rc-SessionSwitchBranchChangeInfo">
        <h3 className="title">{sessionLabel === 'session' ? _t('New in this session') : _t('New in this schedule')}</h3>

        <div className="content">
          <p className="body-1-text">{message}</p>
          <p className="body-2-text instructor-note">{_t('Note from your instructor:')}</p>
          <p className="body-1-text">
            <CML cml={changesDescription} />
          </p>
        </div>
        <div className="horizontal-box align-items-right wrap">
          <button className="primary" type="submit" disabled={submitDisabled} onClick={() => this.handleClickJoin()}>
            {submitDisabled ? _t('Joining') : _t('Join')}
          </button>
        </div>
      </div>
    );
  }
}

export default withSessionLabel(SessionSwitchBranchChangeInfo);

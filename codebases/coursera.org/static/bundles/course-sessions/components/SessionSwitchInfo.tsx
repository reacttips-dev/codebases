import React from 'react';
import SessionSwitchRow from 'bundles/course-sessions/components/SessionSwitchRow';
import SessionJoinRow from 'bundles/course-sessions/components/SessionJoinRow';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandLearnerSessions from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';
import withSessionLabel, { SessionLabel } from '../utils/withSessionLabel';

import _t from 'i18n!nls/ondemand';

import 'css!./__styles__/SessionSwitchInfo';

type InputProps = {
  upcomingEnrollableSessions: OnDemandLearnerSessions[];
  handleSessionSwitch: (session: OnDemandLearnerSessions) => void;
  showChangesDescription?: (session: OnDemandLearnerSessions) => void;
  isSelfServeSession: boolean;
  courseId: string;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

class SessionSwitchInfo extends React.Component<Props> {
  getTitleText(multipleJoinableSessions: boolean) {
    const { sessionLabel } = this.props;

    if (this.props.isSelfServeSession) {
      return sessionLabel === 'session' ? _t('Pick a session') : _t('Pick a schedule');
    } else if (multipleJoinableSessions) {
      return sessionLabel === 'session'
        ? _t('Choose a session that works for you')
        : _t('Choose a schedule that works for you');
    } else {
      return sessionLabel === 'session' ? _t('Switch sessions') : _t('Switch schedules');
    }
  }

  getDescriptionText(multipleJoinableSessions: boolean) {
    const { sessionLabel } = this.props;

    if (multipleJoinableSessions) {
      return sessionLabel === 'session'
        ? _t(
            `We’ve saved your progress, so you’ll be able to pick up right where you left off. Join the
        recommended session and you’ll be right on track. `
          )
        : _t(
            `We’ve saved your progress, so you’ll be able to pick up right where you left off. Join the
          recommended schedule and you’ll be right on track. `
          );
    } else {
      return _t('We’ve saved your progress, so you’ll be able to pick up right where you left off. ');
    }
  }

  render() {
    const {
      sessionLabel,
      upcomingEnrollableSessions,
      handleSessionSwitch,
      courseId,
      showChangesDescription,
      isSelfServeSession,
    } = this.props;

    const showWeekOneWarning = upcomingEnrollableSessions[0] && !upcomingEnrollableSessions[0].hasStarted;
    const joinableSessions = upcomingEnrollableSessions.filter(
      (session) => session.enrollmentEnded || session.isEnrollableNow
    );
    const multipleSessions = joinableSessions.length > 1;
    const showRecommended = multipleSessions;

    const sessionRows = upcomingEnrollableSessions.map((session) => {
      return isSelfServeSession ? (
        <SessionJoinRow session={session} handleSessionSwitch={handleSessionSwitch} key={session.id} />
      ) : (
        <SessionSwitchRow
          session={session}
          courseId={courseId}
          handleSessionSwitch={handleSessionSwitch}
          showChangesDescription={showChangesDescription}
          key={session.id}
          isRecommended={showRecommended && session.sessionSwitch.isRecommendedSwitch}
        />
      );
    });

    return (
      <div className="rc-SessionSwitchInfo">
        <h3 className="title">{this.getTitleText(multipleSessions)}</h3>

        <div className="content">
          {!isSelfServeSession && (
            <p className="body-1-text">
              {this.getDescriptionText(multipleSessions)}
              <a href="https://learner.coursera.help/hc/articles/208279776" target="_blank" rel="noreferrer noopener">
                {_t('Learn more.')}
              </a>
            </p>
          )}

          {!isSelfServeSession && showWeekOneWarning && (
            <p className="body-1-text">
              {sessionLabel === 'session'
                ? _t(
                    `You will be able to access lectures, readings, and all Week 1 materials now. You’ll have access to
                all materials when your new session starts. `
                  )
                : _t(
                    `You will be able to access lectures, readings, and all Week 1 materials now. You’ll have access to
                all materials when your new schedule starts. `
                  )}
            </p>
          )}

          {isSelfServeSession && (
            <p className="body-1-text">
              {sessionLabel === 'session'
                ? _t(
                    `Select a session to start and you’ll have access to lectures, readings, and all Week 1 materials. 
                  All materials will be accessible when your new session starts.`
                  )
                : _t(
                    `Select a schedule to start and you’ll have access to lectures, readings, 
                    and all Week 1 materials. All materials will be accessible when your new schedule starts.`
                  )}
            </p>
          )}

          {upcomingEnrollableSessions.length > 0 ? (
            <ul className="sessions-list">{sessionRows}</ul>
          ) : (
            <p>
              {sessionLabel === 'session'
                ? _t('There are no upcoming sessions available at this time.')
                : _t('There are no upcoming schedules available at this time.')}
            </p>
          )}
        </div>
      </div>
    );
  }
}

export default withSessionLabel(SessionSwitchInfo);

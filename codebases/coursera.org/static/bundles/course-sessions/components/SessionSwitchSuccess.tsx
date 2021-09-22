import React from 'react';

import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import OnDemandLearnerSession from 'bundles/naptimejs/resources/onDemandLearnerSessions.v1';
import withSessionLabel, { SessionLabel } from '../utils/withSessionLabel';

import _t from 'i18n!nls/ondemand';

type InputProps = {
  courseHomeLink: string;
  courseName: string;
  courseId: string;
  enrolledSession: OnDemandLearnerSession;
  isSelfServeSession: boolean;
};

type Props = InputProps & {
  sessionLabel: SessionLabel;
};

export class SessionSwitchSuccess extends React.Component<Props> {
  getTitleText() {
    return _t("You've joined the {sessionDates} schedule for {courseName}.");
  }

  render() {
    const { sessionLabel, courseHomeLink, enrolledSession, courseName, isSelfServeSession } = this.props;
    return (
      <div className="rc-SessionSwitchSuccess">
        <h3 className="title">{_t('Success!')}</h3>

        <div className="content">
          <p className="body-1-text">
            <FormattedHTMLMessage
              message={this.getTitleText()}
              sessionDates={enrolledSession.dateRangeString}
              courseName={courseName}
            />
          </p>
          <p className="body-1-text">
            {!enrolledSession.hasStarted &&
              (sessionLabel === 'session'
                ? _t(
                    `You can access lectures, readings, and all Week 1 materials now, and you’ll have access to all
              materials on your new session start date. `
                  )
                : _t(
                    `You can access lectures, readings, and all Week 1 materials now, and you’ll have access to all
                materials on your new schedule start date. `
                  ))}
            {!isSelfServeSession &&
              (sessionLabel === 'session'
                ? _t(
                    `Any assignment grades you’ve received will transfer to your new session. Remember to re-submit
            ungraded submissions and other drafts in your new session to receive a grade. `
                  )
                : _t(
                    `Any assignment grades you’ve received will transfer to your new schedule. Remember to re-submit
            ungraded submissions and other drafts in your new schedule to receive a grade. `
                  ))}
          </p>
        </div>
        <div className="horizontal-box align-items-right wrap">
          <a className="link-button primary" href={courseHomeLink}>
            {_t('View Course')}
          </a>
        </div>
      </div>
    );
  }
}

export default withSessionLabel<InputProps>(SessionSwitchSuccess);

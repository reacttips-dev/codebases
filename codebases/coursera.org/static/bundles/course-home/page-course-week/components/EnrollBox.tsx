import React from 'react';
import Naptime from 'bundles/naptimejs';
import _ from 'underscore';

import user from 'js/lib/user';

import withSessionsV2EnrollmentEnabled from 'bundles/course-sessions/utils/withSessionsV2EnrollmentEnabled';

import withComputedCourseProgress from 'bundles/learner-progress/utils/withComputedCourseProgress';

import SessionBox from 'bundles/course-home/page-course-week/components/SessionBox';
import OnDemandBox from 'bundles/course-home/page-course-week/components/OnDemandBox';
import LoggedOutBox from 'bundles/course-home/page-course-week/components/LoggedOutBox';
import NoSessionBox from 'bundles/course-home/page-course-week/components/NoSessionBox';
import PreEnrollBox from 'bundles/course-home/page-course-week/components/PreEnrollBox';
import CoursePassedBox from 'bundles/course-home/page-course-week/components/CoursePassedBox';

import LearnerCourseSchedulesV1 from 'bundles/naptimejs/resources/learnerCourseSchedules.v1';

import waitForStores from 'bundles/phoenix/lib/waitForStores';

import 'css!./__styles__/EnrollBox';

type Props = {
  isCapstone?: boolean;
  isPreEnrollEnabled?: boolean;
  hasPassed?: boolean;
  isSessionAvailable?: boolean;
  isSessionsEnabled?: boolean;
  sessionsV2Enabled?: boolean;
  sessionsV2EnrollmentEnabled?: boolean;
};

class EnrollBox extends React.Component<Props> {
  render() {
    const {
      isCapstone,
      isPreEnrollEnabled,
      hasPassed,
      isSessionAvailable,
      isSessionsEnabled,
      sessionsV2Enabled,
      sessionsV2EnrollmentEnabled,
    } = this.props;
    const sessionBox = isSessionAvailable ? <SessionBox /> : <NoSessionBox />;

    if (!user.isAuthenticatedUser()) {
      if (sessionsV2EnrollmentEnabled) {
        return <LoggedOutBox />;
      }
      const showSessionBox = isCapstone || isSessionAvailable;
      return showSessionBox ? sessionBox : <LoggedOutBox />;
    } else if (hasPassed) {
      return <CoursePassedBox />;
    } else if (!isSessionAvailable && isPreEnrollEnabled) {
      return <PreEnrollBox />;
    } else if (isSessionsEnabled) {
      if (sessionsV2Enabled) {
        return null;
      }
      return sessionBox;
    } else {
      return <OnDemandBox />;
    }
  }
}

export default _.compose(
  withComputedCourseProgress(),
  waitForStores(['S12nStore', 'CourseStore', 'SessionStore'], ({ S12nStore, CourseStore, SessionStore }) => {
    const s12n = S12nStore.getS12n();
    const courseId = CourseStore.getCourseId();

    return {
      courseId,
      isPreEnrollEnabled: CourseStore.isPreEnrollEnabledForUser(),
      isCapstone: !!s12n && s12n.isCapstone(courseId),
      isSessionAvailable: SessionStore.isSessionAvailable(),
      isSessionsEnabled: SessionStore.isSessionsEnabled(),
    };
  }),
  Naptime.createContainer((props: any) => ({
    sessionsV2Enabled: LearnerCourseSchedulesV1.getSessionsV2Enabled(user.get().id, props.courseId),
  })),
  withSessionsV2EnrollmentEnabled(({ courseId }) => courseId)
)(EnrollBox);

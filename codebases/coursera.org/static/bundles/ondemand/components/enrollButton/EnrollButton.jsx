import PropTypes from 'prop-types';
import React from 'react';
import LegacyCourseEnrollButton from 'bundles/enroll-course/components/LegacyCourseEnrollButton';
import LoggedOutButton from 'bundles/ondemand/components/enrollButton/LoggedOutButton';
import S12n from 'bundles/ondemand/models/S12n';
import user from 'js/lib/user';
import OpenCourseModel from 'pages/open-course/common/models/course';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

class EnrollButton extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(OpenCourseModel),
    hasS12nLoaded: PropTypes.bool,
    sessionId: PropTypes.string,
    s12n: PropTypes.instanceOf(S12n),
    onClick: PropTypes.func,
    onEnroll: PropTypes.func,
    onFreeEnroll: PropTypes.func,
    isPreEnroll: PropTypes.bool,
    isEnrolled: PropTypes.bool,
    isSessionsEnabled: PropTypes.bool,
  };

  render() {
    if (!this.props.hasS12nLoaded) {
      return null;
    }

    if (!user.isAuthenticatedUser()) {
      return <LoggedOutButton {...this.props} />;
    }

    const { course, s12n } = this.props;
    const childProps = Object.assign({}, this.props, {
      courseName: course.get('name'),
    });

    if (s12n) {
      Object.assign(childProps, {
        shouldEnrollWithoutModal: s12n.ownsCourse(course.get('id')),
      });
    }

    return <LegacyCourseEnrollButton courseId={course.get('id')} className="align-horizontal-right" />;
  }
}

export default connectToStores(
  EnrollButton,
  ['CourseStore', 'S12nStore', 'CourseMembershipStore', 'SessionStore'],
  ({ CourseStore, S12nStore, CourseMembershipStore, SessionStore }, props) => {
    const s12n = S12nStore.getS12n();
    return {
      hasS12nLoaded: S12nStore.hasLoaded(),
      course: CourseStore.getMetadata(),
      isPreEnroll: CourseStore.isPreEnrollEnabledForUser(),
      s12n,
      isEnrolled: CourseMembershipStore.isEnrolled() || CourseMembershipStore.isPreEnrolled(),
      isSessionsEnabled: SessionStore.isSessionsEnabled(),
    };
  }
);

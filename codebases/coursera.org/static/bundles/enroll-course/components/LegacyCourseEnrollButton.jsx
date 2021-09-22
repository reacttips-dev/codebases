import classNames from 'classnames';
import Naptime from 'bundles/naptimejs';
import user from 'js/lib/user';
import PropTypes from 'prop-types';
import React from 'react';
import CoursesV1 from 'bundles/naptimejs/resources/courses.v1';
import EnrollmentAvailableChoicesV1 from 'bundles/naptimejs/resources/enrollmentAvailableChoices.v1';
import { TrackedA } from 'bundles/page/components/TrackedLink2';
import _t from 'i18n!nls/enroll-course';

class LegacyCourseEnrollButton extends React.Component {
  static propTypes = {
    course: PropTypes.instanceOf(CoursesV1).isRequired,
    enrollmentAvailableChoices: PropTypes.instanceOf(EnrollmentAvailableChoicesV1),
    className: PropTypes.string,
  };

  render() {
    const { course, enrollmentAvailableChoices, className } = this.props;

    const elClassName = classNames('rc-LegacyCourseEnrollButton', className);

    if (enrollmentAvailableChoices && enrollmentAvailableChoices.isEnrolled) {
      return (
        <div className={elClassName}>
          <button className="primary" disabled>
            {_t('Enrolled')}
          </button>
        </div>
      );
    } else {
      return (
        <div className={elClassName}>
          <TrackedA
            trackingName="legacy_course_enroll_button"
            data={{ courseId: course.id }}
            href={`/learn/${course.slug}?action=enroll`}
            className="link-button primary"
          >
            {_t('Enroll')}
          </TrackedA>
        </div>
      );
    }
  }
}

const LegacyCourseEnrollButtonNC = Naptime.createContainer(LegacyCourseEnrollButton, (props) => ({
  enrollmentAvailableChoices:
    (props.userId &&
      EnrollmentAvailableChoicesV1.getChoices(
        props.userId,
        { courseId: props.courseId },
        {
          fields: ['enrollmentChoices', 'enrollmentChoiceReasonCode'],
        }
      )) ||
    undefined,
}));

class LegacyCourseEnrollButtonUserProvider extends React.Component {
  static contextTypes = {
    getStore: PropTypes.func.isRequired,
  };

  render() {
    return <LegacyCourseEnrollButtonNC {...this.props} userId={user.get().id} />;
  }
}

export default Naptime.createContainer(LegacyCourseEnrollButtonUserProvider, (props) => ({
  course: CoursesV1.get(props.courseId, {
    fields: [
      'slug',
      // TODO: DLE Naptime ignore upstream courses.v1 requests with different params.
      // This is the first course.v1 call that naptime makes in ondemand app.
      's12nIds',
    ],
    params: { showHidden: true },
  }),
}));

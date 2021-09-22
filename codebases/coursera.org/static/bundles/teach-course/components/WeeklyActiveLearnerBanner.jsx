import PropTypes from 'prop-types';
import React from 'react';
import TeachBannerUtils from 'bundles/teach-course/lib/TeachBannerUtils';
import { FormattedNumber } from 'js/lib/coursera.react-intl';

class WeeklyActiveLearnerBanner extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired,
    learnerCounts: PropTypes.object.isRequired,
  };

  render() {
    const course = this.props.course;
    const courseName = course.name;
    const teachURL = `/teach/${course.slug}`;

    const weeklyActiveLearnerCount = TeachBannerUtils.getWeeklyActiveLearnerCount(this.props.learnerCounts);

    return (
      <div className="rc-WeeklyActiveLearnerBanner">
        <a href={teachURL}>
          <strong className="c-teach-banner-learner-count">
            <FormattedNumber value={weeklyActiveLearnerCount} /> learners
          </strong>
        </a>{' '}
        were active in <span className="c-teach-banner-course-name">{courseName}</span> in the past week. View more on
        the{' '}
        <a href={teachURL}>
          <strong>Course Dashboard.</strong>
        </a>
      </div>
    );
  }
}

export default WeeklyActiveLearnerBanner;

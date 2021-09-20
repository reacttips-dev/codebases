import AnalyticsMixin from 'mixins/analytics-mixin';
import CourseCard from './_course-card';
import { Heading } from '@udacity/veritas-components';
import { IconCourse } from '@udacity/veritas-icons';
import NoEnrollment from './_no-enrollment';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import styles from './setting-subscriptions.scss';

const mapStateToProps = function (state) {
  return {
    courses: state.courses,
  };
};

const mapDispatchToProps = actionsBinder('fetchSubscribedCourses');

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  cssModule(
    createReactClass({
      displayName: 'settings/setting-courses',

      propTypes: {
        courses: PropTypes.array,
      },

      contextTypes: {
        router: PropTypes.object,
      },

      mixins: [AnalyticsMixin],

      getDefaultProps() {
        return {
          courses: [],
        };
      },

      componentWillMount() {
        this.props.fetchSubscribedCourses();
      },

      _renderSubscribedCourses() {
        const { courses, fetchSubscribedCourses } = this.props;
        return _.map(courses, (course, idx) => (
          <li key={idx}>
            <CourseCard
              course={course}
              onCancelCourse={fetchSubscribedCourses}
            />
          </li>
        ));
      },

      render() {
        const { courses } = this.props;

        return (
          <section styleName="content-container">
            {courses.length === 0 ? (
              <NoEnrollment enrollmentType="course" />
            ) : (
              <div>
                <Heading size="h3" as="h1">
                  <IconCourse color="green" size="lg" title={__('Courses')} />{' '}
                  {__('Courses')}
                </Heading>
                <ul>{this._renderSubscribedCourses(courses)}</ul>
              </div>
            )}
          </section>
        );
      },
    }),
    styles
  )
);

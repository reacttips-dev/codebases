import { CareerServiceProvider } from 'components/career-services/_context';
import ClassroomPropTypes from 'components/prop-types';
import CourseHelper from 'helpers/course-helper';
import Layout from 'components/common/layout';
import LocationService from 'services/location-service';
import MappingHelper from 'helpers/mapping-helper';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import Redirect from 'components/nanodegrees/_redirect';
import Search from 'components/search';
import SettingsHelper from 'helpers/settings-helper';
import StateHelper from 'helpers/state-helper';
import UdacityHelper from 'helpers/udacity-helper';
import UiHelper from 'helpers/ui-helper';
import UserHelper from 'helpers/user-helper';
import { __ } from 'services/localization-service';
import { actionsBinder } from 'helpers/action-helper';
import { connect } from 'react-redux';

const mapStateToProps = function (state, ownProps) {
  const { courseKey } = ownProps.params;
  // Course is empty after CLEAR_CONTENT action, common when nav from /me
  const course = StateHelper.getPartAsCourse(state, courseKey) || {};
  const enrollment = StateHelper.getEnrollmentRecord(state, courseKey);
  const user = SettingsHelper.State.getUser(state);
  const lessons = StateHelper.getLessonsByCourseKey(state, courseKey) || [];
  const isCareerService = CourseHelper.isCareerService(courseKey);

  return {
    course,
    enrollment,
    user,
    lessons,
    isCareerService,
    isAuthenticated: UserHelper.State.isAuthenticated(state),
    isFetched: !_.isEmpty(course),
    isFetching: UiHelper.State.isFetchingCourse(state),
    project: StateHelper.getProjectByCourseKey(state, courseKey),
    projectByLessonKey: MappingHelper.createProjectByLessonKeyMap(
      state,
      _.map(lessons, 'key')
    ),
  };
};

const mapDispatchToProps = actionsBinder(
  'createErrorAlert',
  'fetchCourse',
  'updateCourseLastViewedAt',
  'upgradeContentVersion'
);

export class PaidCourseContainer extends React.Component {
  static displayName = 'paid-courses/paid-course-container';

  static propTypes = {
    createErrorAlert: PropTypes.func.isRequired,
    course: ClassroomPropTypes.course,
    enrollment: ClassroomPropTypes.enrollment,
    fetchCourse: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    isCareerService: PropTypes.bool.isRequired,
    isFetched: PropTypes.bool,
    isFetching: PropTypes.bool,
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson),
    params: PropTypes.shape({
      courseKey: PropTypes.string,
    }),
    project: ClassroomPropTypes.project,
    projectByLessonKey: PropTypes.objectOf(ClassroomPropTypes.project),
    updateCourseLastViewedAt: PropTypes.func.isRequired,
    user: PropTypes.object,
    upgradeContentVersion: PropTypes.func.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  static childContextTypes = {
    course: ClassroomPropTypes.course,
    root: ClassroomPropTypes.node,
    project: ClassroomPropTypes.project,
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson),
    projectByLessonKey: PropTypes.objectOf(ClassroomPropTypes.project),
  };

  getChildContext() {
    const { course, lessons, project, projectByLessonKey } = this.props;
    return {
      course,
      lessons,
      project,
      projectByLessonKey,
      root: course,
    };
  }

  componentDidMount() {
    const { enrollment } = this.props;
    this._refreshCourse(this.props);
    if (enrollment && enrollment.id) {
      this.props.upgradeContentVersion(enrollment.id);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      params: { courseKey },
    } = this.props;
    const {
      params: { courseKey: prevCourseKey },
    } = prevProps;

    if (courseKey !== prevCourseKey) {
      this._refreshCourse(this.props);
    }
  }

  _refreshCourse = () => {
    const { courseKey } = this.props.params;
    let { contentVersion, contentLocale } = _.get(
      this.props,
      'location.query',
      {}
    );
    contentVersion =
      contentVersion || _.get(this.props.enrollment, 'rootNode.version');
    contentLocale =
      contentLocale || _.get(this.props.enrollment, 'rootNode.locale');

    this.props
      .fetchCourse(courseKey, contentVersion, contentLocale, true)
      .catch((apiError) => {
        if (apiError.status === 403) {
          LocationService.redirectTo(UdacityHelper.courseUrl(courseKey));
        } else {
          this.context.router.push({
            state: { errorType: '404' },
            pathname: '/nodeNotFound',
          });
        }
      });

    if (this.props.isAuthenticated && this.props.user) {
      const enrolledCourse = _.find(this.props.user.courses, {
        key: courseKey,
      });

      if (_.isEmpty(enrolledCourse)) {
        if (CourseHelper.requiresEnrollmentToView(courseKey)) {
          this.props.createErrorAlert(
            __('This course is only for enrolled students.')
          );
          this.context.router.replace('/me');
        }
      } else {
        this.props.updateCourseLastViewedAt({
          courseKey,
          courseId: enrolledCourse.id,
          lastViewedAt: new Date(),
        });
      }
    }
  };

  _renderChildren() {
    const { course, params, user } = this.props;
    const { children, ...rest } = this.props;
    return (
      <div>
        <Search root={course} params={params} />
        <Redirect user={user} program={course} isNDHomeEnabled={false} />
        {children && React.cloneElement(children, rest)}
      </div>
    );
  }

  render() {
    const { isFetching, isFetched, course, isCareerService } = this.props;
    return (
      <CareerServiceProvider value={isCareerService}>
        <div data-test="course-container">
          {isFetching || !isFetched ? (
            <Layout busy documentTitle={NodeHelper.getTitle(course)} />
          ) : (
            this._renderChildren()
          )}
        </div>
      </CareerServiceProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaidCourseContainer);

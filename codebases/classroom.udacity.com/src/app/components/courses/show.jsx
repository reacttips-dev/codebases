import ClassroomPropTypes from 'components/prop-types';
import CourseHelper from 'helpers/course-helper';
import Header from './_header';
import Layout from 'components/common/layout';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import Syllabus from './_syllabus';
import { connect } from 'react-redux';

const mapStateToProps = (state, ownProps) => {
  const { course, enrollment } = ownProps;
  const lastViewedLesson = _.isEmpty(course)
    ? null
    : CourseHelper.State.getLastViewedLesson(state, course) ||
      _.first(ownProps.lessons);
  const isReadyForGraduation =
    course.semantic_type === 'Part' &&
    _.get(enrollment, 'is_ready_for_graduation', false);
  return { lastViewedLesson, isReadyForGraduation };
};

class ShowCourse extends React.Component {
  static displayName = 'courses/show';

  static propTypes = {
    course: ClassroomPropTypes.course.isRequired,
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson).isRequired,
    projectByLessonKey: PropTypes.objectOf(ClassroomPropTypes.project)
      .isRequired,
    project: ClassroomPropTypes.project,
    lastViewedLesson: ClassroomPropTypes.lesson,
  };

  render() {
    const {
      lastViewedLesson,
      lessons,
      project,
      projectByLessonKey,
      course,
      isReadyForGraduation,
    } = this.props;

    return (
      <Layout
        documentTitle={NodeHelper.getTitle(course)}
        header={
          <Header
            lastViewedLesson={lastViewedLesson}
            lessons={lessons}
            isReadyForGraduation={isReadyForGraduation}
          />
        }
      >
        <Syllabus
          lessons={lessons}
          project={project}
          projectByLessonKey={projectByLessonKey}
        />
      </Layout>
    );
  }
}

export default connect(mapStateToProps)(ShowCourse);

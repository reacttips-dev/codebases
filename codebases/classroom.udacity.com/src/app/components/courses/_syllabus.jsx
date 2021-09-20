import ClassroomPropTypes from 'components/prop-types';
import LessonCard from 'components/common/lesson-card';
import LessonList from 'components/common/lesson-list';
import PropTypes from 'prop-types';
import RouteHelper from 'helpers/route-helper';
import SemanticTypes from 'constants/semantic-types';
import styles from './_syllabus.scss';
import { trackInitialPageLoad } from 'helpers/performance-helper';

export function renderLessonCardWithAd({
  defaultExpanded,
  disabled,
  lesson,
  onLessonClick,
  path,
  project,
  lab,
  tag,
}) {
  return (
    <div>
      <LessonCard
        defaultExpanded={defaultExpanded}
        disabled={disabled}
        lesson={lesson}
        onLessonClick={onLessonClick}
        path={path}
        project={project}
        lab={lab}
        tag={tag}
      />
    </div>
  );
}

@cssModule(styles)
export default class Syllabus extends React.Component {
  static displayName = 'courses/_syllabus';

  static propTypes = {
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson).isRequired,
    project: ClassroomPropTypes.project,
    projectByLessonKey: PropTypes.objectOf(ClassroomPropTypes.project)
      .isRequired,
  };

  static contextTypes = {
    course: ClassroomPropTypes.course.isRequired,
  };

  componentDidMount() {
    trackInitialPageLoad('course-syllabus');
  }

  _getLessons() {
    const { lessons, project } = this.props;

    return _.chain(lessons).concat(project).compact().value();
  }

  _getLessonPaths() {
    const { lessons } = this.props;
    const { course } = this.context;

    return _.chain(lessons)
      .keyBy('key')
      .mapValues((lesson) => {
        return SemanticTypes.isPart(course)
          ? RouteHelper.paidCourseConceptPath({
              courseKey: course.key,
              lessonKey: lesson.key,
              conceptKey: 'last-viewed',
            })
          : RouteHelper.courseConceptPath({
              courseKey: course.key,
              lessonKey: lesson.key,
              conceptKey: 'last-viewed',
            });
      })
      .value();
  }

  _getLessonAndProjectPaths() {
    const { project } = this.props;
    const { course } = this.context;

    if (project) {
      return {
        ...this._getLessonPaths(),
        [project.key]: SemanticTypes.isPart(course)
          ? RouteHelper.paidCourseProjectPath({
              courseKey: course.key,
            })
          : RouteHelper.courseProjectPath({
              courseKey: course.key,
            }),
      };
    } else {
      return this._getLessonPaths();
    }
  }

  _getProjectByLessonKey() {
    const { project, projectByLessonKey } = this.props;
    if (project) {
      return {
        ...projectByLessonKey,
        [project.key]: project,
      };
    } else {
      return projectByLessonKey;
    }
  }

  render() {
    return (
      <div>
        <div data-test="course-syllabus" styleName="container">
          <LessonList
            lessons={this._getLessons()}
            pathByLessonKey={this._getLessonAndProjectPaths()}
            projectByLessonKey={this._getProjectByLessonKey()}
            enableScrollIntoView={false}
            renderLesson={renderLessonCardWithAd}
          />
        </div>
      </div>
    );
  }
}

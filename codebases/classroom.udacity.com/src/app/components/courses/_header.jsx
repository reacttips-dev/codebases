import ClassroomPropTypes from 'components/prop-types';
import DeadlineBar from 'components/common/deadline-bar';
import { GraduationInfoHeader } from 'components/common/overview-header';
import { LessonInfoHeader } from 'components/common/overview-header';
import { Link } from '@udacity/veritas-components';
import NodeHelper from 'helpers/node-helper';
import PropTypes from 'prop-types';
import { __ } from 'services/localization-service';
import { lastViewedLessonRoute } from './_helper';
import withHeaderCollapsed from 'decorators/header-collapsed';

export class Header extends React.Component {
  static displayName = 'courses/_header';

  static propTypes = {
    isHeaderCollapsed: PropTypes.bool.isRequired,
    lastViewedLesson: ClassroomPropTypes.lesson.isRequired,
    lessons: PropTypes.arrayOf(ClassroomPropTypes.lesson).isRequired,
  };

  static contextTypes = {
    course: ClassroomPropTypes.course.isRequired,
    project: ClassroomPropTypes.project,
  };

  render() {
    const {
      isHeaderCollapsed,
      lastViewedLesson,
      lessons,
      isReadyForGraduation,
    } = this.props;
    const { course, project } = this.context;

    const route = lastViewedLessonRoute(course, lastViewedLesson);
    const lessonStarted = !!NodeHelper.getCompletionPercentage(
      lastViewedLesson
    );

    const latestActivityText = (
      <Link href={route}>
        {__('<%= prefix %>: Lesson <%= lessonNumber %> - <%= lessonTitle %>', {
          prefix: lessonStarted ? 'Latest Activity' : 'Start',
          lessonNumber: NodeHelper.getPosition(lessons, lastViewedLesson) + 1,
          lessonTitle: lastViewedLesson.title,
        })}
      </Link>
    );

    // NOTE: It's a little hacky that we're using the deadline bar
    // to show the link to the last-viewed lesson, but this is due
    // to a design difference between course headers and ND headers.
    const deadlineBar = (
      <DeadlineBar
        text={latestActivityText}
        projects={project ? [project] : []}
      />
    );

    return isReadyForGraduation ? (
      <GraduationInfoHeader nanodegree={course} />
    ) : (
      <div data-test="course-header">
        <LessonInfoHeader
          lastViewedLesson={lastViewedLesson}
          lessons={lessons}
          deadlineBar={deadlineBar}
          isHeaderCollapsed={isHeaderCollapsed}
        />
      </div>
    );
  }
}

export default withHeaderCollapsed(Header);

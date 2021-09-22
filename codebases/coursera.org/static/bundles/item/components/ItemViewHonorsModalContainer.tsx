import PropTypes from 'prop-types';
import React from 'react';
import { getWeekUrl } from 'bundles/ondemand/utils/url';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import { setLessonSkipped } from 'bundles/ondemand/actions/HonorsUserPreferencesActions';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import HonorsContentModal from 'bundles/ondemand/components/HonorsContentModal';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import waitForStores from 'bundles/phoenix/lib/waitForStores';
import user from 'js/lib/user';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Lesson from 'pages/open-course/common/models/lesson';
import { HONORS_TRACK } from 'pages/open-course/common/models/tracks';

/*
 * Container for the logic for the honors content modal inside the item view.
 */
class ItemViewHonorsModalContainer extends React.Component {
  static propTypes = {
    courseRootPath: PropTypes.string.isRequired,
    lesson: PropTypes.instanceOf(Lesson).isRequired,
    hasUserSkippedHonorsModal: PropTypes.bool,
    hasUserSkippedLesson: PropTypes.bool,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    showHonorsModal:
      user.isAuthenticatedUser() &&
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'hasUserSkippedLesson' does not exist on ... Remove this comment to see the full error message
      !this.props.hasUserSkippedLesson &&
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'hasUserSkippedHonorsModal' does not exis... Remove this comment to see the full error message
      !this.props.hasUserSkippedHonorsModal &&
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lesson' does not exist on type 'Readonly... Remove this comment to see the full error message
      this.props.lesson.getTrackId() === HONORS_TRACK,
  };

  onClick = () => {
    this.context.executeAction(setLessonSkipped, {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'lesson' does not exist on type 'Readonly... Remove this comment to see the full error message
      lessonId: this.props.lesson.getId(),
      skipped: true,
    });
    this.setState({
      showHonorsModal: false,
    });
  };

  onClickLeave = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'courseRootPath' does not exist on type '... Remove this comment to see the full error message
    const { courseRootPath, currentWeek } = this.props;
    this.context.router.push(getWeekUrl(courseRootPath, currentWeek));
  };

  render() {
    return this.state.showHonorsModal ? (
      <HonorsContentModal onClose={this.onClick} onContinue={this.onClick} onLeave={this.onClickLeave} />
    ) : null;
  }
}

export default waitForStores(
  ItemViewHonorsModalContainer,
  ['HonorsUserPreferencesStore', 'CourseStore', 'CourseScheduleStore'],
  ({ HonorsUserPreferencesStore, CourseStore, CourseScheduleStore }: $TSFixMe, { lesson }: $TSFixMe) => {
    const courseId = CourseStore.getCourseId();

    return {
      courseRootPath: CourseStore.getCourseRootPath(),
      currentWeek: CourseScheduleStore.getWeekForModuleId(lesson.getModule().getId()),
      hasUserSkippedHonorsModal: HonorsUserPreferencesStore.hasUserSkippedHonorsModalForCourseId(courseId),
      hasUserSkippedLesson: HonorsUserPreferencesStore.getLessonSkipped(lesson.getId()),
    };
  }
);

export const BaseComp = ItemViewHonorsModalContainer;

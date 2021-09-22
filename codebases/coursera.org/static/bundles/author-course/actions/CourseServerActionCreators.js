/**
 * Notify dispatcher of given server actions.
 */

import CourseDispatcher from 'bundles/author-course/CourseDispatcher';

import { Actions } from 'bundles/author-course/constants/CourseConstants';
import CourseStore from 'bundles/author-course/stores/CourseStore';

const CourseServerActionCreators = {
  receiveCourse(data) {
    CourseDispatcher.handleServerAction({
      type: Actions.RECEIVE_COURSE,
      courseId: data.id,
      course: data.course,
      metaData: data.metadata,
    });
  },

  savedCourse(data) {
    CourseDispatcher.handleServerAction({
      type: Actions.SAVED_COURSE,
      course: data.course,
      metaData: data.metadata,
    });
  },

  publishedCourse(data) {
    CourseDispatcher.handleServerAction({
      type: Actions.PUBLISHED_COURSE,
      course: data.course,
      metaData: data.metadata,
    });
  },

  createdItem(moduleIndex, lessonIndex, item) {
    CourseDispatcher.handleServerAction({
      type: Actions.CREATED_ITEM,
      item,
      moduleIndex,
      lessonIndex,
    });
  },

  receiveSaveCourseError(error) {
    CourseDispatcher.handleServerAction({
      type: Actions.RECEIVE_SAVE_ERROR,
      error,
    });
  },

  receiveConflictCourseError(error) {
    CourseDispatcher.handleServerAction({
      type: Actions.RECEIVE_CONFLICT_ERROR,
      error,
    });
  },
};

export default CourseServerActionCreators;

export const {
  receiveCourse,
  savedCourse,
  publishedCourse,
  createdItem,
  receiveSaveCourseError,
  receiveConflictCourseError,
} = CourseServerActionCreators;

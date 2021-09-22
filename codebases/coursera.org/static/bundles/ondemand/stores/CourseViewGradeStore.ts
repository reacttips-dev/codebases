import _ from 'lodash';
import BaseStore from 'vendor/cnpm/fluxible.v0-4/addons/BaseStore';
import { HONORS_TRACK } from 'pages/open-course/common/models/tracks';
import type { TrackId } from 'pages/open-course/common/models/tracks';
import CourseViewGrade from 'pages/open-course/common/models/courseViewGrade';
// TODO: Migrate off of Backbone
// eslint-disable-next-line no-restricted-imports
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import type ItemGrade from 'pages/open-course/common/models/itemGrade';
import type ItemGroupGrade from 'pages/open-course/common/models/itemGroupGrade';

import { roundGradeValue } from 'bundles/course-home/utils/numberFormat';
import { GradedAssignmentGroupGrade } from 'bundles/learner-progress/types/GradedAssignmentGroup';

const SERIALIZED_PROPS: Array<keyof CourseViewGradeStore$DehydratedState> = ['rawCourseViewGrade'];

type CourseViewGradeStore$DehydratedState = {
  rawCourseViewGrade: any;
};

type CourseViewGradeType = typeof CourseViewGrade;
type RawCourseViewGrade = any;
type ItemOutcomeOverrides = any;

class CourseViewGradeStore extends BaseStore {
  static storeName = 'CourseViewGradeStore';

  static handlers = {
    LOAD_COURSE_VIEW_GRADE: 'handleLoadCourseViewGrade',
  };

  handleLoadCourseViewGrade(rawCourseViewGrade: any) {
    this.rawCourseViewGrade = rawCourseViewGrade;
    this.courseViewGrade = new CourseViewGrade(rawCourseViewGrade);
    this.emitChange();
  }

  courseViewGrade: CourseViewGradeType;

  rawCourseViewGrade: RawCourseViewGrade;

  dehydrate(): CourseViewGradeStore$DehydratedState {
    return _.pick(this, ...SERIALIZED_PROPS);
  }

  rehydrate(state: CourseViewGradeStore$DehydratedState) {
    Object.assign(this, _.pick(state, ...SERIALIZED_PROPS));
    this.courseViewGrade = new CourseViewGrade(this.rawCourseViewGrade);
  }

  hasLoaded(): boolean {
    return !!this.courseViewGrade;
  }

  getCourseViewGrade(): CourseViewGradeType {
    return this.courseViewGrade;
  }

  isPassable(): boolean {
    const courseViewGrade = this.getCourseViewGrade();
    return !!courseViewGrade && courseViewGrade.isPassable();
  }

  honorsTrackEnabled(): boolean {
    const courseViewGrade = this.getCourseViewGrade();
    return !!courseViewGrade && !!courseViewGrade.getTrackAttainment(HONORS_TRACK);
  }

  /**
   * @returns {bool} True if the learner has passed the course, regardless of verification status.
   */
  hasPassedCourseUnverified(): boolean {
    const courseViewGrade = this.getCourseViewGrade();
    return !!courseViewGrade && courseViewGrade.hasPassed();
  }

  /**
   * @returns {bool} True if the learner has passed the course with verification.
   */
  hasPassedCourseWithVerification(): boolean {
    const courseViewGrade = this.getCourseViewGrade();
    return !!courseViewGrade && courseViewGrade.hasPassedCourseWithVerification();
  }

  /**
   * @returns {bool} True if the learner has passed the given track of the course with verification.
   */
  hasPassedTrackWithVerification(trackId: TrackId): boolean {
    const courseViewGrade = this.getCourseViewGrade();
    return !!courseViewGrade && courseViewGrade.hasPassedTrack(trackId);
  }

  /**
   * @returns {bool} True if the learner has passed the given track, regardless of verification status.
   */
  hasPassedTrackUnverified(trackId: TrackId): boolean {
    const courseViewGrade = this.getCourseViewGrade();
    return !!courseViewGrade && courseViewGrade.hasPassedTrack(trackId);
  }

  /**
   * @returns {Number} The user's final course grade, rounded to 1 decimal place (ex. 97.2%)
   */
  getFinalPercentCourseGrade(): number | string | undefined {
    const courseViewGrade = this.getCourseViewGrade();
    const percentCourseGrade: number | undefined = !!courseViewGrade && courseViewGrade.get('overallGrade');

    if (percentCourseGrade) {
      return roundGradeValue(percentCourseGrade);
    }

    return undefined;
  }

  isItemPassed(itemId: string): boolean {
    const itemGrade = this.getItemGrade(itemId);
    return !!itemGrade && itemGrade.isPassing();
  }

  getItemGrade(itemId: string): typeof ItemGrade {
    const courseViewGrade = this.getCourseViewGrade();
    if (courseViewGrade) {
      return courseViewGrade.getItemGrade(itemId);
    }

    return undefined;
  }

  isItemGroupPassed(itemGroupId: string): boolean {
    const itemGroupGrade = this.getItemGroupGrade(itemGroupId);
    return !!itemGroupGrade && itemGroupGrade.isPassing;
  }

  getItemGroupOverallPassedCount(itemGroupId: string): number {
    const itemGroupGrade = this.getItemGroupGrade(itemGroupId);

    if (itemGroupGrade) {
      return itemGroupGrade.overallPassedCount;
    }

    return 0;
  }

  getItemGroupGrade(itemGroupId: string): ItemGroupGrade | undefined {
    const courseViewGrade = this.getCourseViewGrade();
    if (courseViewGrade) {
      return courseViewGrade.getItemGroupGrade(itemGroupId);
    }

    return undefined;
  }

  getGradedAssignmentGroupGrades(): { [id: string]: GradedAssignmentGroupGrade } | undefined {
    const courseViewGrade = this.getCourseViewGrade();
    if (courseViewGrade) {
      return courseViewGrade.get('gradedAssignmentGroups');
    }

    return undefined;
  }

  getRelativePassingState(itemId: string): any {
    const itemGrade = this.getItemGrade(itemId);
    return !!itemGrade && itemGrade.getRelativePassingState();
  }

  getItemOutcomeOverrides(): ItemOutcomeOverrides {
    const courseViewGrade = this.getCourseViewGrade();
    if (courseViewGrade && courseViewGrade.get('itemOutcomeOverrides')) {
      return courseViewGrade.get('itemOutcomeOverrides');
    }

    return {};
  }
}

export default CourseViewGradeStore;

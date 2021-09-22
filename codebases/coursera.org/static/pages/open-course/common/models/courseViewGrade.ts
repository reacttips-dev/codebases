/**
 * Contains the CourseViewGrade data returned by the onDemandCourseViewGrades.v1 API.
 */

import Backbone from 'backbone';

import _ from 'underscore';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { memoizedCourseViewGradeDataPromise } from 'pages/open-course/common/data/courseViewGrade';
// TODO: Migrate off of Backbone
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
// eslint-disable-next-line no-restricted-imports
import ItemGrade from 'pages/open-course/common/models/itemGrade';
import ItemGroupGrade from 'pages/open-course/common/models/itemGroupGrade';
import { CORE_TRACK, TrackId } from 'pages/open-course/common/models/tracks';

type ItemGradeCache = { [key: string]: ItemGrade };

const CourseViewGrade = Backbone.Model.extend({
  initialize(): void {
    // Caches models that we return for individual item grades.
    this.itemGradesCache = {} as ItemGradeCache;

    _(this.get('itemGrades') as ItemGradeCache).each((itemGrade: ItemGrade, itemId: string) => {
      this.itemGradesCache[itemId] = new ItemGrade(itemGrade);
    });
  },

  refresh(): void {
    memoizedCourseViewGradeDataPromise
      .force(this.get('id'))
      .then(this.set.bind(this))
      .then(this.updateItemGradesCache.bind(this))
      .done();
  },

  isPassable(): boolean {
    return this.get('passingState') !== 'notPassable';
  },

  hasPassed(): boolean {
    return this._hasPassed(this.get('passingState'));
  },

  _hasPassed(passingState: string): boolean {
    return _(['passed', 'verifiedPassed']).contains(passingState);
  },

  hasPassedTrack(trackId: TrackId): boolean {
    if (this.get('trackAttainments')) {
      return (
        this.get('trackAttainments')[trackId] && this._hasPassed(this.get('trackAttainments')[trackId].passingState)
      );
    }

    return false;
  },

  hasPassedTrackWithVerification(trackId: TrackId): boolean {
    if (this.get('trackAttainments')) {
      return (
        this.get('trackAttainments')[trackId] && this.get('trackAttainments')[trackId].passingState === 'verifiedPassed'
      );
    }

    return false;
  },

  hasPassedCourseWithVerification(): boolean {
    return this.get('passingState') === 'verifiedPassed';
  },

  /**
   * Get an `ItemGrade` model for `itemId`. You are guaranteed to get the same model every time you call this with
   * the same `itemId`, and the model that you get will update whenever the item's grade changes.
   */
  getItemGrade(itemId: string) {
    if (!this.itemGradesCache[itemId]) {
      this.itemGradesCache[itemId] = new ItemGrade(this.get('itemGrades')[itemId]);
    }

    return this.itemGradesCache[itemId];
  },

  getItemGroupGrade(itemGroupId: string) {
    return new ItemGroupGrade(this.get('itemGroupGrades')[itemGroupId] || {});
  },

  getCorePassedCount(): number | undefined | null {
    // This isn't a SFC; it's a Backbone model
    // eslint-disable-next-line react/no-this-in-sfc
    const coreAttainment = this.getTrackAttainment(CORE_TRACK);
    if (coreAttainment) {
      return coreAttainment.overallPassedCount;
    }

    return null;
  },

  /**
   * Call this if `this.get('itemGrades')` has changed. This will update all the item grades in
   * `this.itemGradesCache` to correspond with the updated information.
   */
  updateItemGradesCache() {
    _(this.itemGradesCache as ItemGradeCache).each((itemGrade: ItemGrade, itemId: string) => {
      itemGrade.set(this.get('itemGrades')[itemId]);
    });
  },

  getItemOutcomeOverrides() {
    if (this.get('itemOutcomeOverrides')) {
      return this.get('itemOutcomeOverrides');
    }
    return {};
  },

  getTrackAttainment(trackId: TrackId): any | undefined | null {
    // This isn't a SFC; it's a Backbone model
    // eslint-disable-next-line react/no-this-in-sfc
    if (this.get('trackAttainments')) {
      // This isn't a SFC; it's a Backbone model
      // eslint-disable-next-line react/no-this-in-sfc
      return this.get('trackAttainments')[trackId];
    }

    return null;
  },
});

export default CourseViewGrade;

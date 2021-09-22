/**
 * Contains the CourseGrade data returned by the onDemandCourseGrades.v1 API.
 */

import Backbone from 'backbone';

import _ from 'underscore';
import { memoizedCourseGradeDataPromise } from 'pages/open-course/common/data/courseGrade';
import ItemGrade from 'pages/open-course/common/models/itemGrade';

const CourseGrade = Backbone.Model.extend({
  initialize() {
    // Caches models that we return for individual item grades.
    this.itemGradesCache = {};

    _(this.get('itemGrades')).each(
      function (itemGrade, itemId) {
        this.itemGradesCache[itemId] = new ItemGrade(itemGrade);
      }.bind(this)
    );
  },

  refresh() {
    memoizedCourseGradeDataPromise
      .force(this.get('id'))
      .then(this.set.bind(this))
      .then(this.updateItemGradesCache.bind(this))
      .done();
  },

  isPassable() {
    return this.get('passingState') !== 'notPassable';
  },

  hasPassed() {
    return _(['passed', 'verifiedPassed']).contains(this.get('passingState'));
  },

  hasPassedWithVerification() {
    return this.get('passingState') === 'verifiedPassed';
  },

  getFractionPassed() {
    return this.get('overallOutcome').passedItemsCount / this.get('passableItemsCount');
  },

  /**
   * Get an `ItemGrade` model for `itemId`. You are guaranteed to get the same model every time you call this with
   * the same `itemId`, and the model that you get will update whenever the item's grade changes.
   */
  getItemGrade(itemId) {
    if (!this.itemGradesCache[itemId]) {
      this.itemGradesCache[itemId] = new ItemGrade(this.get('itemGrades')[itemId]);
    }

    return this.itemGradesCache[itemId];
  },

  /**
   * Call this if `this.get('itemGrades')` has changed. This will update all the item grades in
   * `this.itemGradesCache` to correspond with the updated information.
   */
  updateItemGradesCache() {
    _(this.itemGradesCache).each(
      function (itemGrade, itemId) {
        itemGrade.set(this.get('itemGrades')[itemId]);
      }.bind(this)
    );
  },

  getItemOutcomeOverrides() {
    if (this.get('itemOutcomeOverrides') && this.get('itemOutcomeOverrides').itemOutcomeOverrides) {
      return this.get('itemOutcomeOverrides').itemOutcomeOverrides;
    }
    return {};
  },
});

export default CourseGrade;

/* eslint-disable no-param-reassign */
/*
 * This file represents ownership for an on-demand specialization.
 * A learner owns a specialization if he/she owns (has paid/finaid for) all the courses in that specialization.
 */
import Backbone from 'backbone';

import _ from 'underscore';

const S12nOwnership = Backbone.Model.extend({
  defaults: {
    owns: false,
    productType: 'Specialization',
    pendingConfirmation: false,
    isRefundable: false,
    optedOutOfVerification: false,
  },

  initialize(options: $TSFixMe) {
    options = options || {};
    if (!this.has('s12nCourseOwnerships')) {
      this.set('s12nCourseOwnerships', options.s12nCourseOwnerships);
    }
  },

  ownsCourse(courseId: $TSFixMe) {
    return this.get('s12nCourseOwnerships').owns(courseId);
  },

  getOwnedCourseIds() {
    return this.get('s12nCourseOwnerships')
      .filter((courseOwnership: $TSFixMe) => courseOwnership.get('owns'))
      .map((ownership: $TSFixMe) => ownership.get('courseId'));
  },

  /**
   * Get the unowned course ids in this specialization.
   * @type {Object}
   * @param {Array.<string>} [courseIds] IDs of all of the courses in the specialization. If course ids
   *   is not passed in, then it defaults to checking against the whole specialization.
   */
  getUnownedCourseIds(courseIds: $TSFixMe) {
    if (courseIds) {
      const ownedCourseIds = this.getOwnedCourseIds();
      return _(courseIds).without(ownedCourseIds);
    } else {
      return this.get('s12nCourseOwnerships')
        .filter((courseOwnership: $TSFixMe) => !courseOwnership.get('owns'))
        .map((courseOwnership: $TSFixMe) => courseOwnership.get('courseId'));
    }
  },

  /**
   * @returns {bool} True if the learner has purchased every course in the s12n, false otherwise
   */
  hasBulkPaid() {
    return this.get('owns');
  },
});

export default S12nOwnership;

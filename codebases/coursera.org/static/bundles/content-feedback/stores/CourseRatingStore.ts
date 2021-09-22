/**
 * Store for managing item-level feedback.
 * @type {FluxibleStore}
 */
import _ from 'underscore';

// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';
import CourseRatings from 'bundles/content-feedback/models/CourseRatings';

const CourseRatingStore = createStore({
  storeName: 'CourseRatingStore',

  initialize() {
    this.myRatingFeedback = null;
    this.isLoadingReviews = false;
    this.courseRatings = new CourseRatings();
  },

  getMyRatingFeedback() {
    return this.myRatingFeedback;
  },

  getReviewCollection() {
    return this.courseRatings.reviewCollection;
  },

  getBranchId() {
    return this.courseRatings.branchId;
  },

  getRatingValue() {
    return this.courseRatings.ratingValue;
  },

  getLearnerAudience() {
    return this.courseRatings.learnerAudience;
  },

  getCourseRatingStats() {
    return this.courseRatings.stats;
  },

  getIsLoadingReviews() {
    return this.isLoadingReviews;
  },
});

CourseRatingStore.handlers = {
  GET_REVIEWS({ reviewCollection }: $TSFixMe, actionName: $TSFixMe) {
    this.isLoadingReviews = true;
    this.emitChange();
  },

  RECEIVE_REVIEWS({ feedbacks, totalCount }: $TSFixMe, actionName: $TSFixMe) {
    this.isLoadingReviews = false;
    this.courseRatings.appendReviews(feedbacks, totalCount);
    this.emitChange();
  },

  DELETE_FEEDBACK(feedbackId: $TSFixMe) {
    this.courseRatings.deleteReview(feedbackId);
    this.emitChange();
  },

  FILTER_REVIEWS({ ratingValue }: $TSFixMe, actionName: $TSFixMe) {
    this.courseRatings.setRatingValue(ratingValue);
    this.emitChange();
  },

  RECEIVE_COURSE_RATING_STATS({ courseRatingStats }: $TSFixMe, actionName: $TSFixMe) {
    this.courseRatings.setStats(courseRatingStats);
    this.emitChange();
  },

  FILTER_RATINGS({ learnerAudience }: $TSFixMe, actionName: $TSFixMe) {
    this.courseRatings.setLearnerAudience(learnerAudience);
    this.emitChange();
  },

  RECEIVE_MY_RATING({ ratingFeedback }: $TSFixMe, actionName: $TSFixMe) {
    this.myRatingFeedback = ratingFeedback;
    this.emitChange();
  },

  SET_FEEDBACK_BRANCH_ID({ branchId }: $TSFixMe, actionName: $TSFixMe) {
    this.courseRatings.setBranchId(branchId);
    this.emitChange();
  },
};

export default CourseRatingStore;

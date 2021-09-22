/**
 * Store for managing programming assignment data.
 * @type {FluxibleStore}
 */
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'vend... Remove this comment to see the full error message
import createStore from 'vendor/cnpm/fluxible.v0-4/addons/createStore';

const ProgrammingGradingProblemsStore = createStore({
  storeName: 'ProgrammingGradingProblemsStore',

  initialize() {
    this.submittedParts = null;
    this.feedbacks = null;
  },

  getSubmittedParts() {
    return this.submittedParts;
  },

  getFeedbacks() {
    return this.feedbacks;
  },
});

ProgrammingGradingProblemsStore.handlers = {
  RECEIVED_PROGRAMMING_GRADING_SUBMITTED_PARTS(action: $TSFixMe, actionName: $TSFixMe) {
    this.submittedParts = action.submittedParts;
    this.emitChange();
  },

  RECEIVED_PROGRAMMING_GRADING_PART_FEEDBACKS(action: $TSFixMe, actionName: $TSFixMe) {
    this.feedbacks = action.feedbacks;
    this.emitChange();
  },

  RESET_PROGRAMMING_GRADING(action: $TSFixMe, actionName: $TSFixMe) {
    this.feedbacks = null;
    this.emitChange();
  },
};

export default ProgrammingGradingProblemsStore;

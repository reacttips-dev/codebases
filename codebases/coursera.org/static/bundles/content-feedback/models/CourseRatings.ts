import _ from 'underscore';
import getRatingValues from 'bundles/content-feedback/constants/RatingValues';
import getLearnerAudiences from 'bundles/content-feedback/constants/LearnerAudiences';
import RatingCollection from 'bundles/content-feedback/models/RatingCollection';
import { ALL_BRANCHES } from 'bundles/author-branches/constants';
/**
 * Course ratings and its associated filters.
 */
class CourseRatings {
  constructor() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ratingValue' does not exist on type 'Cou... Remove this comment to see the full error message
    this.ratingValue = _(getRatingValues()).find((ratingValue) => ratingValue.value === -1);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'learnerAudience' does not exist on type ... Remove this comment to see the full error message
    this.learnerAudience = _(getLearnerAudiences()).find((learnerAudience) => learnerAudience.id === 'ALL_LEARNERS');
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'branchId' does not exist on type 'Course... Remove this comment to see the full error message
    this.branchId = ALL_BRANCHES;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statsMap' does not exist on type 'Course... Remove this comment to see the full error message
    this.statsMap = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reviewCollectionsMap' does not exist on ... Remove this comment to see the full error message
    this.reviewCollectionsMap = {};
    this.initMapsForBranchId(ALL_BRANCHES);
  }

  initMapsForBranchId(branchId: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statsMap' does not exist on type 'Course... Remove this comment to see the full error message
    this.statsMap[branchId] = {};
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reviewCollectionsMap' does not exist on ... Remove this comment to see the full error message
    this.reviewCollectionsMap[branchId] = {};
    _(getLearnerAudiences()).each((learnerAudience) => {
      const learnerAudienceId = learnerAudience.id;
      const reviewsForAudience = {};

      _(getRatingValues()).each((ratingValue) => {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        reviewsForAudience[ratingValue.value] = new RatingCollection();
      });

      // @ts-expect-error ts-migrate(2339) FIXME: Property 'statsMap' does not exist on type 'Course... Remove this comment to see the full error message
      this.statsMap[branchId][learnerAudienceId] = null;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'reviewCollectionsMap' does not exist on ... Remove this comment to see the full error message
      this.reviewCollectionsMap[branchId][learnerAudienceId] = reviewsForAudience;
    });
  }

  get reviewCollection() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reviewCollectionsMap' does not exist on ... Remove this comment to see the full error message
    return this.reviewCollectionsMap[this.branchId][this.learnerAudience.id][this.ratingValue.value];
  }

  get stats() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statsMap' does not exist on type 'Course... Remove this comment to see the full error message
    return this.statsMap[this.branchId][this.learnerAudience.id];
  }

  setBranchId(branchId: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'branchId' does not exist on type 'Course... Remove this comment to see the full error message
    this.branchId = branchId;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statsMap' does not exist on type 'Course... Remove this comment to see the full error message
    if (!this.statsMap[branchId]) {
      this.initMapsForBranchId(branchId);
    }
  }

  setRatingValue(ratingValue: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'ratingValue' does not exist on type 'Cou... Remove this comment to see the full error message
    this.ratingValue = ratingValue;
  }

  setLearnerAudience(learnerAudience: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'learnerAudience' does not exist on type ... Remove this comment to see the full error message
    this.learnerAudience = learnerAudience;
  }

  appendReviews(feedbacks: $TSFixMe, totalCount: $TSFixMe) {
    const { reviewCollection } = this;

    reviewCollection.appendPage(feedbacks);
    reviewCollection.setTotalCount(totalCount);
  }

  deleteReview(feedbackId: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'reviewCollectionsMap' does not exist on ... Remove this comment to see the full error message
    _(this.reviewCollectionsMap).each((collections) =>
      _(collections).each((reviewCollection) => {
        reviewCollection.models = _(reviewCollection.models).filter((model) => model.id !== feedbackId);
      })
    );
  }

  setStats(stats: $TSFixMe) {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'statsMap' does not exist on type 'Course... Remove this comment to see the full error message
    this.statsMap[this.branchId][this.learnerAudience.id] = stats;
  }
}

export default CourseRatings;

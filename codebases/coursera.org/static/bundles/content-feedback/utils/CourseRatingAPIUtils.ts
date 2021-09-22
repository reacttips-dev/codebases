import Q from 'q';
import _ from 'underscore';
import myFeedbackAPI from 'bundles/content-feedback/api/myFeedbackAPI';
import feedbackAPI from 'bundles/content-feedback/api/feedbackAPI';
import courseFeedbackCountsAPI from 'bundles/content-feedback/api/courseFeedbackCountsAPI';
import feedbackAdminAPI from 'bundles/content-feedback/api/feedbackAdminAPI';
import FeedbackTypes from 'bundles/content-feedback/constants/FeedbackTypes';
import getLearnerAudiences from 'bundles/content-feedback/constants/LearnerAudiences';
import URI from 'jsuri';
import { ALL_BRANCHES } from 'bundles/author-branches/constants';

/**
 * API interface for course-level ratings.
 * @type {Object}
 */
const CourseRatingAPIUtils = {
  getRatingStats(courseId: $TSFixMe, branchId: $TSFixMe, learnerAudience = getLearnerAudiences().AllLearners) {
    const uri = new URI()
      .addQueryParam('q', 'course')
      .addQueryParam('courseId', courseId)
      .addQueryParam('feedbackSystem', FeedbackTypes.Rating)
      .addQueryParam('ratingValues', '1,2,3,4,5')
      .addQueryParam('countBy', 'ratingValue');

    if (branchId !== ALL_BRANCHES) {
      uri.addQueryParam('courseBranchId', branchId);
    }

    if (learnerAudience.id === getLearnerAudiences().Completers.id) {
      uri.addQueryParam('courseCompleted', true);
    }

    return Q(courseFeedbackCountsAPI.get(uri.toString())).then((response) => response.elements[0].counts);
  },

  getReviews(
    courseId: $TSFixMe,
    branchId: $TSFixMe,
    learnerAudience: $TSFixMe,
    page: $TSFixMe,
    value: $TSFixMe,
    pageSize = 10
  ) {
    const uri = new URI()
      .addQueryParam('q', 'course')
      .addQueryParam('courseId', courseId)
      .addQueryParam('feedbackSystem', FeedbackTypes.Rating)
      .addQueryParam('ratingValues', value === -1 ? '1,2,3,4,5' : value)
      .addQueryParam('categories', 'generic')
      .addQueryParam('start', page * pageSize)
      .addQueryParam('limit', pageSize);

    if (branchId !== ALL_BRANCHES) {
      uri.addQueryParam('courseBranchId', branchId);
    }

    if (learnerAudience.id === getLearnerAudiences().Completers.id) {
      uri.addQueryParam('courseCompleted', true);
    }

    return Q(feedbackAPI.get(uri.toString())).then((response) => {
      const { elements, paging } = response;
      const { total, next } = paging;

      return {
        feedbacks: elements,
        totalCount: total,
        next,
      };
    });
  },

  getFeedback(courseId: $TSFixMe) {
    const uri = new URI().addQueryParam('q', 'course').addQueryParam('courseId', courseId);

    return Q(myFeedbackAPI.get(uri.toString())).then((response) => response.elements[0]);
  },

  multiGetStarFeedback(courseIds: $TSFixMe) {
    const batchSize = 20;
    const batchedIds = _(courseIds)
      .chain()
      // @ts-expect-error ts-migrate(2362) FIXME: The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
      .groupBy((id, index) => Math.floor(index / batchSize))
      .toArray()
      .value();

    const feedbackPromises = _(batchedIds).map((batch) => {
      const uri = new URI()
        .addQueryParam('q', 'byCourseAndFeedback')
        .addQueryParam('courseIds', batch.join(','))
        .addQueryParam('feedbackSystem', 'STAR');

      return Q(myFeedbackAPI.get(uri.toString())).then((response) => response.elements);
    });
    return Q.all(feedbackPromises).then((responses) => _(responses).flatten());
  },

  postFeedback(courseId: $TSFixMe, ratingFeedback: $TSFixMe) {
    const uri = new URI()
      .addQueryParam('action', 'submit')
      .addQueryParam('courseId', courseId)
      .addQueryParam('feedbackSystem', FeedbackTypes.Rating);

    return Q(
      myFeedbackAPI.post(uri.toString(), {
        data: ratingFeedback.toObject(),
      })
    );
  },

  deleteFeedback(feedbackId: $TSFixMe) {
    const uri = new URI().addQueryParam('action', 'hide').addQueryParam('feedbackId', feedbackId);

    return Q(feedbackAdminAPI.post(uri.toString()));
  },
};

export default CourseRatingAPIUtils;

export const {
  getRatingStats,
  getReviews,
  getFeedback,
  multiGetStarFeedback,
  postFeedback,
  deleteFeedback,
} = CourseRatingAPIUtils;

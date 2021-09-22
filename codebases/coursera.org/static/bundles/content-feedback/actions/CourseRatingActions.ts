import CourseRatingStats from 'bundles/content-feedback/models/CourseRatingStats';
import RatingFeedback from 'bundles/content-feedback/models/RatingFeedback';
import CourseRatingAPIUtils from 'bundles/content-feedback/utils/CourseRatingAPIUtils';

export const getCourseReviews = (
  actionContext: $TSFixMe,
  { courseId, branchId, reviewCollection, ratingValue, learnerAudience, isBranchChange = false }: $TSFixMe
) => {
  actionContext.dispatch('GET_REVIEWS', { reviewCollection });

  return CourseRatingAPIUtils.getReviews(
    courseId,
    branchId,
    learnerAudience,
    isBranchChange ? 0 : reviewCollection.page, // always start from page 0 on branch change
    ratingValue.value
  )
    .then((response) => {
      const { feedbacks, totalCount, next } = response;
      actionContext.dispatch('RECEIVE_REVIEWS', {
        reviewCollection,
        feedbacks,
        totalCount,
        next,
      });
    })
    .done();
};

export const getCourseRatingStats = (
  actionContext: $TSFixMe,
  { courseId, branchId, learnerAudience, totalCount, averageRating }: $TSFixMe
) => {
  return CourseRatingAPIUtils.getRatingStats(courseId, branchId, learnerAudience)
    .then((counts) => {
      let overrides = {};
      if (totalCount !== undefined && averageRating !== undefined) {
        overrides = { totalCount, averageRating };
      }
      const courseRatingStats = new CourseRatingStats(counts, overrides);
      actionContext.dispatch('RECEIVE_COURSE_RATING_STATS', {
        courseRatingStats,
      });
    })
    .done();
};

export const changeBranchId = (
  actionContext: $TSFixMe,
  { courseId, branchId, ratingValue, learnerAudience, reviewCollection }: $TSFixMe
) => {
  actionContext.dispatch('SET_FEEDBACK_BRANCH_ID', { branchId });
  actionContext.executeAction(getCourseReviews, {
    courseId,
    branchId,
    reviewCollection,
    ratingValue,
    learnerAudience,
    isBranchChange: true,
  });
  actionContext.executeAction(getCourseRatingStats, {
    courseId,
    branchId,
    learnerAudience,
  });
};

export const filterCourseReviews = (
  actionContext: $TSFixMe,
  { courseId, branchId, ratingValue, learnerAudience }: $TSFixMe
) => {
  const store = actionContext.getStore('CourseRatingStore');
  actionContext.dispatch('FILTER_REVIEWS', { ratingValue });

  // If collection is empty, fetch first page.
  const reviewCollection = store.getReviewCollection();

  if (reviewCollection.isEmpty()) {
    actionContext.executeAction(getCourseReviews, {
      courseId,
      branchId,
      reviewCollection,
      ratingValue,
      learnerAudience,
    });
  }
};

export const filterCourseRatings = (
  actionContext: $TSFixMe,
  { courseId, branchId, ratingValue, learnerAudience }: $TSFixMe
) => {
  const store = actionContext.getStore('CourseRatingStore');
  actionContext.dispatch('FILTER_RATINGS', { learnerAudience });

  // If collection is empty, fetch first page.
  const reviewCollection = store.getReviewCollection();
  const stats = store.getCourseRatingStats();

  if (reviewCollection.isEmpty()) {
    actionContext.executeAction(getCourseReviews, {
      courseId,
      branchId,
      reviewCollection,
      ratingValue,
      learnerAudience,
    });
  }

  if (!stats) {
    actionContext.executeAction(getCourseRatingStats, {
      courseId,
      branchId,
      learnerAudience,
    });
  }
};

export const receiveMyCourseRating = (actionContext: $TSFixMe, { ratingFeedback }: $TSFixMe) => {
  actionContext.dispatch('RECEIVE_MY_RATING', { ratingFeedback });
};

export const postMyCourseRating = (actionContext: $TSFixMe, { courseId, value, active, comment }: $TSFixMe) => {
  const ratingFeedback = new RatingFeedback(value, active, comment);

  actionContext.executeAction(receiveMyCourseRating, {
    ratingFeedback,
  });
  return CourseRatingAPIUtils.postFeedback(courseId, ratingFeedback);
};

export const deleteFeedback = (actionContext: $TSFixMe, feedbackId: $TSFixMe) => {
  return CourseRatingAPIUtils.deleteFeedback(feedbackId)
    .then(() => {
      actionContext.dispatch('DELETE_FEEDBACK', feedbackId);
    })
    .done();
};

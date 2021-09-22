import _ from 'underscore';
import FeedbackTypes from 'bundles/content-feedback/constants/FeedbackTypes';
import FlagFeedback from 'bundles/content-feedback/models/FlagFeedback';
import LikeFeedback from 'bundles/content-feedback/models/LikeFeedback';
import ItemFeedbackAPIUtils from 'bundles/content-feedback/utils/ItemFeedbackAPIUtils';

export const getItemFeedback = (actionContext: $TSFixMe, { courseId, itemId, subItemId }: $TSFixMe) => {
  return ItemFeedbackAPIUtils.getMyAll(courseId, itemId, subItemId).then((feedbacks) => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feedbackSystem' does not exist on type '... Remove this comment to see the full error message
    const like = _(feedbacks).find((feedback) => feedback.feedbackSystem === FeedbackTypes.Like);
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'feedbackSystem' does not exist on type '... Remove this comment to see the full error message
    const flag = _(feedbacks).find((feedback) => feedback.feedbackSystem === FeedbackTypes.Flag);

    let likeFeedback = null;
    let flagFeedback = null;

    if (like) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'LikeFeedback' is not assignable to type 'nul... Remove this comment to see the full error message
      likeFeedback = new LikeFeedback(like.rating.value, like.rating.active, like.comments.generic);
    }

    if (flag) {
      // @ts-expect-error ts-migrate(2322) FIXME: Type 'FlagFeedback' is not assignable to type 'nul... Remove this comment to see the full error message
      flagFeedback = new FlagFeedback(flag.rating.active, flag.comments);
    }

    actionContext.dispatch('RECEIVE_FEEDBACK', {
      likeFeedback,
      flagFeedback,
      itemId,
    });
  });
};

export const likeItem = (actionContext: $TSFixMe, { courseId, itemId, comment, subItemId }: $TSFixMe) => {
  const likeFeedback = new LikeFeedback(1, true, comment);
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  const dislikeFeedback = new LikeFeedback(0, false);

  actionContext.dispatch('RECEIVE_LIKE', { likeFeedback });
  // clear dislike for toggle effect
  actionContext.dispatch('RECEIVE_DISLIKE', { dislikeFeedback });

  return ItemFeedbackAPIUtils.postMyLike(courseId, itemId, likeFeedback, subItemId).done();
};

export const cancelLikeItem = (actionContext: $TSFixMe, { courseId, itemId, comment, subItemId }: $TSFixMe) => {
  const likeFeedback = new LikeFeedback(0, false, comment);

  actionContext.dispatch('RECEIVE_LIKE', { likeFeedback });
  return ItemFeedbackAPIUtils.postMyLike(courseId, itemId, likeFeedback, subItemId).done();
};

export const dislikeItem = (actionContext: $TSFixMe, { courseId, itemId, comment, subItemId }: $TSFixMe) => {
  const dislikeFeedback = new LikeFeedback(0, true, comment);
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
  const likeFeedback = new LikeFeedback(0, false);

  actionContext.dispatch('RECEIVE_DISLIKE', { dislikeFeedback });
  // clear like for toggle effect
  actionContext.dispatch('RECEIVE_LIKE', { likeFeedback });

  return ItemFeedbackAPIUtils.postMyLike(courseId, itemId, dislikeFeedback, subItemId).done();
};

export const cancelDislikeItem = (actionContext: $TSFixMe, { courseId, itemId, comment, subItemId }: $TSFixMe) => {
  const dislikeFeedback = new LikeFeedback(0, false, comment);

  actionContext.dispatch('RECEIVE_DISLIKE', { dislikeFeedback });
  return ItemFeedbackAPIUtils.postMyLike(courseId, itemId, dislikeFeedback, subItemId).done();
};

export const flagItem = (actionContext: $TSFixMe, { courseId, itemId, comments, active, subItemId }: $TSFixMe) => {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 7 arguments, but got 2.
  const flagFeedback = new FlagFeedback(active, comments);

  actionContext.dispatch('RECEIVE_FLAG', { flagFeedback });
  return ItemFeedbackAPIUtils.postMyFlag(courseId, itemId, flagFeedback, subItemId).done();
};

import Q from 'q';
import URI from 'jsuri';
import _ from 'underscore';
import myFeedbackAPI from 'bundles/content-feedback/api/myFeedbackAPI';
import feedbackAPI from 'bundles/content-feedback/api/feedbackAPI';
import itemFeedbackCountsAPI from 'bundles/content-feedback/api/itemFeedbackCountsAPI';
import itemFeedbackCommentCountsAPI from 'bundles/content-feedback/api/itemFeedbackCommentCountsAPI';
import feedbackAdminAPI from 'bundles/content-feedback/api/feedbackAdminAPI';
import * as ItemFeedbackUtils from 'bundles/content-feedback/utils/ItemFeedbackUtils';
import { statuses } from 'bundles/content-feedback/models/FlagFeedback';
import { Like, Flag } from 'bundles/content-feedback/constants/FeedbackTypes';
import { ALL_BRANCHES } from 'bundles/author-branches/constants';

const { UNRESOLVED, TODO, RESOLVED, ARCHIVED } = statuses;

/**
 * API interface for item-level content feedback.
 * @type {Object}
 */
const ItemFeedbackAPIUtils = {
  getFeedbackCount(
    branchId: $TSFixMe,
    feedbackSystem: $TSFixMe,
    ratingValues: $TSFixMe,
    categories: $TSFixMe,
    status: $TSFixMe,
    getCommentCounts: $TSFixMe
  ) {
    const uri = new URI()
      .addQueryParam('q', 'branch')
      .addQueryParam('courseBranchId', branchId)
      .addQueryParam('feedbackSystem', feedbackSystem)
      .addQueryParam('ratingValues', ratingValues)
      .addQueryParam('countBy', 'itemId');

    if (categories) {
      uri.addQueryParam('categories', categories);
    }

    if (status) {
      uri.addQueryParam('statuses', status);
    }

    if (getCommentCounts) {
      return Q(itemFeedbackCommentCountsAPI.get(uri.toString()));
    }

    return Q(itemFeedbackCountsAPI.get(uri.toString()));
  },

  get(branchId: $TSFixMe, isSuperuser: $TSFixMe) {
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'null' is not assignable to param... Remove this comment to see the full error message
    const flagCategories = ItemFeedbackUtils.getVisibleFlagCategories(null, isSuperuser);
    const flagCategoryIds = _(flagCategories).pluck('id').join(',');

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 6 arguments, but got 3.
    const dislikeCountRequest = this.getFeedbackCount(branchId, Like, 0);
    // @ts-expect-error ts-migrate(2554) FIXME: Expected 6 arguments, but got 3.
    const likeCountRequest = this.getFeedbackCount(branchId, Like, 1);

    const unresolvedFlagRequest = this.getFeedbackCount(branchId, Flag, 0, flagCategoryIds, UNRESOLVED, true);
    const todoFlagRequest = this.getFeedbackCount(branchId, Flag, 0, flagCategoryIds, TODO, true);

    return Q.all([dislikeCountRequest, likeCountRequest, unresolvedFlagRequest, todoFlagRequest]).spread(
      (dislikeResponse, likeResponse, unresolvedFlagResponse, todoFlagResponse) => {
        const feedbackCounts = {
          likes: likeResponse.elements[0].counts,
          dislikes: dislikeResponse.elements[0].counts,
          todoFlags: todoFlagResponse.elements[0].counts,
          unresolvedFlags: unresolvedFlagResponse.elements[0].counts,
        };

        const countMap = {};

        _(feedbackCounts).each((counts, key) => {
          _(counts).each((count, itemId) => {
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!countMap[itemId]) {
              // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              countMap[itemId] = {};
            }

            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            countMap[itemId][key] = count;
          });
        });

        // Fill out missing values
        _(countMap).each((count, itemId) => {
          _(feedbackCounts).each((counts, key) => {
            // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (!countMap[itemId][key]) {
              // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              countMap[itemId][key] = 0;
            }
          });
        });

        return countMap;
      }
    );
  },

  getFlagFeedbacks(
    courseId: $TSFixMe,
    courseBranchId: $TSFixMe,
    itemId: $TSFixMe,
    flagCategory: $TSFixMe,
    status: $TSFixMe,
    subItemId: $TSFixMe,
    feedbackSystem: $TSFixMe
  ) {
    if (!flagCategory) {
      return Q();
    }

    const q = subItemId ? 'subItem' : 'item';

    const uri = new URI()
      .addQueryParam('q', q)
      .addQueryParam('courseId', courseId)
      .addQueryParam('courseBranchId', courseBranchId)
      .addQueryParam('itemId', itemId)
      .addQueryParam('feedbackSystem', feedbackSystem)
      .addQueryParam('page', 0)
      .addQueryParam('limit', 100)
      .addQueryParam('fields', 'debugInfo, categoryStates');

    if (flagCategory.isHelpfulOrConfused()) {
      uri.addQueryParam('categories', 'generic');
    } else {
      uri.addQueryParam('categories', flagCategory.id);
    }

    if (flagCategory.isHelpful()) {
      uri.addQueryParam('ratingValues', 1);
    } else {
      uri.addQueryParam('ratingValues', 0);
    }

    if (status) {
      uri.addQueryParam('statuses', status);
    }

    if (subItemId) {
      uri.addQueryParam('subItemId', subItemId);
    }

    return Q(feedbackAPI.get(uri.toString())).then((response) => {
      const { elements, paging } = response;
      const { total } = paging;

      return {
        feedbacks: elements,
        totalCount: total,
      };
    });
  },

  getFlagFeedbackCounts(
    courseId: $TSFixMe,
    courseBranchId: $TSFixMe,
    itemId: $TSFixMe,
    flagCategory: $TSFixMe,
    feedbackSystem: $TSFixMe
  ) {
    const uri = new URI()
      .addQueryParam('q', 'items')
      .addQueryParam('courseId', courseId)
      .addQueryParam('courseBranchId', courseBranchId)
      .addQueryParam('itemIds', itemId)
      .addQueryParam('feedbackSystem', feedbackSystem)
      .addQueryParam('statuses', [UNRESOLVED, TODO, RESOLVED, ARCHIVED].join(','))
      .addQueryParam('countBy', 'status');

    if (flagCategory.isHelpfulOrConfused()) {
      uri.addQueryParam('categories', 'generic');
    } else {
      uri.addQueryParam('categories', flagCategory.id);
    }

    if (flagCategory.isHelpful()) {
      uri.addQueryParam('ratingValues', 1);
    } else {
      uri.addQueryParam('ratingValues', 0);
    }

    return Q(itemFeedbackCommentCountsAPI.get(uri.toString())).then((response) => response.elements[0].counts);
  },

  updateFeedbackStatus(feedbackIds: $TSFixMe, flagCategory: $TSFixMe, status: $TSFixMe) {
    const uri = new URI().addQueryParam('status', status).addQueryParam('action', 'updateStatus');

    if (flagCategory.isHelpfulOrConfused()) {
      uri.addQueryParam('category', 'generic');
    } else {
      uri.addQueryParam('category', flagCategory.id);
    }

    return Q(
      feedbackAdminAPI.post(uri.toString(), {
        data: feedbackIds,
      })
    );
  },

  deleteFeedback(feedbackIds: $TSFixMe, flagCategory: $TSFixMe) {
    const requests = feedbackIds.map((feedbackId: $TSFixMe) => {
      const uri = new URI().addQueryParam('action', 'hide').addQueryParam('feedbackId', feedbackId);

      if (flagCategory.isHelpfulOrConfused()) {
        uri.addQueryParam('category', 'generic');
      } else {
        uri.addQueryParam('category', flagCategory.id);
      }

      return Q(feedbackAdminAPI.post(uri.toString()));
    });

    return Q.all(requests);
  },

  getMyAll(courseId: $TSFixMe, itemId: $TSFixMe, subItemId: $TSFixMe) {
    const q = subItemId ? 'subItem' : 'item';

    const uri = new URI().addQueryParam('q', q).addQueryParam('courseId', courseId).addQueryParam('itemId', itemId);

    if (subItemId) {
      uri.addQueryParam('genericSubItemId', subItemId);
    }

    return Q(myFeedbackAPI.get(uri.toString()))
      .then((response) => response.elements)
      .catch((error) => {
        if (error.status === 403) {
          // we expect 403s when learner can not give feedback for the course/item
          return null;
        } else {
          throw error;
        }
      });
  },

  postMyFeedback(
    courseId: $TSFixMe,
    itemId: $TSFixMe,
    feedbackSystem: $TSFixMe,
    feedback: $TSFixMe,
    subItemId: $TSFixMe
  ) {
    const uri = new URI()
      .addQueryParam('action', 'submit')
      .addQueryParam('courseId', courseId)
      .addQueryParam('itemId', itemId)
      .addQueryParam('feedbackSystem', feedbackSystem);

    if (subItemId) {
      uri.addQueryParam('genericSubItemId', subItemId);
    }

    return Q(
      myFeedbackAPI.post(uri.toString(), {
        data: feedback.toObject(),
      })
    );
  },

  postMyLike(courseId: $TSFixMe, itemId: $TSFixMe, likeFeedback: $TSFixMe, subItemId: $TSFixMe) {
    return this.postMyFeedback(courseId, itemId, Like, likeFeedback, subItemId);
  },

  postMyFlag(courseId: $TSFixMe, itemId: $TSFixMe, flagFeedback: $TSFixMe, subItemId: $TSFixMe) {
    return this.postMyFeedback(courseId, itemId, Flag, flagFeedback, subItemId);
  },
};

export default ItemFeedbackAPIUtils;

export const {
  getFeedbackCount,
  get,
  getFlagFeedbacks,
  getFlagFeedbackCounts,
  updateFeedbackStatus,
  deleteFeedback,
  getMyAll,
  postMyFeedback,
  postMyLike,
  postMyFlag,
} = ItemFeedbackAPIUtils;

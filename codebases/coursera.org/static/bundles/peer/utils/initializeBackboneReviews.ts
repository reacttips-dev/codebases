import { ReviewMetadata } from 'bundles/peer/types/Reviews';
import { SocialProfile } from 'bundles/assess-common/types/SocialProfile';

import _ from 'underscore';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import BackboneReviewModel from 'pages/open-course/peerReview/reviewTypes/structured/models/review';

export default ({
  reviews,
  userProfiles,
}: {
  reviews: Array<ReviewMetadata>;
  userProfiles: Array<SocialProfile>;
}): Array<BackboneReviewModel> => {
  return reviews.map(function (reviewData) {
    return new BackboneReviewModel(
      Object.assign({}, reviewData, reviewData.definition, {
        creator: _(userProfiles).findWhere({ userId: reviewData.creatorId }),
      }),
      { parse: true }
    );
  });
};

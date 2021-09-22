import Backbone from 'backbone-associations';
import AbstractReviewSchema from 'pages/open-course/peerReview/reviewTypes/base/models/schema';
import ReviewSchemaPartCollection from 'pages/open-course/peerReview/reviewTypes/structured/models/schemaPartCollection';

const MultipartReviewSchema = AbstractReviewSchema.extend({
  typeName: 'structured',

  relations: [
    {
      type: Backbone.Associations.Many,
      key: 'parts',
      collectionType: ReviewSchemaPartCollection,
    },
  ],

  defaults() {
    return {
      parts: [],
    };
  },

  /**
   * Turns reviewModel into a blank review with all the appropriate fields for this review schema.
   */
  initializeReview(review) {
    const newParts = this.get('parts').map((schemaPart) => {
      return schemaPart.pick('id', 'order', 'typeName');
    });
    review.get('parts').reset(newParts);
    return review;
  },

  getPartsForSubmissionSchemaPart(submissionSchemaPartId) {
    return this.get('parts').filter((schemaPart) => {
      const partId = schemaPart.get('submissionSchemaPartId');
      if (submissionSchemaPartId != null) {
        // If this component is for parts with a `submissionSchemaPartId`, then find the parts
        // with the correct `submissionSchemaPartId`.
        return partId === submissionSchemaPartId;
      } else {
        // If this component is for parts without `submissionSchemaPartId`, then find parts
        // without a `submissionSchemaPartId`.
        return partId == null;
      }
    });
  },

  getSummarySchema(reviewsSummary) {
    const summaryParts = reviewsSummary.definition.parts;

    return this.get('parts').filter((part) => {
      return !!summaryParts[part.get('id')];
    });
  },

  getMaxScore() {
    return this.get('parts').reduce((memo, part) => {
      return memo + part.getMaxScore();
    }, 0);
  },
});

export default MultipartReviewSchema;

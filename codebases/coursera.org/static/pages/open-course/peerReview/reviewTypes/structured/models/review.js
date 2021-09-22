import Backbone from 'backbone-associations';
import _ from 'underscore';
import AbstractReview from 'pages/open-course/peerReview/reviewTypes/base/models/review';
import ReviewPartCollection from 'pages/open-course/peerReview/reviewTypes/structured/models/reviewPartCollection';

const StructuredReview = AbstractReview.extend({
  typeName: 'structured',

  relations: _(AbstractReview.prototype.relations).union([
    {
      type: Backbone.Associations.Many,
      key: 'parts',
      collectionType: ReviewPartCollection,
    },
  ]),

  defaults() {
    return {
      parts: [],
    };
  },
});

export default StructuredReview;

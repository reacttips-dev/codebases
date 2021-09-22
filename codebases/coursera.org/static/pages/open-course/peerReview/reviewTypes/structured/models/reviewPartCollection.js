import PartCollection from 'pages/open-course/peerReview/reviewTypes/structured/models/partCollection';
import getPartTypeModelConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/getPartTypeModelConfig';

const ReviewPartCollection = PartCollection.extend({
  ordered: true,

  model(attrs, options) {
    const Model = getPartTypeModelConfig(attrs.typeName).Review;
    return new Model(attrs, options);
  },
});

export default ReviewPartCollection;

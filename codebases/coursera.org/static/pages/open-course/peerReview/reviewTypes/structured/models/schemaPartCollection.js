import PartCollection from 'pages/open-course/peerReview/reviewTypes/structured/models/partCollection';
import getPartTypeModelConfig from 'pages/open-course/peerReview/reviewTypes/structured/partTypes/getPartTypeModelConfig';

const SchemaPartCollection = PartCollection.extend({
  ordered: true,

  model(attrs, options) {
    const Schema = getPartTypeModelConfig(attrs.typeName).Schema;
    return new Schema(attrs, options);
  },
});

export default SchemaPartCollection;

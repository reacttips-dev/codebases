import Backbone from 'backbone-associations';
import Instructions from 'bundles/programming/models/instructions';

const MultipartSubmissionLearnerSchema = Backbone.AssociatedModel.extend({
  relations: [
    {
      type: Backbone.Associations.One,
      key: 'instructions',
      relatedModel: Instructions,
    },
  ],
});

export default MultipartSubmissionLearnerSchema;

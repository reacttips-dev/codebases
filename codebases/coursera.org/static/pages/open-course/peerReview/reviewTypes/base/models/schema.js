import Backbone from 'backbone-associations';

const AbstractReviewSchema = Backbone.AssociatedModel.extend({
  // Override this with the schemas's typeName.
  typeName: undefined,
});

export default AbstractReviewSchema;

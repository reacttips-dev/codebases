import Backbone from 'backbone-associations';
import SocialProfile from 'pages/open-course/common/models/socialProfile';

const AbstractReview = Backbone.AssociatedModel.extend({
  // Override this with the schema's typeName.
  typeName: undefined,

  relations: [
    {
      type: Backbone.Associations.One,
      key: 'creator',
      relatedModel: SocialProfile,
      isTransient: true,
    },
  ],
});

export default AbstractReview;

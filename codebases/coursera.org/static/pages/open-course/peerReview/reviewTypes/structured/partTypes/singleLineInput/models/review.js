import Backbone from 'backbone';

const SingleLineInputReviewModel = Backbone.Model.extend({
  defaults() {
    return {
      input: '',
    };
  },
});

export default SingleLineInputReviewModel;

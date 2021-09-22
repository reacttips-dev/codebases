import Backbone from 'backbone';

const MultiLineInputReviewModel = Backbone.Model.extend({
  defaults() {
    return {
      input: '',
    };
  },
});

export default MultiLineInputReviewModel;

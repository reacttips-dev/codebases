import Backbone from 'backbone';

const BoxViewReviewModel = Backbone.Model.extend({
  defaults() {
    return {
      fieldId: '',
      annotationComplete: false,
    };
  },
});

export default BoxViewReviewModel;

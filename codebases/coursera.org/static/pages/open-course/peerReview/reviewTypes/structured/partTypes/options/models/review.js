import Backbone from 'backbone';

const OptionsReviewModel = Backbone.Model.extend({
  defaults() {
    return {
      choice: null,
    };
  },
});

export default OptionsReviewModel;

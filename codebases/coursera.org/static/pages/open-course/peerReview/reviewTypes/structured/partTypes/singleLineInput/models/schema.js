import Backbone from 'backbone';

const SingleLineInputSchema = Backbone.Model.extend({
  defaults() {
    return {
      prompt: '',
    };
  },

  getMaxScore() {
    return 0;
  },

  getOption(points) {},
});

export default SingleLineInputSchema;

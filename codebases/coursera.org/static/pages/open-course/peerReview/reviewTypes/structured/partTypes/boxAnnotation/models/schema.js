import Backbone from 'backbone';

const BoxViewSchema = Backbone.Model.extend({
  defaults() {
    return {
      fileId: '',
    };
  },
});

export default BoxViewSchema;

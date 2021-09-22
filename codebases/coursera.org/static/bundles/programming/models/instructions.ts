import Backbone from 'backbone-associations';

const Instructions = Backbone.AssociatedModel.extend({
  defaults: {
    assignmentInstructions: null,
  },
});

export default Instructions;

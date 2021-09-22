import Backbone from 'backbone';

const ScriptSubmissionBuilderSchema = Backbone.Model.extend({
  defaults: {
    typeName: 'script',
  },
});

export default ScriptSubmissionBuilderSchema;

import Backbone from 'backbone';

const WorkspaceSubmissionBuilderSchema = Backbone.Model.extend({
  defaults: {
    typeName: 'workspace',
  },
});

export default WorkspaceSubmissionBuilderSchema;

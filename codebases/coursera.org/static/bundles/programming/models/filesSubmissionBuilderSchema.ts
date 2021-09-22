import Backbone from 'backbone';

const FilesSubmissionBuilderSchema = Backbone.Model.extend({
  defaults: {
    typeName: 'files',
    suggestedFilenames: null,
  },

  getSuggestedFilename(partId: $TSFixMe) {
    return this.get('suggestedFilenames')[partId];
  },
});

export default FilesSubmissionBuilderSchema;

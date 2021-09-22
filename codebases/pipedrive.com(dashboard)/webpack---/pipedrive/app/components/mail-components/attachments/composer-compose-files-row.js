const ComposeFilesRow = require('views/shared/compose-files-row');

module.exports = ComposeFilesRow.extend({
	removeFile: function() {
		if (this.model.get('attachmentPlaceholder')) {
			this.model.trigger('destroy', this.model, this.model.collection);

			return;
		}

		this.model.destroy();
	}
});

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const FileModel = require('models/file');
const Template = require('templates/shared/compose-files-row.html');
const GoogleFiles = require('utils/google-files');
const $ = require('jquery');

require('fancybox');
require('fancybox.resize');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	model: null,

	initialize: function() {
		this.model.onChange('state name size', this.render, this);
		this.model.onChange('loading', this.updateProgress, this);

		this.render();
	},

	updateProgress: function() {
		const current = this.model.get('loading');

		this.$('.progress .fill').css('width', `${current}%`);
	},

	render: function() {
		this.$el.html(
			this.template(
				_.assignIn(this, {
					state: this.model.get('state'),
					FileStates: FileModel.states
				})
			)
		);

		this.$('.remove').on('click', _.bind(this.removeFile, this));

		if (this.model.get('state') === this.FileStates.READY) {
			this.$('a.img').on('click.file', _.bind(this.imageFancybox, this));
			this.$('a.gslides, a.gform, a.gdraw, a.gsheet, a.gdoc').on(
				'click.file',
				_.bind(this.googleFancybox, this)
			);
		}
	},

	imageFancybox: function(ev) {
		if (this.model.hasExtension(['heif', 'heic', 'psd', 'tiff', 'tif'])) {
			return;
		}

		ev.preventDefault();
		ev.stopPropagation();

		$.fancybox(this.$('.img'), {
			minWidth: 40,
			minHeight: 40,
			openEffect: 'none',
			closeEffect: 'none',
			type: 'image',
			helpers: {
				buttons: {},
				title: {
					type: 'float'
				}
			}
		});
	},

	googleFancybox: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		GoogleFiles.openFile(
			this.model.get('file_type'),
			ev.delegateTarget,
			ev.delegateTarget.href
		);
	},

	removeFile: function() {
		this.model.destroy();
	}
});

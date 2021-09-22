const ComposeFiles = require('views/shared/compose-files');
const $ = require('jquery');
const _ = require('lodash');
const FilesEditorRow = require('./composer-compose-files-row');

module.exports = ComposeFiles.extend({
	FilesEditorRow,

	initialize: function(options) {
		if (app.router.currentView) {
			options = Object.assign({}, options, { $dropzone: app.router.currentView.el });
		}

		ComposeFiles.prototype.initialize.call(this, options);
	},

	reInitializeRowViews: function(attachmentModels) {
		_.forEach(attachmentModels, (model) => {
			let modelIndex = 0;

			const existingModel = _.find(this.collection.models, (fileModel) => {
				return fileModel.has('id') && fileModel.get('id') === model.dupe_id;
			});

			if (existingModel) {
				modelIndex = this.collection.indexOf(existingModel);
				this.collection.remove(existingModel);
			}

			this.collection.add(model, { at: modelIndex || 0 });
		});
	},

	removePlaceHolderRows: function() {
		const modelsToRemove = _.filter(this.collection.models, (model) => {
			return !!model.get('attachmentPlaceholder');
		});

		_.forEach(modelsToRemove, (model) => {
			this.collection.remove(model);
		});
	},

	getTemplateRelatedAttachments: function(attachments, templateId) {
		return _.filter(attachments, (attachment) => {
			return attachment.mail_template_id === templateId;
		});
	},

	removeAttachmentsFromAnotherTemplate: function(templateId) {
		const attachmentsToRemove = this.collection.where((fileModel) => {
			return (
				fileModel.has('mail_template_id') &&
				fileModel.get('mail_template_id') !== templateId
			);
		});

		_.forEach(attachmentsToRemove, (attachmentToRemove) => {
			attachmentToRemove.destroy();
		});
	},

	filterAttachmentsForDuplication: function(attachments, templateId) {
		return _.filter(attachments, (attachment) => {
			return !_.find(this.collection.models, (fileModel) => {
				return (
					fileModel.get('name') === attachment.name &&
					fileModel.get('mail_template_id') === templateId
				);
			});
		});
	},

	getNotUploadedTemplateAttachments: function() {
		return this.collection
			.where((fileModel) => {
				return fileModel.has('mail_template_id') && !fileModel.has('mail_message_id');
			})
			.map((fileModel) => {
				return fileModel.toJSON();
			});
	},

	getFilesWithId: function() {
		return this.collection
			.where((fileModel) => {
				return fileModel.has('id');
			})
			.map((fileModel) => {
				return fileModel.toJSON();
			});
	},

	onFileDrop: function(ev, draggable) {
		const inCurrentView = $.contains(this.el, ev.target);
		const inOrOnDroparea = this.inOrOnDroparea(ev);
		const isDroppable = inCurrentView || inOrOnDroparea;

		if (
			isDroppable &&
			draggable.content.length === 1 &&
			this.isAllowedImage(draggable.content[0].type)
		) {
			return;
		}

		ComposeFiles.prototype.onFileDrop.call(this, ev, draggable);
	},

	inOrOnDroparea: function(ev) {
		const inDropArea = !!this.options.dropArea && $.contains(this.$dropArea[0], ev.target);
		const onDropArea = !!this.options.dropArea && this.$dropArea[0] === ev.target;

		return inDropArea || onDropArea;
	},

	isAllowedImage: function(fileType) {
		const validImageTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];

		return validImageTypes.includes(fileType);
	},

	showDropTarget: function(ev) {
		const files = ev.originalEvent.dataTransfer.items || {};
		const singleFileType = files[0] && files[0].type;

		if (!this.inEditorDrag(ev) && (files.length > 1 || !this.isAllowedImage(singleFileType))) {
			ComposeFiles.prototype.showDropTarget.call(this, ev);
		} else {
			this.options.handleSingleAttachmentDrag(ev);
		}
	},

	inEditorDrag: function(ev) {
		if (
			$(ev.target)
				.parents('#application')
				.find('.in-editor-drag').length
		) {
			return true;
		}

		return false;
	}
});

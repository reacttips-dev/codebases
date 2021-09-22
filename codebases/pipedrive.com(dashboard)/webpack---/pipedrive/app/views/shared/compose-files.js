const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const FilesCollection = require('collections/files');
const FileModel = require('models/file');
const GoogleFiles = require('utils/google-files');
const FilesEditorRow = require('views/shared/compose-files-row');
const Template = require('templates/shared/compose-files.html');
const DragAndDrop = require('views/ui/drag-and-drop');
const DropMenu = require('views/ui/dropmenu');
const Cookies = require('js-cookie');
const User = require('models/user');
const $ = require('jquery');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	// Events: add

	/**
	 * related deal, person or mailMessage model
	 * @type {model}
	 */
	relatedModel: null,

	collection: null,

	dragAndDrop: null,

	googleDriveEnabled: false,

	FileStates: FileModel.states,

	FilesEditorRow,

	/**
	 * Contains error messages from the API and local codes as well.
	 * @type {Object}
	 */
	errorMessages: {
		'unknown_error': _.gettext('An error occurred while saving the file'),
		'google_drive_quota_exceeded': _.gettext('You have run out of storage on Google Drive'),
		'google_drive_unknown_error': _.gettext('Unknown Google Drive error'),

		'unsupported': _.gettext('Unsupported file type'),
		'oversize': _.gettext('File is too large'),
		'error google': _.gettext('Unknown Google Drive error')
	},

	initialize: function(options) {
		this.options = options;
		this.errorMessage = '';

		this.setRelatedModel(this.options.relatedModel, this.options.collection);

		this.$dropArea = this.options.dropArea || $('#application');

		this.googleDriveEnabled =
			User.companyFeatures.get('google_drive') &&
			User.settings.get('file_upload_destination') === 'googledocs' &&
			this.options.googleDriveSupport;

		if (this.googleDriveEnabled) {
			GoogleFiles.on('login authFail authSuccess ready', this.render, this);
			GoogleFiles.prepareAPI();
		}

		this.initDragAndDrop();
		this.error_code = 0;

		this.render();

		// should have better tabs integration
		if (_.isFunction(this.options.onRender)) {
			this.options.onRender(this);
		}
	},

	/**
	 * setRelatedModel description
	 * @param {model} relatedModel required
	 * @param {filesCollection} collection optional
	 */
	setRelatedModel: function(relatedModel, collection) {
		this.relatedModel = relatedModel;

		if (this.collection) {
			this.collection.off(null, null, this);
		}

		this.collection = collection || new FilesCollection();
		this.collection.on('add', this.onFileAdded, this);
		this.collection.on('sort add remove reset', this.render, this);
		this.collection.on('remove', this.onFileRemoved, this);

		// this is hack for automation testing
		if (app.ENV === 'test') {
			window.__filesCollection = this.collection;
		}

		this.render();
	},

	getTemplate: function(data) {
		let template = this.template;

		if (_.isString(this.options.customTemplate)) {
			template = _.template(this.options.customTemplate);
		} else if (_.isFunction(this.options.customTemplate)) {
			template = this.options.customTemplate(this, template);
		}

		return data ? template(data) : template;
	},

	/**
	 * Cancel adding files
	 * @void
	 */
	cancel: function() {
		this.render();
		this.close();
	},

	/**
	 * Open browse for files dialog for adding files
	 * @param {Event} jQuery event
	 */
	attachFiles: function(ev) {
		if (ev) {
			ev.preventDefault();
		}

		this.collection.browseFiles({
			autoUpload: false
		});
	},

	/**
	 * import files from Google drive
	 * @void
	 */
	importGoogleFiles: function() {
		this.collection.browseGoogleFiles({
			relatedModel: this.relatedModel
		});
	},

	// Private

	/**
	 * Called when switching tabs - clear last uploaded files list
	 * @void
	 */
	update: function() {
		this.collection.reset();
	},

	initDragAndDrop: function() {
		const $dropzone = this.getDropzoneEl();

		this.dragAndDrop = new DragAndDrop.dropZone({
			el: $dropzone,
			type: ['files'],
			disableDragDrop: this.disableDragDrop ? this.disableDragDrop.bind(this) : false,
			dragEnter: this.showDropTarget.bind(this),
			dragOver: this.showDropTarget.bind(this),
			dragDrop: this.onFileDrop.bind(this)
		});
	},

	getDropzoneEl: function() {
		if ($('#modal').length) {
			return $('#modal');
		} else {
			return (
				this.options.$dropzone ||
				$('.detailViewWrapper, .mainSectionWrapper') ||
				$('#application')
			);
		}
	},

	onFileAdded: function(file, collection, options) {
		if (file.isInline()) {
			return;
		}

		if (this.relatedModel.isNew()) {
			this.relatedModel.once(
				'change:id',
				function() {
					file.uploadFile(this.relatedModel.getRelatedBy());
				},
				this
			);
		} else {
			this.errorMessage = '';
			file.uploadFile(this.relatedModel.getRelatedBy(), {
				error: function(m, model, request) {
					this.errorMessage = this.getErrorMessage(m, request);
					this.render();
				}.bind(this)
			});
		}

		this.trigger('add', file, collection, options);
	},

	onFileRemoved: function() {
		this.trigger('remove');
	},

	onFileDrop: function(ev, draggable) {
		const inCurrentView = $.contains(this.el, ev.target);
		const inDropArea = !!this.options.dropArea && $.contains(this.$dropArea[0], ev.target);
		const onDropArea = !!this.options.dropArea && this.$dropArea[0] === ev.target;
		const isDroppable = inCurrentView || inDropArea || onDropArea;

		if (isDroppable) {
			this.collection.addLocalFiles(draggable.content, {
				autoUpload: false
			});

			if (_.isFunction(this.options.onDragDrop)) {
				this.options.onDragDrop(ev, this);
			}
		}
	},

	getErrorMessage: function(message, request) {
		let error = 'unknown_error';

		const requestResponse = request && request.responseJSON;

		if (
			requestResponse &&
			_.get(request.responseJSON.data, 'error_code') &&
			_.has(this.errorMessages, request.responseJSON.data.error_code)
		) {
			error = request.responseJSON.data.error_code;
		} else if (_.isString(message) && _.has(this.errorMessages, message)) {
			error = message;
		}

		return this.errorMessages[error];
	},

	showDropTarget: function(ev) {
		if (_.isFunction(this.options.onDragOver)) {
			this.options.onDragOver(ev, this);
		}

		clearTimeout(this._dropTimeoutId);
		this._dropTimeoutId = this.setTimeout(
			_.bind(function() {
				if (_.isFunction(this.options.onDragEnd)) {
					this.options.onDragEnd(ev, this);
				}
			}, this),
			300
		);
	},

	// @TODO: Remove when CollectionView component is ready
	createFileViewers: function() {
		const attachments = this.collection.getNonInlineAttachments();

		if (!attachments.length) {
			return;
		}

		_.forEach(
			attachments,
			_.bind(function(file) {
				const selector = `.fileRow[data-id="${file.cid}"]`;

				if (!this.getView(selector)) {
					this.addView(selector, new this.FilesEditorRow({ model: file }));
				}
			}, this)
		);
	},

	render: function() {
		this.createFileViewers();

		this.detachViews();

		this.$el.html(
			this.getTemplate(
				_.assignIn(this, {
					GoogleFiles,
					loginEmail: sanitizeHtml(GoogleFiles.loginEmail)
				})
			)
		);

		this.$('.attachFile').on('click', _.bind(this.attachFiles, this));
		this.$('.closeFileUpload').on('click', _.bind(this.cancel, this));

		if (this.googleDriveEnabled) {
			this.$('.googleImport').on('click', _.bind(this.importGoogleFiles, this));
			this.$('.googleLogin').on('click', _.bind(this.loginToGoogle, this));

			if (GoogleFiles.ready) {
				this.createNewItemMenu(this.$('.googleCreateNew'));
			}
		}

		if (this.collection.getNonInlineAttachments().length) {
			this.$el.removeClass('empty');
		} else {
			this.$el.addClass('empty');
		}

		this.attachViews();
	},

	createNewItemMenu: function($target) {
		const options = {
			gdoc: _.gettext('Document'),
			gslides: _.gettext('Presentation'),
			gsheet: _.gettext('Spreadsheet'),
			gform: _.gettext('Form'),
			gdraw: _.gettext('Drawing')
		};

		if ($target.length) {
			this.createNewMenu = new DropMenu({
				target: $target,
				ui: 'arrowDropmenu',
				activeOnClick: true,
				data: _.map(
					options,
					_.bind(function(title, type) {
						return {
							title,
							className: type,
							click: _.bind(this.onCreateNewClicked, this, type)
						};
					}, this)
				)
			});
		}
	},

	onCreateNewClicked: function(type) {
		const title = window.prompt(_.gettext('Name the document:'));
		const file = new FileModel();

		file.createGoogleFile(
			{
				type,
				title
			},
			{
				relatedModel: this.relatedModel,
				success: _.bind(function() {
					const url = `${file.get('url')}?session_token=${Cookies.get(
						'pipe-session-token'
					)}`;

					GoogleFiles.openFile(type, this.el, url);
				}, this)
			}
		);

		this.collection.add(file);
	},

	loginToGoogle: function() {
		GoogleFiles.login();
		this.render();
	},

	onUnload: function() {
		this.dragAndDrop.unload();
	},

	close: function() {
		// We use DOM events because flow composer does not have direct reference to editors and catches with bubbling
		this.$el.trigger('closeComposer');
	}
});

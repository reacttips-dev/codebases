const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const Users = require('collections/company');
const logger = new Pipedrive.Logger('compose-note');
const NoteModel = require('models/note');
const NoteDraftModel = require('models/note-draft');
const {
	PdWysiwyg,
	ListAutoConverterPlugin,
	ThumbnailsPlugin,
	LinkHandlerPlugin,
	MentionsPlugin
} = require('@pipedrive/pd-wysiwyg');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const WysiwygTranslations = require('utils/wysiwyg-translations');
const Template = require('templates/shared/flow/compose-note.html');
const $ = require('jquery');
const noteAnalytics = require('utils/analytics/note-analytics');
const { getCookieValue, remove } = require('@pipedrive/fetch');
const snackbar = require('snackbars');
const PDMetrics = require('utils/pd-metrics');

module.exports = Pipedrive.View.extend({
	template: _.template(Template),

	value: null,
	saving: false,

	editMode: false,

	/**
	 * related deal or person model
	 * @type {model}
	 */
	relatedModel: null,

	contentEditable: null,

	initialize: function(options) {
		this.options = options || {};

		this.relatedModel = options.relatedModel;
		this.draftModel = new NoteDraftModel({
			id: `${this.relatedModel.type}/${this.relatedModel.id}`
		});

		this.plugins = [];

		if (this.options.model) {
			this.model = this.options.model;
			this.value = this.model.get('content');
			this.editMode = true;
		} else {
			this.model = new NoteModel();
			this.draftModel.fetch();

			let draftContent = this.draftModel.get('content');

			if (draftContent) {
				draftContent = this.fixSessionTokens(draftContent);

				this.model.set('content', draftContent);
				this.value = this.model.get('content');
			}
		}

		// We will keep track of the images added to the note, for analytic purposes, and for cleaning up when pressing backspace.
		this.imagesTrackingData = [];
		this.images = [];

		// should have better tabs integration
		if (_.isFunction(options.onRender)) {
			options.onRender(this);
		}

		this.render();
		this.model.onChange('content', _.bind(this.valueChanged, this));
	},

	// Replace session tokens with current one, may be needed as after logging out and back in again
	// the draft may be saved with invalid session tokens
	fixSessionTokens: function(draftContent = '') {
		const sessionToken = getCookieValue('pipe-session-token');

		try {
			return draftContent.replace(/(session_token=).*?"/g, `$1${sessionToken}"`);
		} catch (ignoredError) {
			return draftContent;
		}
	},

	valueChanged: function() {
		this.value = this.model.get('content');
		this.render();
	},

	addScrollIfEditorHasTable: function(editor) {
		if (editor.find('table').length) {
			editor.css('overflow', 'auto');
		} else if (!editor.find('table').length && editor.css('overflow') === 'auto') {
			editor.css('overflow', '');
		}
	},

	render: function() {
		const sanitizedNote = sanitizeHtml(this.value);

		this.$el.html(this.template({ sanitizedNote, saving: this.saving }));

		const $editor = this.$('.richTextArea .bodyEditor');
		const self = this;

		this.contentEditable = new PdWysiwyg({
			editorEl: $editor[0],
			toolbarEl: this.$('.richTextArea .editorToolbar')[0],
			translations: WysiwygTranslations.getTranslations(),
			sanitizePasteData: true,
			sanitizeHtml: (html, loose, removeStyle, replaceLinks) =>
				sanitizeHtml(html, { loose, removeStyle, replaceLinks }),
			plugins: this.getWysiwygPlugins()
		});

		this.addScrollIfEditorHasTable($editor);

		$editor.on('blur keyup paste input click', () => {
			self.addScrollIfEditorHasTable($editor);

			self.draftModel.save({
				content: self.getInputValue()
			});
		});

		this.$('[data-action=cancel]').click(_.bind(this.cancel, this));
		this.$('[data-action=save]').click(_.bind(this.save, this));
		this.$('.toolbar_at').click(() => {
			PDMetrics.trackUsage(null, 'mention_icon', 'clicked', {
				note_linked_to: this.relatedModel.type
			});
		});

		if (!this.saving) {
			this.$('.richTextArea .bodyEditor').focus();
		}

		this.createEditorTooltips();
	},

	createEditorTooltips: function() {
		this.$('.richTextArea .editorToolbar a').each((key, el) => {
			$(el).tooltip({
				tip: $(el).data('editor-tooltip'),
				preDelay: 0,
				postDelay: 0,
				zIndex: 20000,
				fadeOutSpeed: 100,
				position: 'top'
			});
		});
	},

	// called when switching tabs
	update: function() {
		// keep input existing value
		this.value = this.getInputValue();
		this.$('.richTextArea .bodyEditor').focus();
		this.render();
	},

	reset: function() {
		this.saving = false;
		this.value = null;
		this.imagesTrackingData = [];
		this.model = new NoteModel();
		this.draftModel.destroy();
		this.render();
	},

	cancel: function() {
		this.close();
		this.render();

		this.images = [];
	},

	close: function() {
		// We use DOM events because flow composer does not have direct reference to editors and catches with bubbling
		this.$el.trigger('closeComposer');
		this.trigger('noteEditorClosed');

		this.images = [];
	},

	getInputValue: function(parsed) {
		const $editor = this.$('.richTextArea .bodyEditor');

		return parsed ? this.contentEditable.getParsedContent() : $editor.html();
	},

	save: function() {
		this.setSaveButtonDisabledStatus(true);
		const valueChanged = this.$('.richTextArea .bodyEditor').html() !== '';

		if (valueChanged && !this.saving) {
			this.draftModel.destroy();

			const data = _.assignIn(this.relatedModel.getRelatedBy(), {
				content: this.getInputValue(true)
			});

			this.model.save(data, {
				success: _.bind(this.onSaved, this),
				error: _.bind(this.onError, this)
			});

			this.saving = true;
		}

		this.images = [];
	},

	onError: function() {
		this.saving = false;

		this.render();
	},

	onSaved: async function() {
		this.saving = false;

		try {
			const linkedTo = window.location.href.split('/')[3];
			const containsImage = this.imagesTrackingData.length > 0;

			noteAnalytics.trackNote({
				isNew: !this.editMode,
				model: this.model,
				link: linkedTo,
				source: `${linkedTo}-details`,
				containsImage,
				...(containsImage
					? {
							additionalProperties: {
								image_count: this.imagesTrackingData.length,
								avg_original_file_size_in_kb:
									_.sumBy(this.imagesTrackingData, 'fileSize') /
									this.imagesTrackingData.length,
								avg_thumbnail_size_in_kb:
									_.sumBy(this.imagesTrackingData, 'thumbnailSize') /
									this.imagesTrackingData.length
							}
					  }
					: {})
			});
		} catch (err) {
			logger.error('Could not track analytics for saving the note', err);
		}

		if (!this.editMode) {
			this.reset();
		}

		this.close();
		this.render();
	},

	onUnload: function() {
		this.contentEditable.unload();
	},

	handleBackspaceKeypress: function() {
		const imageContent = this.contentEditable.getParsedContent();

		this.images = (this.images || []).filter((fileId) => {
			if (!_.includes(imageContent, fileId)) {
				remove(`/api/v1/files/${fileId}`);

				return false;
			}

			return true;
		});
	},

	setSaveButtonDisabledStatus: function(isDisabled) {
		this.$('[data-action="save"]').attr('disabled', isDisabled);
	},

	getWysiwygPlugins: function() {
		const isImagesInNotesFeatureEnabled = User.companyFeatures.get('images_in_notes');
		const isInAppMentionsFeatureEnabled = User.companyFeatures.get('in_app_mentions');

		const plugins = [];

		plugins.push(LinkHandlerPlugin, ListAutoConverterPlugin);

		if (isImagesInNotesFeatureEnabled) {
			plugins.push([
				ThumbnailsPlugin,
				{
					allowImageDropAndPaste: true,
					sanitizePasteData: true,
					uploadImage: (images, onSuccessCallback, onFailureCallback) => {
						const onSuccess = (
							imageUrls,
							imageIds,
							{ fullFile, fullFileResponse, resizedFile, resizedFileResponse }
						) => {
							this.setSaveButtonDisabledStatus(false);

							this.images.push(fullFileResponse.data.id);
							this.images.push(resizedFileResponse.data.id);

							this.imagesTrackingData.push({
								fileSize: fullFile.size / 1024,
								thumbnailSize: resizedFile.size / 1024
							});

							onSuccessCallback(imageUrls, imageIds);
						};

						const onFailure = (err) => {
							this.setSaveButtonDisabledStatus(false);
							logger.error('Could not upload images for note', err);
							snackbar.show({
								text: _.gettext('Failed to upload the image attachment')
							});
							onFailureCallback();
						};

						const entityType =
							this.relatedModel.type === 'organization'
								? 'org'
								: this.relatedModel.type;
						const entityId = this.relatedModel.get('id');

						this.setSaveButtonDisabledStatus(true);
						ThumbnailsPlugin.uploadImagesToPipedriveApi(
							images,
							entityType,
							entityId,
							onSuccess,
							onFailure
						);
					},
					removeImage: _.debounce(() => this.handleBackspaceKeypress(), 100)
				}
			]);
		} else {
			this.$('.toolbar_image').remove();
		}

		if (isInAppMentionsFeatureEnabled) {
			plugins.push([
				MentionsPlugin,
				{
					entityType: this.relatedModel.type,
					entityId: this.relatedModel.get('id'),
					userId: User.get('id'),
					companyUsers: Users.toJSON(),
					tributeOptions: {
						closeOnScroll: document.querySelector('.detailViewWrapper')
					},
					texts: {
						you: _.gettext('you'),
						owner: _.gettext('owner'),
						noPermission: _.gettext(
							'This user does not have permissions to view this item and will not be notified'
						)
					}
				}
			]);
		} else {
			this.$('.toolbar_at').remove();
		}

		return plugins;
	},

	focusContentEditable: function() {
		if (this.contentEditable.focus) {
			this.contentEditable.focus();
		}
	}
});

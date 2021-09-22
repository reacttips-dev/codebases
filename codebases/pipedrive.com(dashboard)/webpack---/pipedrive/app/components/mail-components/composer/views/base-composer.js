'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const moment = require('moment');
const lottie = require('lottie-web');
const animationData = require('../templates/animation');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const ComposeFilesView = require('../../attachments/composer-compose-files');
const template = require('../templates/composer.html');
const HeaderView = require('./composer-header');
const ComposerFeatureToolbar = require('./composer-feature-toolbar');
const TrackingButtonsView = require('./tracking-buttons');
const attachmentsTemplate = require('../templates/attachments.html');
const ScheduleMail = require('../../schedule-email/index');
const {
	PdWysiwyg,
	ReactPdWysiwyg,
	MergeFieldsPlugin,
	InlineImagesPlugin,
	ImageResizerPlugin,
	LinkHandlerPlugin,
	ListAutoConverterPlugin
} = require('@pipedrive/pd-wysiwyg');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const WysiwygTranslations = require('utils/wysiwyg-translations');
const sendingErrorMessages = require('../errors/sending-error-messages');
const MailWarningMessages = require('../warnings/mail-warnings');
const InlineImageHelpers = require('../../attachments/inline-image-helpers');
const logger = new Pipedrive.Logger('base', 'composer');
const snackbar = require('snackbars');
const DropMenu = require('views/ui/dropmenu');
const ComposerHelpers = require('./composer-helpers/index');
const EditorSharedHelpers = require('../../shared-helpers/wysiwyg-helper');
const Cookies = require('js-cookie');
const $ = require('jquery');
const User = require('models/user');
const React = require('react');
const ReactDOM = require('react-dom');
const PDMetrics = require('utils/pd-metrics');
const MailViewAnalytics = require('utils/analytics/mail-view-analytics');
const webappComponentLoader = require('webapp-component-loader');
const iamClient = require('utils/support/iam');

require('jquery.ui');

/**
 * This component holds the shared functionality of different mail composers.
 * Shouldn't be required directly, but through the mail composer factory
 * "components/mail-composer/index".
 *
 * @class  components/MailComposer/BaseComposer
 *
 * @param {Object} opts      Initial options
 * @extends {module:Pipedrive.View}
 */
module.exports = Pipedrive.View.extend(_.assignIn({}, ComposerHelpers, EditorSharedHelpers)).extend(
	{
		contentEditable: null,
		onAttachedToDOMDone: false,
		template: _.template(template),
		trackingButtonsView: null,
		attachmentsView: null,
		headerView: null,
		autoSaveTimeout: null,
		keyupTimeout: null,
		pendingSave: false,
		saving: false,
		cancelling: false,
		previousComposerHeight: null,
		previousContent: null,
		$scrollableContainer: null,
		$sendButtonText: null,
		templateId: null,
		scheduleMailDropMenu: null,
		delayedUntil: null,
		priorityType: null,
		delayedType: null,

		events: {
			'click .warningMessage a[data-composer="nylas-reconnect-link"]': 'onUserReconnect'
		},

		initialize: function(opts) {
			this.options = opts;
			this.draftModel = opts.draftModel;
			this.draftAttchmentsCollection = this.getAttachmentCollection();
			this.fontPickersEnabled = User.companyFeatures.get('wysiwyg_formatting');
			this.scheduleForLaterEnabled = User.companyFeatures.get('scheduled_emails');

			if (!this.draftModel.isNew()) {
				this.pull(this.draftAttchmentsCollection);

				this.templateId = this.draftModel.get('template_id');
			}

			this.bodyEditorSelector = this.fontPickersEnabled
				? '.composer__contentEditable .bodyEditor'
				: '.bodyEditor.body';

			app.global.bind('mailMessage.model.*.delete', this.onDraftDeleted, this);
			app.global.bind('mailMessage.model.*.update', this.onDraftUpdated, this);
			this.listenTo(MailConnections.instance, 'change add', this.toggleWarningMessage);
			this.listenTo(this.draftAttchmentsCollection, 'add', this.onImageAdded);
			this.listenTo(this.draftModel, 'save', this.saveDraft.bind(this));
			this.listenTo(
				this.draftModel.threadModel,
				'contextualSidebar.save',
				this.saveDraft.bind(this)
			);

			// PMAIL-978 Disable email scheduling temporarily for Leads
			// - until Leads flow can show scheduled emails as 'Scheduled', as in Deals flow
			if (this.draftModel.get('lead_id') || this.draftModel.threadModel?.get('lead_id')) {
				this.scheduleForLaterEnabled = false;
			}
		},

		onLoad: function() {
			if (this.options.expandDynamically) {
				this.onWindow('resize', _.throttle(_.bind(this.setBodyMaxHeight, this), 500));
			}

			MailConnections.onReady(this.render.bind(this));
			this.draftModel.threadModel.trigger('composer:loaded');
		},

		/**
		 * Closes composer if draft gets send or discarded
		 */
		onDraftDeleted: function(draftId) {
			if (
				draftId === this.draftModel.get('id') &&
				_.isFunction(this.options.onDraftDiscarded)
			) {
				this.isCancelling(true);
				this.options.onDraftDiscarded();
			}
		},

		onDraftUpdated: function(draft) {
			if (draft.get('id') === this.draftModel.get('id') && draft.get('sent_flag')) {
				this.isCancelling(true);
				this.options.onDraftDiscarded({ focused: false });
			}
		},

		getTemplateHelpers: function() {
			return {
				onSend: _.bind(this.onSendButtonClick, this),
				onDiscard: _.bind(this.onDiscardClicked, this),
				onAddAttachmentClick: _.bind(this.onAddAttachmentClick, this),
				isSaved: !this.draftModel.isNew(),
				messageBody: sanitizeHtml(this.draftModel.get('body') || '', { loose: true }),
				fontPickersEnabled: this.fontPickersEnabled,
				scheduleForLaterEnabled: this.scheduleForLaterEnabled,
				showSignature: !this.options.isDialog,
				openSignatureModal: this.openSignatureModal.bind(this),
				isNewEmail: this.draftModel.getSendmode() === 'new'
			};
		},

		afterRender: function() {
			this.initHeaderAndToolbar();
			this.initTextEditor();
			this.toggleWarningMessage();

			if (this.scheduleForLaterEnabled) {
				this.initScheduleMailDropDown();
			}
		},

		onAttachedToDOM: function() {
			if (this.contentEditable && !this.onAttachedToDOMDone) {
				this.onAttachedToDOMDone = true;
				this.initTooltips();
				this.bindEventListeners();
				this.initAttachments();
				this.initTextEditorAfterRender();
				this.loadAnimation();

				this.animationRequestId = requestAnimationFrame(() => this.setBodyMaxHeight());

				if (MailConnections.isEmailTrackingEnabled()) {
					this.initTrackingButtonsView();
				}
			}

			if (this.scheduleForLaterEnabled) {
				this.addScheduleMailDropDownCoachmark();
			}
		},

		initTrackingButtonsView: function() {
			this.trackingButtonsView = new TrackingButtonsView({
				draftModel: this.draftModel,
				saveDraft: this.saveDraft.bind(this),
				fontPickersEnabled: this.fontPickersEnabled
			});
			this.addView({
				'.tracking': this.trackingButtonsView
			});
		},

		toggleWarningMessage: function() {
			const warningMessage = MailWarningMessages.getMessage(this.draftModel);
			const activeConnection = MailConnections.getConnectedNylasConnection();
			const disableInputs = !activeConnection || activeConnection.isNylasSetupIncomplete();
			const $warningEl = this.$el.find('div[data-composer="warning"]');

			$warningEl.removeClass('active');
			this.enableInputs();
			this.enableFooterActions();

			if (warningMessage) {
				$warningEl.find('.warningMessage').html(warningMessage);
				$warningEl.addClass('active');

				if (disableInputs) {
					this.disableInputs();
					this.disableFooterActions(true);
				}
			}
		},

		onUserReconnect: function() {
			if (MailConnections.needsNylasReauth() && !User.isSilver()) {
				MailViewAnalytics.warningClicked();

				const redirectUrl = MailConnections.getAuthLink();

				window.location = redirectUrl;
			} else if (MailConnections.length && !User.isSilver()) {
				MailConnections.reconnectLastDisconnectedAccount();
				MailViewAnalytics.warningClicked();
			} else {
				// If there are no connections at all we send to settings menu.
				window.location = '/settings/email-sync';
			}
		},

		/**
		 * Initializes tooltips if data-tooltips are defined
		 * @return {void}
		 */
		initTooltips: function() {
			const $elementsWithTooltips = this.$('.composer [data-tooltip]:not([data-tooltip=""])');

			$elementsWithTooltips.each(function() {
				$(this).tooltip({
					tip: $(this).data('tooltip'),
					position: 'top'
				});
			});
		},

		/**
		 * Calculates and sets the css max-height of the mail composer's body container,
		 * to make the composer dynamically expand and fit on the screen.
		 *
		 * @void
		 */
		setBodyMaxHeight: function() {
			if (!this.options.expandDynamically) {
				return;
			}

			const expDynOpts = this.options.expDynOpts;

			this.$(this.bodyEditorSelector).off('keyup.composer');
			this.$('.bodyEditorWrapper, .editorWrapper').css('max-height', '');
			// $scrollableContainer - the closest higher container that is scrollable
			this.$scrollableContainer = expDynOpts.$scrollableContainer
				? expDynOpts.$scrollableContainer
				: this.$el.parent();

			const scrollableHeight = expDynOpts.hasWindowHeight
				? $(window).height()
				: this.$scrollableContainer.height();
			const composerHeight = this.$el.outerHeight();
			const composerBodyHeight = this.getComposerBodyHeight();
			const $elOffsetTop = this.$el.offset().top;
			// Correction because of paddings and such
			const correction = $elOffsetTop > 0 ? $elOffsetTop : 40;
			const editorWrapperMaxHeight =
				scrollableHeight - (composerHeight - composerBodyHeight) - correction;
			const halfOfScrollableHeight = scrollableHeight / 2.5;
			const minHeight = halfOfScrollableHeight > 250 ? halfOfScrollableHeight : 250;
			// check if editor max height value is at least 50% of window height
			// if not, then use default min height value
			const maxHeight =
				editorWrapperMaxHeight > minHeight ? editorWrapperMaxHeight : minHeight;

			this.$('.bodyEditorWrapper, .editorWrapper').css('max-height', maxHeight);
			this.$(this.bodyEditorSelector).on(
				'keyup.composer',
				_.bind(function() {
					this.checkComposerHeight();
				}, this)
			);
		},

		getComposerBodyHeight: function() {
			return this.$('.bodyEditorWrapper, .bodyEditor').height();
		},

		checkComposerHeight: function() {
			const height = this.getComposerBodyHeight();

			if (this.previousComposerHeight !== height) {
				this.previousComposerHeight = height;
				this.trigger('changedHeight');
			}
		},

		removeImage() {
			InlineImageHelpers.deleteRemovedImages(
				this.getBodyContent(),
				this.draftAttchmentsCollection
			);
		},

		/**
		 * Initializes the mail body's html text editor
		 * @void
		 */
		initTextEditor() {
			const options = {
				translations: WysiwygTranslations.getTranslations(),
				trackUsage: PDMetrics.trackUsage,
				fontPickersEnabled: this.fontPickersEnabled,
				plugins: [
					[
						InlineImagesPlugin,
						{
							allowImageDropAndPaste: true,
							handleAttachmentDrag: (isDragging, ev) =>
								this.handleAttachmentDrag(isDragging, ev),
							uploadImage: (image, onSuccess) => {
								this.$(this.bodyEditorSelector)[0].focus();

								this.draftAttchmentsCollection.addLocalFile(image, {
									uploadAttributes: {
										inline_flag: true
									},
									success(response) {
										const token = Cookies.get('pipe-session-token');
										const url = `${response.get('url')}?session_token=${token}`;

										onSuccess(url, response.get('cid'));
									}
								});
							},
							removeImage: () => this.removeImage(),
							onInlineImageFromToolbar: () => {
								this.sendPageActionMetrics('added-inline-image-from-browsing');
							},
							onDropInlineImage: () =>
								this.sendPageActionMetrics('dropped-inline-image')
						}
					],
					[
						ImageResizerPlugin,
						{
							removeImage: () => this.removeImage()
						}
					],
					LinkHandlerPlugin,
					MergeFieldsPlugin,
					ListAutoConverterPlugin
				]
			};

			if (this.fontPickersEnabled) {
				ReactDOM.render(
					React.createElement(ReactPdWysiwyg, {
						content: sanitizeHtml(this.draftModel.get('body') || '', { loose: true }),
						useDragDrop: true,
						toolbarButtons: [
							'undo',
							'redo',
							'fontfamily',
							'fontsize',
							'fontcolor',
							'bold',
							'italic',
							'underline',
							'link',
							'image',
							'ul',
							'ol',
							'outdent',
							'indent',
							'quote',
							'strikethrough',
							'remove'
						],
						ref: (ref) => (this.contentEditableReact = ref),
						...options
					}),
					this.$('.composer__contentEditable')[0],
					() => {
						this.contentEditable = this.contentEditableReact.wysiwyg;

						if (!this.$('.attachments').get(0)) {
							this.$(this.bodyEditorSelector).after(
								'<div class="attachments"></div>'
							);
						}

						// manually call onAttachedToDOM after wysiwyg was initialized
						this.onAttachedToDOM();
					}
				);
			} else {
				this.contentEditable = new PdWysiwyg({
					editorEl: this.$(this.bodyEditorSelector)[0],
					toolbarEl: this.$('.wysiwygEditorToolbar')[0],
					sanitizePasteData: true,
					sanitizeHtml: (html) => this.sanitizeMethod(html),
					...options
				});

				// manually call onAttachedToDOM after wysiwyg was initialized
				this.onAttachedToDOM();
			}
		},

		initTextEditorAfterRender() {
			this.previousContent = this.getData();
			this.contentEditable.callPluginMethod(MergeFieldsPlugin.name, 'convertContentToFields');
		},

		loadAnimation() {
			_.forEach(this.$('.statusAnimation'), function(animationElContainer) {
				lottie.loadAnimation({
					container: animationElContainer,
					renderer: 'svg',
					loop: true,
					autoplay: true,
					animationData: animationData.default,
					rendererSettings: {
						progressiveLoad: false
					}
				});
			});
		},

		onImageAdded(image) {
			const cid = _.trim(image.get('cid'), '<>') || null;

			if (
				this.contentEditable.callPluginMethod(
					InlineImagesPlugin.name,
					'getInlineImageByCid',
					[cid]
				)
			) {
				const url = image.getUrl();

				if (this.$quote) {
					InlineImageHelpers.setInlineImageUrlByCid(this.$quote, cid, image);
				}

				this.contentEditable.callPluginMethod(
					InlineImagesPlugin.name,
					'loadInlineImageByCid',
					[cid, url]
				);
			} else {
				InlineImageHelpers.onImageAdded(this.draftModel, image);
			}
		},

		sanitizeMethod(html) {
			return sanitizeHtml(html, { replaceLinks: true, fullUrlsOnly: true });
		},

		/**
		 * Initializes the attachments view. Filedrop area needs to be specified after render
		 * @void
		 */
		initAttachments: function() {
			this.attachmentsView = new ComposeFilesView({
				relatedModel: this.draftModel,
				collection: this.draftAttchmentsCollection,
				dropArea: this.$('.bodyEditor'),
				customTemplate: attachmentsTemplate,
				onDragOver: this.handleAttachmentsDropArea.bind(this, true),
				onDragDrop: this.handleAttachmentsDropArea.bind(this, false),
				onDragEnd: this.handleAttachmentsDropArea.bind(this, false),
				handleSingleAttachmentDrag: this.handleAttachmentDrag.bind(this, true)
			});

			this.addView({
				'.attachments': this.attachmentsView
			});
			this.attachmentsView.$dropArea
				.find('.closeAttachButton')
				.on('click.mailcompose', (ev) => {
					ev.preventDefault();
					this.attachmentsView.$dropArea.fadeOut();
				});
			this.attachmentsView.on('add', _.debounce(this.onAttachmentAdded, 10), this);
		},

		openScheduleMailModal: function() {
			this.scheduleEmailView = new ScheduleMail({
				sendMail: this.sendMail.bind(this)
			});

			this.addView({
				'.email-components-schedule-email': this.scheduleEmailView
			});

			PDMetrics.trackUsage(null, 'email_send_later', 'clicked', {
				thread_id: this.draftModel.get('mail_thread_id')
			});
		},

		initScheduleMailDropDown: function() {
			this.scheduleMailDropMenu = new DropMenu({
				data: [
					{
						id: 'scheduleMail',
						title: _.gettext('Send later…'),
						click: _.bind(this.openScheduleMailModal, this, false)
					}
				],
				alignRight: true,
				className: 'mailScheduleDropdown',
				target: this.$('.openScheduleMailDropDown'),
				activeOnClick: true
			});
		},

		addScheduleMailDropDownCoachmark: function() {
			const openScheduleMailDropDown = document.querySelector('.openScheduleMailDropDown');

			if (!openScheduleMailDropDown) return;

			iamClient.initialize(() => {
				iamClient.addCoachmark(
					iamClient.coachmarks.SCHEDULE_EMAIL,
					openScheduleMailDropDown,
					{ onConfirm: () => this.openScheduleMailModal() }
				);
			});
		},

		onHeaderViewReady: function() {
			this.initComposerFeatureToolbar();
			// after header is rendered we need to re-calculate height for composer
			this.setBodyMaxHeight();
		},

		initComposerFeatureToolbar: function() {
			this.composerFeatureToolbar = new ComposerFeatureToolbar({
				container: this.$('.wysiwygEditorToolbar'),
				onUpdate: this.updateSignature.bind(this),
				getComposerData: this.getComposerData.bind(this),
				showSignature: !this.options.isDialog,
				showTemplate: true,
				draftModel: this.draftModel,
				relatedModel: this.options.relatedModel,
				disableTemplateEditing: this.options.isDialog,
				bodyEditor: this.contentEditable,
				subjectEditor: this.headerView.subjectEditor,
				saveDraft: this.saveDraft.bind(this),
				setSubject: function(subject) {
					this.headerView.setSubject(subject);
				}.bind(this),
				fontPickersEnabled: this.fontPickersEnabled
			});

			const toolbarClass = this.fontPickersEnabled
				? '.composer__featureToolbar'
				: '.rightSideContent';

			this.addView({
				[toolbarClass]: this.composerFeatureToolbar
			});
		},

		toggleToolbarFieldsPicker: function(isSubjectInFocus) {
			if (this.composerFeatureToolbar) {
				this.composerFeatureToolbar.toggleFieldsPicker(isSubjectInFocus);
			}
		},

		getAttachmentCollection: function() {
			return this.draftModel.getAttachmentCollection();
		},

		initHeaderAndToolbar: function() {
			this.headerView = new HeaderView({
				draftModel: this.draftModel,
				saveDraft: this.saveDraft.bind(this),
				relatedMessage: this.relatedMessage
			});

			this.headerView.ready.onReady(this.onHeaderViewReady.bind(this));

			this.addView({
				'.composer__header-content': this.headerView
			});

			this.listenTo(this.headerView, 'changed', this.liveUpdateModel);
			this.listenTo(this.headerView, 'toggledDetails', this.setBodyMaxHeight);
			this.listenTo(
				this.headerView,
				'subjectFocus',
				this.toggleToolbarFieldsPicker.bind(this, true)
			);
		},

		onAddAttachmentClick: function(ev) {
			ev.preventDefault();

			if (!MailConnections.hasActiveNylasConnection()) {
				return;
			}

			this.attachmentsView.attachFiles();

			PDMetrics.trackUsage(null, 'email_composer', 'interacted', {
				interaction: 'attachment_added',
				wysiwyg_formatting: this.fontPickersEnabled
			});
		},

		getData: function(excludeQuoteSignature, replaceLinks, keepFieldsSyntax) {
			const mailData = _.assignIn(
				{},
				this.draftModel.getRecipients(),
				this.trackingButtonsView && this.trackingButtonsView.getButtonStates()
			);

			mailData.subject = this.headerView.getSubjectValue(keepFieldsSyntax);
			mailData.body = this.getBodyContent(
				excludeQuoteSignature,
				replaceLinks,
				keepFieldsSyntax
			);
			mailData.template_id = this.templateId;

			return mailData;
		},

		getComposerData: function() {
			const mailData = this.getData(false, false, true);

			mailData.attachments = this.attachmentsView.getFilesWithId();

			return mailData;
		},

		getBodyContent(excludeQuoteSignature, replaceLinks, keepFieldSyntax) {
			const $tempDiv = $('<div>');

			$tempDiv.html(
				this.contentEditable.getParsedContent({
					[MergeFieldsPlugin.name]: { keepFieldSyntax }
				})
			);

			if (
				this.$('.richTextArea').hasClass('hasQuote') &&
				!this.$('[data-type="blockQuoteWrapper"]').length &&
				!excludeQuoteSignature
			) {
				$tempDiv.append($('<div><br /></div>')).append(this.getBlockquote());
			}

			if (excludeQuoteSignature) {
				$tempDiv.find('[data-pipedrivesignature]').remove();
			}

			return $.trim(
				sanitizeHtml($tempDiv.html(), { loose: true, replaceLinks, fullUrlsOnly: true })
			);
		},

		/**
		 * Gets the data for sending email
		 * @return {Object} data
		 */
		getDataForSending: function() {
			if (
				this.contentEditable.callPluginMethod(
					MergeFieldsPlugin.name,
					'checkForEmptyFields'
				) ||
				this.headerView.subjectEditor.callPluginMethod(
					MergeFieldsPlugin.name,
					'checkForEmptyFields'
				)
			) {
				return null;
			}

			const data = _.assignIn({}, this.getData(false, true, false));

			if (this.draftModel.getSendmode() !== 'new') {
				data.reply_to_message_id = this.relatedMessage.get('id');
			}

			return data;
		},

		handleAttachmentsDropArea: function(isDragging, ev) {
			this.handleAttachmentDrag(isDragging, ev);

			if (isDragging) {
				this.$el.addClass('upload');
			} else {
				this.$el.removeClass('upload');
			}
		},

		onAttachmentAdded: function(model, collection, options) {
			// Files can be added only to saved model
			if (this.draftModel.isNew() && !model.get('attachmentPlaceholder')) {
				this.saveDraft();
			}

			if (!options.isPulled) {
				this.scrollEditorToBottom();
			}

			this.checkComposerHeight();
		},

		scrollEditorToBottom: function() {
			const $bodyEditorWrapper = this.$('.bodyEditorWrapper, .editorWrapper');

			if ($bodyEditorWrapper[0]) {
				$bodyEditorWrapper.scrollTop($bodyEditorWrapper[0].scrollHeight);
			}
		},

		/**
		 * Focuses composer body
		 * @void
		 */
		focusField: function() {
			const $body = this.$(this.bodyEditorSelector);

			$body.focus();
		},

		ifAllFieldsEmpty: function(data) {
			const isEmpty = _.values(data).map((val) => {
				return String(val) === '';
			});

			return _.uniq(isEmpty).length === 1 && _.uniq(isEmpty)[0];
		},

		bindEventListeners: function() {
			this.$(this.bodyEditorSelector).on(
				'keyup contentChanged',
				_.debounce(this.liveUpdateModel.bind(this), 500)
			);
			this.$(this.bodyEditorSelector).on(
				'focusin',
				this.toggleToolbarFieldsPicker.bind(this, false)
			);
			this.$('.editorToolbar > .buttons > a').on(
				'click',
				_.throttle(this.onEditorToolbarButtonClick.bind(this), 1000)
			);

			this.$('.label').on('click', (ev) => {
				$(ev.target)
					.parents('.field')
					.find('input')
					.focus();
			});

			// handle drop real attachments in footer area
			this.$('.composer__footer').on('dragover', (ev) => ev.preventDefault());
			this.$('.composer__footer').on('drop', (ev) => {
				ev.preventDefault();

				const dataTransfer = ev.originalEvent.dataTransfer;
				const files = dataTransfer ? dataTransfer.files : [];

				files.forEach((file) => {
					this.draftAttchmentsCollection.addLocalFile(file, {
						autoUpload: false
					});
				});

				PDMetrics.trackUsage(null, 'email_composer', 'interacted', {
					interaction: 'drag_and_drop_attachment_added',
					area: 'footer'
				});
			});
		},

		openSignatureModal: async function(ev) {
			ev.preventDefault();

			const modals = await webappComponentLoader.load('froot:modals');
			const params = {
				onSuccess: this.updateSignature.bind(this)
			};

			PDMetrics.trackUsage(null, 'email_composer', 'interacted', {
				interaction: 'signature_accessed',
				wysiwyg_formatting: this.fontPickersEnabled
			});

			modals.open('webapp:modal', { modal: 'mail/mail-signature/mail-signature', params });
		},

		updateSignature: function() {
			const signature = this.draftModel.getSignature();
			const $signatureContainer = this.$('[data-pipedrivesignature]');

			if ($signatureContainer.length > 0) {
				$signatureContainer.replaceWith(signature);
			} else {
				this.draftModel.appendSignatureToBody();
				this.$(this.bodyEditorSelector).html(this.draftModel.get('body'));
			}

			if (!this.draftModel.isNew()) {
				this.saveDraft();
			}
		},

		/**
		 * Callback triggered when user clicks a button in the text editor toolbar.
		 * Waits (defer) till the changes have taken effect and then saves the draft.
		 * @void
		 */
		onEditorToolbarButtonClick: function() {
			const ev = null;

			_.defer(this.liveUpdateModel.bind(this, ev));
		},

		onDiscardClicked: function(ev) {
			ev.preventDefault();

			if ($(ev.currentTarget).hasClass('disabled')) {
				return;
			}

			this.discardDraft();
			setTimeout(() => {
				this.sendPageActionMetrics('discard-button-click');
			}, 0);
		},

		/**
		 * Initiates the draft discarding logic. Simply closes the composer if the draft isn't saved
		 * to the server yet. Otherwise, destroys the draft and then closes the composer.
		 *
		 * @param  {String}   confirmMessage 	(Optional)
		 * @param  {Function} callback 			(Optional)
		 * @void
		 */
		discardDraft: function(confirmMessage, callback) {
			if (this.isCancelling()) {
				return;
			}

			this.isCancelling(true);
			this.clearAutoSaveTimeout();

			callback = callback || this.options.onDraftDiscarded;

			if (this.draftModel.isNew()) {
				if (this.isSaving()) {
					this.deleteAfterSave = true;
				}

				if (_.isFunction(callback)) {
					return callback();
				}
			} else {
				this.deleteSavedDraft(confirmMessage, callback);
			}
		},

		/**
		 * Deletes saved draft with confirmation request
		 * @param  {String}   confirmMessage 	(Optional) If this is passed in, it's used instead of the default message
		 * @param  {Function} callback 			The callback to be called once deleting is done
		 * @void
		 */
		deleteSavedDraft: function(confirmMessage, callback) {
			const defaultConfirmMessage = _.gettext(
				'Are you sure you want to discard this draft? You can’t undo this action.'
			);

			confirmMessage = _.isString(confirmMessage) ? confirmMessage : defaultConfirmMessage;

			if (!window.confirm(confirmMessage)) {
				this.isCancelling(false);

				return;
			}

			this.disableInputs();
			this.$('.composer').css('opacity', 0.6);

			if (this.isSaving()) {
				this.deleteAfterSave = true;

				return;
			}

			this.deleteDraftModel(callback);
		},

		deleteDraftModel: function(callback) {
			this.draftModel.destroy({
				wait: true,
				success: () => {
					if (_.isFunction(callback)) {
						callback();

						return;
					}
				}
			});
		},

		/**
		 * Method prepares/memorizes/gathers the changes in the composer's fields (to/cc/bcc, body) and
		 * saves the draft by chunks - to not to do the save request to the server too often.
		 *
		 * @param  {Object|Null} ev
		 * @void
		 */
		liveUpdateModel: function(ev) {
			const currentContent = this.getData();
			const evType = ev && ev.type;

			if (_.isEqual(this.previousContent, currentContent)) {
				return;
			}

			this.hideSavedText();
			this.previousContent = currentContent;
			this.handleKeyupAutoSave(ev);

			// Don’t trigger new save before last auto update has finished, unless blurring
			if (this.setGetAutoSaveTimeout() && evType !== 'blur') {
				return;
			}

			this.clearAutoSaveTimeout();

			const autoSaveTime = evType === 'keyup' ? 16000 : 0;
			const timeout = this.setTimeout(
				_.bind(this.liveUpdateModelTimeoutCallback, this),
				autoSaveTime
			);

			this.setGetAutoSaveTimeout(timeout);
		},

		/**
		 * @param  {Function} callback 	(optional) A callback to be called once saved
		 * @void
		 */
		saveDraft: function(options) {
			options = options || {};

			if (options.templateId) {
				this.templateId = options.templateId;
			}

			if (
				!MailConnections.hasActiveNylasConnection() ||
				this.draftModel.isSending() ||
				this.draftModel.isSent() ||
				this.isCancelling()
			) {
				return;
			}

			if (this.isSaving()) {
				this.isPendingSave(true);

				return;
			}

			this.isSaving(true);
			this.showSaveStatus();

			const attachmentsForDuplication = this.initiateAttachmentsFromTemplate(
				options.attachments,
				options.templateId
			);
			const data = this.getDataForSaving(options, attachmentsForDuplication);

			data.sendmode = this.draftModel.getSendmode();
			this.draftModel.save(data, {
				success: (model, response) => {
					this.onSaveDraftSuccess(options, model, response);

					if (this.deleteAfterSave) {
						this.deleteAfterSave = false;
						this.deleteDraftModel();
					}
				},
				error: this.onSaveDraftError.bind(this)
			});
		},

		reinitializeAttachments: function(attachments, templateId) {
			const templateRelatedAttachments = this.attachmentsView.getTemplateRelatedAttachments(
				attachments,
				templateId
			);

			if (_.isEmpty(templateRelatedAttachments)) {
				return;
			}

			this.attachmentsView.reInitializeRowViews(templateRelatedAttachments);
		},

		initiateAttachmentsFromTemplate: function(attachments, templateId) {
			if (!templateId) {
				return [];
			}

			const templateRelatedAttachments = this.attachmentsView.getTemplateRelatedAttachments(
				attachments,
				templateId
			);

			this.attachmentsView.removeAttachmentsFromAnotherTemplate(templateId);

			let attachmentsForDuplication = this.attachmentsView.filterAttachmentsForDuplication(
				templateRelatedAttachments,
				templateId
			);

			const notUploadedPreviousAttachments = this.attachmentsView.getNotUploadedTemplateAttachments();

			attachmentsForDuplication = attachmentsForDuplication.concat(
				notUploadedPreviousAttachments
			);
			this.reinitializeAttachments(attachmentsForDuplication, templateId);

			return attachmentsForDuplication;
		},

		onSaveDraftSuccess: function(options, model) {
			const draftRelatedObjFiles =
				this.draftModel.relatedObjects && _.values(this.draftModel.relatedObjects.files);

			this.reinitializeAttachments(draftRelatedObjFiles, options.templateId);
			this.updateDetails();
			this.hideSaveStatus();
			this.isSaving(false);
			this.trigger('saved');

			if (this.isPendingSave()) {
				this.isPendingSave(false);
				this.saveDraft();
			}

			this.draftModel.set({
				has_template_attachments: false,
				file_ids: null
			});

			if (_.isFunction(this.options.onDraftSave)) {
				this.options.onDraftSave({
					model,
					draftStatus: 'open'
				});
			}

			if (options && _.isFunction(options.success)) {
				options.success();
			}
		},

		onSaveDraftError: function(model, response) {
			const errorCode = _.get(response, 'responseJSON.statusCode');
			const alreadySent = Number(errorCode) === 4071;

			if (alreadySent) {
				return this.handleDraftSent();
			}

			window.alert(_.gettext('Could not save draft.'));
			this.hideSaveStatus();
			this.hideSavedText();
			this.isSaving(false);
		},

		onSendButtonClick: function(ev) {
			if (_.isObject(ev)) {
				ev.preventDefault();

				if (
					!MailConnections.hasActiveNylasConnection() ||
					$(ev.currentTarget).hasClass('disabled')
				) {
					return false;
				}

				this.$sendButtonText = this.$(ev.currentTarget).children();
			}

			this.sendMail();
			this.sendPageActionMetrics('send-button-click');
		},

		sendMail: function(options) {
			this.clearAutoSaveTimeout();
			this.clearKeyupTimeout();
			const data = this.getDataForSending();

			if (!data || !this.isSendable(data)) {
				return;
			}

			if (!data.subject) {
				data.subject = `(${_.pgettext('Empty email subject', 'no subject')})`;
			}

			if (options?.delayedUntil || this?.delayedUntil) {
				this.delayedUntil = this.delayedUntil || options?.delayedUntil;
				this.delayedType = this.delayedType || options?.delayedType;
				this.priorityType = this.priorityType || options?.priorityType;

				data.delay_until_time = this.delayedUntil;
				data.priority_type = this.priorityType;
			}

			this.showSendSpinner(this.$sendButtonText);
			this.toggleSendingText(true);
			this.disableInputs();
			this.disableFooterActions();

			if (this.draftReadyForSending()) {
				this.draftModel.send(data, {
					success: this.onSendMailSuccess.bind(this),
					error: this.onSendMailError.bind(this)
				});
				logger.log('Sending mail', this.draftModel);
			}
		},

		ifFileUploadInProgress: function() {
			return this.attachmentsView.collection.isFileUploadInProgress();
		},

		sendWhenFilesReady: function() {
			const attachmentsCollection = this.attachmentsView.collection;

			this.listenToOnce(
				attachmentsCollection,
				'change:state',
				_.bind(function(model, state) {
					if (state === 'ready') {
						if (this.ifFileUploadInProgress()) {
							this.sendWhenFilesReady();
						} else {
							this.sendMail();
						}
					}
				}, this)
			);
		},

		handleDraftSent: async function() {
			if (_.isFunction(this.options.onDraftSent)) {
				this.options.onDraftSent();

				this.handleDraftIfMessageInMailQueue();
			}

			if (this.options.isDialog) {
				const modals = await webappComponentLoader.load('froot:modals');

				modals.close();
			}
		},

		resetScheduledParameters: function() {
			this.delayedUntil = null;
			this.priorityType = null;
			this.delayedType = null;
		},

		handleDraftIfMessageInMailQueue: function() {
			if (this.draftModel.messageModel.get('in_queue')) {
				this.hideSendSpinner(this.$sendButtonText);
				this.toggleSendingText(false);
				this.enableInputs();
				this.enableFooterActions();
				this.resetScheduledParameters();
			}
		},

		getComposerUsageFieldsCount: function() {
			const composerInputTypeCounts = this.contentEditable.callPluginMethod(
				MergeFieldsPlugin.name,
				'getInputTypeCounts'
			);
			const data = {
				personInputCount: composerInputTypeCounts.person || 0,
				dealInputCount: composerInputTypeCounts.deal || 0,
				orgInputCount: composerInputTypeCounts.organization || 0,
				otherInputCount: composerInputTypeCounts.user || 0
			};

			data.totalCount =
				data.personInputCount +
				data.dealInputCount +
				data.orgInputCount +
				data.otherInputCount;

			return data;
		},

		getSubjectUsageFieldsCount: function() {
			const subjectInputTypeCounts = this.headerView.subjectEditor.callPluginMethod(
				MergeFieldsPlugin.name,
				'getInputTypeCounts'
			);
			const data = {
				personInputCount: subjectInputTypeCounts.person || 0,
				dealInputCount: subjectInputTypeCounts.deal || 0,
				orgInputCount: subjectInputTypeCounts.organization || 0,
				otherInputCount: subjectInputTypeCounts.user || 0
			};

			data.totalCount =
				data.personInputCount +
				data.dealInputCount +
				data.orgInputCount +
				data.otherInputCount;

			return data;
		},

		getTemplateAttachmentsCount: function(mail) {
			if (!mail.attachmentCollection) {
				return 0;
			}

			const templateAttachments = mail.attachmentCollection.where((file) => {
				return !!file.get('mail_template_id');
			});

			return templateAttachments.length;
		},

		showMessageSentSnackbar: async function() {
			if (this.priorityType && this.delayedUntil) {
				const router = await webappComponentLoader.load('froot:router');
				const dt = moment.utc(this.delayedUntil).local();
				const formattedDateTime = `${dt.format('pd_day_month')}, ${dt.format('LT')}`;

				snackbar.show({
					text: _.gettext('Email is scheduled to be sent on %s', formattedDateTime),
					showAction: true,
					actionText: _.gettext('View'),
					onActionClick: () => router.navigateTo('/mail/outbox'),
					duration: 'medium',
					showCloseButton: true
				});
			} else {
				snackbar.show({
					text: _.gettext('Message sent')
				});
			}
		},

		/**
		 * @param  {module:Pipedrive.Model} mail
		 * @void
		 */
		onSendMailSuccess: function(mail) {
			const composerFieldCounts = this.getComposerUsageFieldsCount();
			const subjectFieldCounts = this.getSubjectUsageFieldsCount();
			const dealId = mail.get('deal_id') || mail.threadModel.get('deal_id');
			const leadId = mail.get('lead_id') || mail.threadModel.get('lead_id');

			this.showMessageSentSnackbar();

			const defaultTrackingBody = {
				template_id: this.templateId,
				dialog: this.options.isDialog || false,
				thread_id: mail.get('mail_thread_id') || null,
				deal_id: dealId || null,
				lead_id: leadId || null,
				open_tracking_on: !!mail.get('mail_tracking_open_mail'),
				link_tracking_on: !!mail.get('mail_tracking_link'),
				person_merge_field_count:
					composerFieldCounts.personInputCount + subjectFieldCounts.personInputCount,
				deal_merge_field_count:
					composerFieldCounts.dealInputCount + subjectFieldCounts.dealInputCount,
				org_merge_field_count:
					composerFieldCounts.orgInputCount + subjectFieldCounts.orgInputCount,
				other_merge_field_count:
					composerFieldCounts.otherInputCount + subjectFieldCounts.otherInputCount,
				total_merge_field_count:
					composerFieldCounts.totalCount + subjectFieldCounts.totalCount,
				subject_total_merge_field_count: subjectFieldCounts.totalCount,
				template_attachment_count: this.getTemplateAttachmentsCount(mail),
				attachment_count: mail.attachmentCollection.length
			};
			const trackingProperties = this.delayedUntil
				? {
						componentName: 'email_schedule',
						actionName: 'created',
						bodyProps: {
							...defaultTrackingBody,
							date_time_selection: this.delayedType,
							date_time_value: this.delayedUntil
						}
				  }
				: {
						componentName: 'email',
						actionName: 'sent',
						bodyProps: defaultTrackingBody
				  };

			PDMetrics.trackUsage(
				null,
				trackingProperties.componentName,
				trackingProperties.actionName,
				trackingProperties.bodyProps
			);

			logger.log('Send mail complete', mail);

			if (this.trackingButtonsView) {
				this.trackingButtonsView.setCurrentStateToMailConnections();
			}

			this.handleDraftSent();
		},

		onSendMailError: function(model, response) {
			const errorCode = _.get(response, 'responseJSON.statusCode');
			const alreadySent = Number(errorCode) === 4071;

			if (alreadySent) {
				return this.onSendMailSuccess(model);
			}

			this.alertUserOnFailedSend(response);
			this.hideSendSpinner(this.$sendButtonText);
			this.toggleSendingText(false);
			this.enableInputs();
			this.enableFooterActions();
		},

		alertUserOnFailedSend: function(response) {
			const errorCode = _.get(response, 'responseJSON.statusCode');
			const mailProvider = MailConnections.getConnectedNylasConnection().get('provider');
			const message = this.getSendingErrorMessage(errorCode, mailProvider);

			window.alert(message);
		},

		getSendingErrorMessage: function(errorCode, mailProvider) {
			let message;

			if (sendingErrorMessages.hasOwnProperty(errorCode)) {
				if (sendingErrorMessages[errorCode].hasOwnProperty(mailProvider)) {
					message = sendingErrorMessages[errorCode][mailProvider];
				} else {
					message = sendingErrorMessages[errorCode].default;
				}
			}

			return message || sendingErrorMessages.default;
		},

		/**
		 * Part of method liveUpdateModel
		 * Saves the draft
		 * @void
		 */
		liveUpdateModelTimeoutCallback: function() {
			this.saveDraft();

			this.clearAutoSaveTimeout();
			this.clearKeyupTimeout();
		},

		handleKeyupAutoSave: function(ev) {
			if (!ev) {
				return;
			}

			const afterKeyupSaveTime = _.includes(['keyup'], ev.type) ? 2000 : 0;

			this.clearKeyupTimeout();
			const afterKeyupTimeout = this.setTimeout(
				_.bind(this.liveUpdateModelTimeoutCallback, this),
				afterKeyupSaveTime
			);

			this.setKeyupTimeout(afterKeyupTimeout);
		},

		setGetAutoSaveTimeout: function(timeout) {
			if (!_.isUndefined(timeout)) {
				this.autoSaveTimeout = timeout;
			}

			return this.autoSaveTimeout;
		},

		setKeyupTimeout: function(timeout) {
			if (!_.isUndefined(timeout)) {
				this.keyupTimeout = timeout;
			}
		},

		clearAutoSaveTimeout: function() {
			if (this.autoSaveTimeout) {
				clearTimeout(this.autoSaveTimeout);
				this.autoSaveTimeout = null;
			}
		},

		clearKeyupTimeout: function() {
			if (this.keyupTimeout) {
				clearTimeout(this.keyupTimeout);
				this.keyupTimeout = null;
			}
		},

		onUnload: function() {
			const cancelling = this.isCancelling();
			const savedDraft = !this.draftModel.isNew();
			const threadRemoved = this.draftModel.threadModel.get('active_flag') === false;
			const draftAlreadySent = this.draftModel.isSent() || this.draftModel.isSending();

			// If someone has focus on fields, then switches threads, save draft on background
			if (!threadRemoved && !cancelling && savedDraft && !draftAlreadySent) {
				this.saveDraft();
			}

			this.contentEditable.unload();
			app.global.unbind('mailMessage.model.*.delete', this.onDraftDeleted, this);
			cancelAnimationFrame(this.animationRequestId);

			// Unload attachmentsView component
			if (this.attachmentsView) {
				this.attachmentsView.$dropArea.off('.mailcompose');
				this.attachmentsView.off();
				this.attachmentsView.unload();
			}
		}
	}
);

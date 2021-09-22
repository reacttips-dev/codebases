const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const TabsView = require('views/ui/tabs');
const SchedulePicker = require('components/scheduler-2/schedule-picker/index');
const InvoicePicker = require('components/invoice/invoice-picker/index');
const DragAndDrop = require('views/ui/drag-and-drop');
const FlowComposeTemplate = require('templates/shared/flow/compose.html');
const scheduleButtonTemplate = require('components/scheduler-2/schedule-picker/flow-button.html');
const invoiceButtonTemplate = require('components/invoice/invoice-picker/flow-button.html');
const FlowComposeFilesTemplate = require('templates/shared/flow/compose-files.html');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const $ = require('jquery');
const iamClient = require('utils/support/iam');
const {
	getFlowView,
	createFlowOnShow,
	getActivityWysiwygSelector
} = require('views/modals/activity-v2/helpers');
const PDMetrics = require('utils/pd-metrics');

/**
 * Flow Compose component.
 *
 * Contains tabs for specific type editors.
 *
 * <pre>
 * this.compose = new FlowCompose({
 *   el: $('.flowCompose'),
 *   model: this.model
 * });
 * </pre>
 *
 * @classdesc
 * Component for adding new content to flow.
 *
 * @class views/shared/flow/Compose
 * @augments module:Pipedrive.View
 */
module.exports = Pipedrive.View.extend(
	/** @lends views/shared/flow/Compose.prototype */
	{
		template: _.template(FlowComposeTemplate),

		/**
		 * Is the composer in open state
		 * @type {Boolean}
		 */
		open: false,

		/**
		 * related deal or person model
		 * @type {model}
		 */
		model: null,

		lastActive: 'note',
		customSenderFlag: User.settings.get('custom_sender_name_field_visible'),
		notePlaceholder: User.companyFeatures.get('in_app_mentions')
			? _.gettext('Take a note, @name...')
			: _.gettext('Click here to take notes...'),

		wysiwygTabsSelectors: {
			activity: getActivityWysiwygSelector(),
			note: '.tabs .flowComponentEditor.note .bodyEditor'
		},

		initialize: function(options) {
			this.options = options;
			this.model = options.model;

			this.initSubViews();

			this.listenToEmailClicks = _.bind(this.listenToEmailClicks, this);
			this.$el.on('closeComposer', _.bind(this.closeCompose, this));
			this.render();
			this.$('.headers li').click(_.bind(this.openCompose, this));

			this.enableDragFileCompose();
			app.global.bind('ui.dnd.dropzone.enable', _.bind(this.enableDragFileCompose, this));
			app.global.bind('ui.dnd.dropzone.disable', _.bind(this.disableDragFileCompose, this));
		},

		initSubViews: function() {
			this.tabsView = new TabsView({
				tabs: this.getTabsConfs(),
				activeIconClassName: 'blue'
			});

			this.addView('.tabs', this.tabsView);

			MailConnections.onReady(() => {
				this.tabsView.showTab('email');
			});

			iamClient.initialize();
		},

		onFocus: function() {
			this.$el.closest('.viewContainer').on('click', 'a', this.listenToEmailClicks);
		},

		onBlur: function() {
			this.$el.closest('.viewContainer').off('click', 'a', this.listenToEmailClicks);
		},

		listenToEmailClicks: function(event) {
			const aElement = event.target;

			const url = aElement.getAttribute('href');

			if (url && url.match(/^mailto:/) && aElement.getAttribute('target') !== '_blank') {
				const usePipedriveMailtoLinks = User.settings.get('use_pipedrive_mailto_links');
				const hasNylasConnection = MailConnections.hasActiveNylasConnection();

				if (usePipedriveMailtoLinks && hasNylasConnection) {
					// if user has active email sync, we don't add bcc address to email composer
					const newUrl = url.replace(/\?bcc=(.*)/, '').replace('mailto:', '');

					this.openMailCompose(newUrl);
					event.preventDefault();
					event.stopPropagation();
				}
			}
		},

		toShowMailComposerTab: function() {
			return MailConnections.isReady();
		},

		getTabsConfs: function() {
			const tabConfs = {
				note: this.getNoteTabConfs(),
				activity: this.getActivityTabConfs(),
				call: this.getCallerTabConfs(),
				email: this.getEmailTabConfs(),
				file: this.getFileTabConfs()
			};

			const canShowDocumentsTab =
				this.model.type === 'deal' &&
				(User.companyFeatures.get('docbase') ||
					User.companyFeatures.get('docbase_grandfathered'));

			if (canShowDocumentsTab) {
				tabConfs.document = this.getDocumentTabConfs();
			}

			if (
				User.companyFeatures.get('invoice_integration') &&
				!User.companyFeatures.get('invoice_integration_alpha') &&
				this.model.type === 'deal'
			) {
				tabConfs.invoice = this.getInvoiceTabConfs();
			}

			if (_.isNull(tabConfs.email)) {
				delete tabConfs.email;
			}

			return tabConfs;
		},

		getNoteTabConfs: function() {
			return {
				title: _.gettext('Notes'),
				view: import(/* webpackChunkName: "tabcontent" */ 'views/shared/flow/compose-note'),
				icon: 'sm-note',
				active: true,
				viewOptions: {
					relatedModel: this.model
				},
				onShow: _.bind(function() {
					this.lastActive = 'note';
					this.syncNoteBetweenTabs(
						this.wysiwygTabsSelectors.activity,
						this.wysiwygTabsSelectors.note
					);
				}, this)
			};
		},

		getActivityTabConfs: function() {
			const self = this;

			return {
				title: _.gettext('Activity'),
				dataAttr: 'add-activity-tab',
				view: getFlowView(),
				icon: 'sm-calendar',
				viewOptions: {
					relatedModel: this.model,
					closeCompose: _.bind(this.closeCompose, this)
				},
				onShow: function() {
					return createFlowOnShow(self, this);
				}
			};
		},

		getEmailTabConfs: function() {
			return {
				title: _.gettext('Email'),
				icon: 'sm-email',
				dataAttr: 'send-email-tab',
				onShow: function() {
					PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
						'mail-v2.feature': 'flow-mail-composer',
						'mail-v2.action': 'show-composer'
					});

					this.lastActive = 'email';
					this.disableDragFileCompose();
				}.bind(this),
				view: import(
					/* webpackChunkName: "tabcontent" */ 'views/shared/flow/mail/compose-email/index'
				),
				viewOptions: {
					relatedModel: this.model
				},
				hidden: !this.toShowMailComposerTab()
			};
		},

		getFileTabConfs: function() {
			return {
				title: _.gettext('Files'),
				view: import(/* webpackChunkName: "tabcontent" */ 'views/shared/compose-files'),
				icon: 'sm-file',
				viewOptions: {
					relatedModel: this.model,
					customTemplate: FlowComposeFilesTemplate,
					googleDriveSupport: true,
					onDragOver: function(ev, fileComposeView) {
						// See if the dragover is on the composer. If so switch to file compose.
						if ($(ev.target).closest(this.el).length) {
							this.openFileCompose();
						}

						fileComposeView.$('.flowComponentEditor').addClass('is-dragOver');
					}.bind(this),
					onDragEnd: function(ev, fileComposeView) {
						fileComposeView.$('.flowComponentEditor').removeClass('is-dragOver');
					}
				},
				onShow: _.bind(function() {
					this.lastActive = 'file';
					this.enableDragFileCompose();
				}, this)
			};
		},
		getDocumentTabConfs: function() {
			return {
				title: _.gettext('Documents'),
				view: import(/* webpackChunkName: "tabcontent" */ 'views/shared/compose-document'),
				icon: 'ac-document',
				viewOptions: {
					relatedModel: this.model,
					closeCompose: _.bind(this.closeCompose, this)
				},
				onShow: _.bind(function() {
					this.lastActive = 'document';
				}, this)
			};
		},
		getInvoiceTabConfs: function() {
			return {
				title: _.gettext('Invoice'),
				view: import(
					/* webpackChunkName: "tabcontent" */ 'views/shared/flow/compose-invoice'
				),
				icon: 'sm-invoice',
				viewOptions: {
					relatedModel: this.model,
					closeCompose: _.bind(this.closeCompose, this)
				},
				onShow: _.bind(function() {
					this.lastActive = 'invoice';
				}, this)
			};
		},

		getCallerTabConfs: function() {
			return {
				title: _.gettext('Call'),
				view: import(
					/* webpackChunkName: "tabcontent" */
					'views/shared/flow/compose-call'
				),
				icon: 'call',
				viewOptions: {
					relatedModel: this.model,
					closeCompose: _.bind(this.closeCompose, this)
				},
				onShow: _.bind(function() {
					this.lastActive = 'call';
				}, this),
				hidden: !User.companyFeatures.get('caller_1.1')
			};
		},

		/**
		 * Open the file compose.
		 * Disable the original DropZone as the file compose has its own.
		 * Later we use the file composes dropzone to find out if we should open the file compose again.
		 * We will only have one active dropzone and we should gain on speed doing this.
		 */
		openFileCompose: function() {
			if (!this.open || !_.includes(['file', 'email'], this.tabsView.getActiveTab())) {
				this.tabsView.prepareTab('file');
				this.openCompose();
			}
		},

		openMailCompose: function(mailTo) {
			this.tabsView.prepareTab('email');

			if (_.has(this.tabsView.tabs.email.viewOptions, 'mailTo')) {
				app.global.fire('deal.flow.compose.update', mailTo);
			} else {
				this.tabsView.tabs.email.viewOptions.mailTo = mailTo;
			}

			this.openCompose();
		},

		openComposeTab: function(tabId) {
			this.tabsView.prepareTab(tabId);
			this.openCompose();
		},
		/**
		 * Open composer
		 * @void
		 */
		openCompose: function() {
			this.open = true;
			this.render();

			if (this.tabsView.getActiveTab() === 'activity') {
				app.global.fire('flow.compose.activity.open');
			}

			if (User.companyFeatures.get('in_app_mentions')) {
				iamClient.addCoachmark(
					iamClient.coachmarks.MENTIONS_WYSIWYG,
					document.querySelector('.editorToolbar')
				);
			}

			const emailButton = document.querySelector('.emailSettingsBtn');

			if (emailButton) {
				if (!MailConnections.isMicrosoftConnection()) {
					iamClient.initialize(() => {
						iamClient.addCoachmark(
							iamClient.coachmarks.EMAIL_SENDER_NAME_FIELD,
							emailButton
						);
					});
				}
			}
		},
		/**
		 * Close composer
		 * @void
		 */
		closeCompose: function(ev) {
			if (ev && _.isFunction(ev.preventDefault)) {
				ev.preventDefault();
			}

			this.resetNoteInTabs([
				this.wysiwygTabsSelectors.note,
				this.wysiwygTabsSelectors.activity
			]);
			this.open = false;
			this.render();
		},

		selfRender: function() {
			this.$el.html(this.template(this));

			this.$('.fakeInput').click(_.bind(this.openCompose, this));
			this.$('.closeBtn').click(_.bind(this.closeCompose, this));

			this.showTooltips();
		},

		afterRender: function() {
			this.tabsView.update();
			this.initScheduler();

			/**
			 * Since invoicePicker is already the invoice service itself
			 * to fetch the deal model at time we first init the service in onAttachedToDOM
			 * in after render we validate if the invoicePicker already exists and we attach the view again
			 */
			if (this.invoicePicker) {
				this.attachInvoicePickerToView();
			}
		},

		initScheduler: function() {
			MailConnections.onReady(() => {
				if (MailConnections.hasActiveNylasConnection()) {
					return;
				}

				this.schedulePicker = new SchedulePicker({
					popoverButtonTemplate: _.template(scheduleButtonTemplate),
					entryPointName: 'detailsView',
					type: 'popover',
					popoverPlacement: 'bottom'
				});

				this.$('.tabs .headers')
					.find('[data-target="activity"]')
					.parent()
					.after('<div class="hasIcon  schedule-tab"></div>');

				this.addView({ '.schedule-tab': this.schedulePicker });
			});
		},

		attachInvoicePickerToView: function() {
			this.$('.tabs .headers').append('<div class="hasIcon  invoice-tab"></div>');

			this.addView({ '.invoice-tab': this.invoicePicker });
		},

		initInvoice: function() {
			if (
				User.companyFeatures.get('invoice_integration') &&
				User.companyFeatures.get('invoice_integration_alpha') &&
				this.model.type === 'deal'
			) {
				this.invoicePicker = new InvoicePicker({
					popoverButtonTemplate: _.template(invoiceButtonTemplate),
					dealModel: this.model
				});

				this.attachInvoicePickerToView();
			}
		},

		onAttachedToDOM() {
			this.initInvoice();

			this.schedulePicker && this.schedulePicker.rerender();

			const invoiceCoachmarkPlaceholder = this.$el.find('[data-target=invoice]');

			if (invoiceCoachmarkPlaceholder) {
				iamClient.addCoachmark(iamClient.coachmarks.INVOICE_CREATE_NEW, {
					coachmarkPlaceholder: invoiceCoachmarkPlaceholder
				});
			}

			if (User.companyFeatures.get('in_app_mentions')) {
				iamClient.addCoachmark(
					iamClient.coachmarks.MENTIONS_NOTES_COMPOSER,
					document.querySelector('.fakeInput')
				);
			}

			const documentsCoachmarkPlaceholder = this.$el.find('[data-target=document]');

			if (documentsCoachmarkPlaceholder) {
				iamClient.addCoachmark(iamClient.coachmarks.NEW_DOCUMENTS_TAB, {
					coachmarkPlaceholder: documentsCoachmarkPlaceholder
				});
			}

			if (
				User.isPlatinumOrHigher() &&
				User.companyFeatures.get('docbase_alpha') &&
				documentsCoachmarkPlaceholder
			) {
				iamClient.addCoachmark(iamClient.coachmarks.SMART_DOCS_NEW_FEATURE, {
					coachmarkPlaceholder: documentsCoachmarkPlaceholder
				});
			}

			this.$el
				.closest('.viewContainer')
				.off('click', 'a', this.listenToEmailClicks)
				.on('click', 'a', this.listenToEmailClicks);
		},

		addScrollIfEditorHasTable: function(editor) {
			const tableExists = editor.find('table').length;

			if (tableExists) {
				editor.css('overflow', 'auto');
			} else if (!tableExists && editor.css('overflow') === 'auto') {
				editor.css('overflow', '');
			}
		},

		syncNoteBetweenTabs: function(fromTabSelector, toTabSelector) {
			const $fromNote = this.$(fromTabSelector);
			const $toNote = this.$(toTabSelector);
			const isDefaultText = $fromNote.text() === $fromNote.data('default');

			if (isDefaultText) {
				$toNote.addClass('defaultText');
				$toNote.html($toNote.data('default'));
			} else {
				$toNote.removeClass('defaultText');
				$toNote.html($fromNote.html());
				this.addScrollIfEditorHasTable($toNote);
			}
		},

		resetNoteInTabs: function(selectors) {
			_.forEach(selectors, (selector) => {
				const $note = this.$(selector);

				$note.text($note.data('default'));
				$note.html('').trigger('input');
			});
		},

		showTooltips: function() {
			this.$('[data-tooltip]').each(function() {
				$(this).tooltip({
					tip: this.getAttribute('data-tooltip'),
					preDelay: 200,
					postDelay: 200,
					zIndex: 20000,
					fadeOutSpeed: 100,
					position: 'top',
					clickCloses: true
				});
			});
		},

		enableDragFileCompose: function() {
			this.dragAndDrop = new DragAndDrop.dropZone({
				el: this.$el,
				type: ['files'],
				dragOver: _.bind(this.openFileCompose, this)
			});
		},

		disableDragFileCompose: function() {
			this.dragAndDrop.unload();
		},

		onUnload: function() {
			this.disableDragFileCompose();
		}
	}
);

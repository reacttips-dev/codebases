'use strict';

const { remove } = require('@pipedrive/fetch');
const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const CollectionView = require('./mails-collection-view/mails-collection-view');
const MailMessageView = require('./mails-collection-view/mail-message');
const ComposerComponent = require('components/mail-components/composer/index');
const ComposerView = ComposerComponent.getComposer('reply-forward');
const { getAvatar } = require('utils/mail/get-avatar');
const DraftModel = require('models/mail/draft');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const template = require('./single-thread-body.html');
const DropMenu = require('views/ui/dropmenu');
const ConfirmationDialog = require('views/ui/confirmation-dialog');
const snackbar = require('snackbars');
const $ = require('jquery');
const logger = new Pipedrive.Logger('mail', 'single-thread-body');
const PDMetrics = require('utils/pd-metrics');

const MailThreadBodyView = Pipedrive.View.extend({
	template: _.template(template),
	events: {
		'messageCollapsed': 'manageCollapsingButtons',
		'messageExpanded': 'manageCollapsingButtons',
		'mailActionInvoked': 'openComposerOnMailAction',
		'click .footer .actions a': 'onFooterActionClick'
	},

	sharingDropmenu: null,

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.threadModel = this.options.threadModel;
		this.STATE = new Pipedrive.Model({
			draft: null
		});
		this.mailsCollection = this.threadModel.getMailsCollection();
		app.global.bind('mailQueueItem.model.*.add', this.addMailQueueParamsToThread, this);
		app.global.bind('mailQueueItem.model.*.update', this.sentQueuedEmail, this);
		app.global.bind('mailQueueItem.model.*.delete', this.removeMailQueueParamsFromThread, this);

		if (this.threadModel.hasDraft()) {
			this.listenToOnce(this.mailsCollection, 'change', _.bind(this.scrollToBottom, this));
		}

		this.listenTo(this.mailsCollection, 'remove', _.bind(this.onMailMessageRemoved, this));
		this.initChildViews();
	},

	render: function() {
		MailConnections.onReady(Pipedrive.View.prototype.render.bind(this));
	},

	sentQueuedEmail: function(ev) {
		if (
			// eslint-disable-next-line camelcase
			ev.id === this.threadModel.get('mail_queue')?.mail_queue_id &&
			ev.get('status') === 'sent'
		) {
			this.threadModel.set('mail_queue', []);
			this.pullMailsCollection();
		}
	},

	removeMailQueueParamsFromThread: function(deleteEvent) {
		const scheduledMailQueueID =
			// eslint-disable-next-line camelcase
			this.threadModel.get('mail_queue')?.mail_queue_id ||
			this.threadModel.get('mail_queue')?.id;

		if (deleteEvent === scheduledMailQueueID) {
			this.threadModel.set('mail_queue', []);
			this.pullMailsCollection();
			this.setDraftState({ draftStatus: 'open' });
		}
	},
	addMailQueueParamsToThread: function(socketEv) {
		if (this.threadModel.id === socketEv.get('mail_thread_id')) {
			this.pullMailsCollection();

			this.threadModel.set('mail_queue', {
				delay_until_time: socketEv.get('delay_until_time'),
				mail_queue_id: socketEv.get('id'),
				mail_thread_id: socketEv.get('mail_thread_id'),
				priority_type: socketEv.get('priority_type'),
				status: socketEv.get('status')
			});

			this.toggleFooter(false);
		}
	},

	onLoad: function() {
		this.listenTo(this.threadModel, 'change:shared_flag', this.onSharedFlagChanged);
		this.listenTo(this.mailsCollection, 'draftAdded', this.handleDraftData);
		this.pullMailsCollection();
	},

	getTemplateHelpers: function() {
		return {
			User,
			thread: this.threadModel,
			mailsCollection: this.mailsCollection,
			scheduledMail: !_.isEmpty(this.threadModel.get('mail_queue')),
			collapseAll: this.onExpandCollapseClicked.bind(this, 'collapse'),
			expandAll: this.onExpandCollapseClicked.bind(this, 'expand'),
			toShowFooter: !!MailConnections.hasActiveNylasConnection(),
			avatarHTML: getAvatar(User.get('name'), '', User.attributes.icon_url),
			replyMode: this.getReplyMode()
		};
	},

	onMailMessageRemoved: function() {
		const messagesCount = this.mailsCollection.length;

		if (messagesCount) {
			if (!_.isEmpty(this.mailsCollectionView.mailGroups)) {
				this.mailsCollectionView.groupMailMessages();
			}

			this.mailsCollectionView.expandLastMailMessage();

			if (messagesCount === 1) {
				this.$el.find('.collapseExpandButtons').hide();
			}
		}
	},

	onSharedFlagChanged: function(model, isShared) {
		this.$('.mailThreadBody').toggleClass('shared', !!isShared);
	},

	afterRender: function() {
		this.manageCollapsingButtons();
		this.mailsCollectionView.groupMailMessages();
		this.initTooltips();
		this.createDropMenu();
	},

	createDropMenu: function() {
		const data = [
			{
				titleHtml: `<span class="actionContainer">
					<span class="actionIcon">
					${_.icon('unlocked', 'small')}
					</span>
					<span class="actionHeaderText">
					${_.gettext('Share within your company')}
					</span>
					<p class="actionDescriptionText">
					${_.gettext(
						'This email conversation will be visible to others only when it’s linked ' +
							'to contacts and deals in Pipedrive.'
					)}
					</p>
					</span>`,
				click: this.onShareOptionClick.bind(this, true)
			},
			{
				titleHtml: `<span class="actionContainer">
					<span class="actionIcon">
					${_.icon('ac-padlock', 'small')}
					</span>
					<span class="actionHeaderText">
					${_.gettext('Keep this conversation private')}
					</span>
					<p class="actionDescriptionText">
					${_.gettext(
						'This email conversation can still be linked to contacts and deals in Pipedrive,' +
							'but it will only be visible to you.'
					)}
					</p>
					</span>`,
				click: this.onShareOptionClick.bind(this, false)
			}
		];

		this.sharingDropmenu = new DropMenu({
			target: this.$('.sharingButtonWrapper'),
			ui: 'arrowDropmenu mailSharePrivate position',
			alignMiddle: true,
			activeOnClick: true,
			data,
			onOpen: function(dropMenu, dropMenuCallback) {
				this.$('.downUpButtonContainer').toggleClass('openDropMenu', true);
				dropMenuCallback();
			}.bind(this),
			onClose: function() {
				this.$('.downUpButtonContainer').toggleClass('openDropMenu', false);
			}.bind(this)
		});
	},

	onShareOptionClick: function(toShared) {
		this.threadModel.toggleVisibility(toShared);
		this.showShareSnack(toShared);
		this.sendMetrics('change-shared-state', {
			'mail-v2.param': toShared ? 'to-shared' : 'to-private'
		});
	},

	showShareSnack: function(toShared) {
		let text;

		if (toShared) {
			text = _.gettext('The conversation has been shared with others');
		} else {
			text = _.gettext('The conversation has been made private');
		}

		snackbar.show({
			text
		});
	},

	sendMetrics: function(action, params) {
		const data = _.assignIn(
			{
				'mail-v2.feature': 'single-thread_actions-bar',
				'mail-v2.action': action
			},
			params
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', data);
	},

	onFocus: function() {
		if (!this.threadModel.get('read_flag')) {
			this.threadModel.toggleReadFlag(true);
		}
	},

	initChildViews: function() {
		this.initializeMailsCollectionView();

		// Composer gets initialized after data (mails collection and thread model) is pulled.

		this.addView({
			'.mailMessages': this.mailsCollectionView
		});
	},

	onCollectionSort: function() {
		this.mailsCollectionView.collapseAll();
	},

	initializeMailsCollectionView: function() {
		const collectionViewOptions = {
			collection: this.mailsCollection,
			childView: MailMessageView,
			callCollectionPull: false
		};
		const mailMessageViewOptions = {
			className: 'mail-msg-comp'
		};
		const collectionViewCallbacks = {
			onCollectionSort: _.bind(this.onCollectionSort, this)
		};

		this.mailsCollectionView = new CollectionView(
			collectionViewOptions,
			mailMessageViewOptions,
			collectionViewCallbacks
		);
		this.listenTo(
			this.mailsCollectionView,
			'allMessagesCollapsed allMessagesExpanded',
			this.manageCollapsingButtons,
			collectionViewCallbacks
		);
	},

	getExpDynOpts: function() {
		return {
			hasWindowHeight: true,
			$scrollableContainer: this.$('.mailThreadBody')
		};
	},

	/**
	 * Pulls the mails collection and also the thread model if it's not passed into the view via the options.
	 * @void
	 */
	pullMailsCollection: function() {
		const pullOptions = {
			success: this.onMailsCollectionPulled.bind(this)
		};

		this.pull(this.mailsCollection, pullOptions);
	},

	/**
	 * Renders the view and opens the composer if thread has a draft in it.
	 * @void
	 */
	onMailsCollectionPulled: function() {
		if (!this.mailsCollection.length) {
			throw new Error('Mails missing in mails collection in single-thread!');
		}

		this.render();
		this.handleDraftData();
	},

	/**
	 * Opens the composer if there is a draft in thread
	 * @void
	 */
	handleDraftData: function() {
		const draftModel = this.mailsCollection.getDraft();
		const existingDraftModel = this.STATE.get('draft');

		if (
			existingDraftModel &&
			draftModel &&
			existingDraftModel.get('id') === draftModel.get('id') &&
			this.STATE.get('draftStatus') === 'closed'
		) {
			logger.warn('Prevented opening a composer. Draft was discarded or already sent!');

			return;
		} else if (draftModel) {
			this.openExistingDraft(draftModel);
		}

		return draftModel;
	},

	/**
	 * Opens the draft in the composer view
	 * @param  {module:Pipedrive.Model} draftModel
	 * @void
	 */
	openExistingDraft: function(draftModel) {
		const relatedMessageId = draftModel.get('reply_to_message_id');

		let composerOptions = {
			draftModel,
			expandDynamically: true,
			expDynOpts: this.getExpDynOpts(),
			relatedMessage: this.mailsCollection.get(relatedMessageId),
			sendmode: draftModel.get('sendmode')
		};

		composerOptions = _.assignIn({}, this.options.composerOptions, composerOptions);

		this.openComposer(composerOptions);
	},

	scrollToBottom: function() {
		const $scrollable = this.options.composerOptions
			? this.options.composerOptions.expDynOpts.$scrollableContainer
			: this.$('.mailThreadBody');

		if ($scrollable[0]) {
			$scrollable.scrollTop($scrollable[0].scrollHeight);
		}
	},

	cancelScheduledMailConfirmation: function() {
		const confirmMessageTitle = _.gettext("Can't add message");
		const dialogBody = _.gettext(
			'You have a scheduled message in this email thread. Do you want to cancel the sending and move the scheduled message to drafts?'
		);
		const mailQueueId =
			this.options.threadModel.get('mail_queue').id ||
			this.threadModel.get('mail_queue').mail_queue_id;

		this.confirmationDialog = new ConfirmationDialog({
			el: 'body',
			title: confirmMessageTitle,
			message: dialogBody,
			primaryButton: {
				title: _.gettext('Keep as is')
			},
			secondaryButton: {
				title: _.gettext('Cancel and move to drafts'),
				color: 'red',
				onClick: () => {
					remove(`/api/v1/mailbox/mailQueue/${mailQueueId}?keepDraft`).catch((err) => {
						logger.warn('Cancelling scheduled mail failed', {
							error: err && err.message
						});
					});
					snackbar.show({ text: _.gettext('Message has been moved to drafts') });
				}
			}
		});

		return this.confirmationDialog.render();
	},

	/**
	 * Event handler for mail related actions (e.g user selects 'reply' or 'forward')
	 * @param  {Object} ev 				event object
	 * @param  {String} action 			name of the action
	 * @param  {Object} relatedMessage 	the model that triggered the event
	 * @void
	 */
	openComposerOnMailAction: function(ev, action, relatedMessage) {
		if (!_.isEmpty(this.threadModel.get('mail_queue'))) {
			return this.cancelScheduledMailConfirmation();
		}

		let composerOptions = {
			relatedMessage,
			subject: this.threadModel.get('subject'),
			sendmode: action,
			expandDynamically: true,
			expDynOpts: this.getExpDynOpts()
		};

		composerOptions = _.assignIn({}, this.options.composerOptions, composerOptions);

		this.openComposer(composerOptions);
	},

	/**
	 * Handles the "Reply all" and "Forward" button clicks in the single-thread view's footer
	 * @param  {Object} ev 	Event object
	 * @void
	 */
	onFooterActionClick: function(ev) {
		ev.preventDefault();

		const lastMessageModel = this.mailsCollection.last();

		if (!_.isEmpty(this.threadModel.get('mail_queue'))) {
			return this.cancelScheduledMailConfirmation();
		}

		const sendmode = $(ev.target).data('action');

		let composerOptions = {
			relatedMessage: lastMessageModel,
			subject: this.threadModel.get('subject'),
			sendmode,
			expandDynamically: true,
			expDynOpts: this.getExpDynOpts()
		};

		composerOptions = _.assignIn({}, this.options.composerOptions, composerOptions);
		this.openComposer(composerOptions);
		this.sendPageActionMetrics('invoke-mail-action', {
			'mail-v2.param.action': sendmode
		});
	},

	/**
	 * Initializes, attaches and renders the composer view
	 * @param  {Object} composerOptions 	Options to be passed into the composer view
	 * @void
	 */
	openComposer: function(composerOptions) {
		if (this.composerView) {
			const openingExistingDraft =
				composerOptions.relatedMessage?.get('id') ===
				this.composerView.getRelatedMessageId();

			this.scrollToBottom();

			if (!openingExistingDraft) {
				const confirmMessage = _.gettext(
					'There already is a draft in this conversation. ' +
						'Do you want to discard it and create a new one?'
				);
				const callback = _.bind(this.initializeNewComposerView, this, composerOptions);

				this.composerView.discardDraft(confirmMessage, callback);
			} else if (composerOptions.sendmode !== this.composerView.sendmode) {
				this.changeCurrentComposerSendmode(composerOptions.sendmode);
			}
		} else {
			this.initializeNewComposerView(composerOptions);
			this.scrollToBottom();
		}

		this.toggleFooter(false);

		this.setDraftState({
			model: composerOptions.draftModel,
			draftStatus: 'open'
		});
	},

	/**
	 * Initializes, attaches and opens the composer.
	 * Closes the current composer, if there already is one opened.
	 * @param  {Object} composerOptions
	 * @void
	 */
	initializeNewComposerView: function(composerOptions) {
		if (this.composerView) {
			this.removeComposer();
		} else {
			this.toggleFooter(false);
		}

		if (!composerOptions.draftModel) {
			const draftAttrs = {
				sendmode: composerOptions.sendmode
			};
			const draftOptions = {
				relatedMessage: composerOptions.relatedMessage
			};

			composerOptions.draftModel = this.createAndSetDraftModel(draftAttrs, draftOptions);
		}

		composerOptions.draftModel.setThreadModel(this.threadModel);

		const composerCallbacks = {
			onDraftSave: this.setDraftState.bind(this),
			onDraftSent: this.onComposerClose.bind(this),
			onDraftDiscarded: this.onComposerClose.bind(this)
		};

		// override default expDynOpts params after modal was opened
		const composerViewOptions = {
			...composerOptions,
			...{ expDynOpts: this.getExpDynOpts() },
			...composerCallbacks
		};

		this.composerView = new ComposerView(composerViewOptions);

		this.addView('.replyForwardComposer', this.composerView);

		this.focusCorrectComposerField(composerOptions.sendmode);

		this.listenTo(this.composerView, 'changedHeight', _.bind(this.scrollToBottom, this));
	},

	setDraftState: function(options) {
		const model = options.model || this.STATE.get('draft');
		const draftStatus = options.draftStatus;

		this.STATE.set({
			draftStatus,
			draft: model
		});
	},

	focusCorrectComposerField: function(sendmode) {
		if (sendmode === 'forward') {
			this.composerView.headerView.focusField('to');
		} else {
			this.composerView.focusField();
		}
	},

	removeComposer: function() {
		this.removeView('.replyForwardComposer', true);
		this.composerView = null;
	},

	/**
	 * Changes the sendmode of current active composer draft in thread
	 * @param  {String} newSendmode
	 * @void
	 */
	changeCurrentComposerSendmode: function(newSendmode) {
		this.composerView.changeSendmode(newSendmode);
	},

	/**
	 * Removes the contents of the composer view from the DOM, shows the footer/action-bar again
	 * @void
	 */
	onComposerClose: function() {
		this.removeComposer();
		this.toggleFooter(true);
		this.setDraftState({ draftStatus: 'closed' });
	},

	/**
	 * Shows or hides the footer of the single-thread view
	 * @param  {Boolean} showOrHide 	true - shows, false - hides
	 * @void
	 */
	toggleFooter: function(showOrHide) {
		this.$('.footer').toggle(showOrHide);
	},

	/**
	 * Creates a new draft model and assigns it to the mails collection.
	 * @param  {Object} draftAttrs
	 * @return {module:Pipedrive.Model}
	 */
	createAndSetDraftModel: function(draftAttrs, draftOptions) {
		const draftModel = new DraftModel(draftAttrs, draftOptions);

		this.mailsCollection.setDraftModel(draftModel);

		return draftModel;
	},

	/**
	 * Switches between "Collapse all" and "Expand all" buttons
	 * If thread has atleast one message collapsed, then show "Expand all"
	 * Otherwise show "Collapse all"
	 * @void
	 */
	manageCollapsingButtons: function() {
		const $actionButtons = this.$('.collapseExpandButtons');

		if ($actionButtons.length === 0) {
			return;
		}

		if (this.mailsCollectionView.hasCollapsedMessages()) {
			$actionButtons.find('.expandAll').show();
			$actionButtons.find('.collapseAll').hide();
		} else {
			$actionButtons.find('.expandAll').hide();
			$actionButtons.find('.collapseAll').show();
		}
	},

	/**
	 * Initializes tooltips
	 * @void
	 */
	initTooltips: function() {
		this.$('.collapseExpandButtons > .collapseAll').tooltip({
			tip: _.gettext('Collapse all'),
			position: 'bottom'
		});
		this.$('.collapseExpandButtons > .expandAll').tooltip({
			tip: _.gettext('Expand all'),
			position: 'bottom'
		});
	},

	onExpandCollapseClicked: function(action) {
		if (action === 'expand') {
			this.mailsCollectionView.expandAll();
		} else if (action === 'collapse') {
			this.mailsCollectionView.collapseAll();
		}

		this.sendPageActionMetrics('expand-collapse-all-messages');
	},

	getReplyMode: function() {
		const replyModes = {
			reply: {
				string: _.gettext('Reply'),
				mode: 'reply'
			},
			reply_all: {
				string: _.gettext('Reply all'),
				mode: 'reply_all'
			}
		};
		const lastMessage = this.mailsCollection.at(this.mailsCollection.length - 1);

		return replyModes[lastMessage.getDefaultReplyMode()] || replyModes.reply;
	},

	onUnload: function() {
		app.global.unbind('mailQueueItem.model.*.add', this.addMailQueueParamsToThread, this);
		app.global.unbind('mailQueueItem.model.*.update', this.sentQueuedEmail, this);
		app.global.unbind(
			'mailQueueItem.model.*.delete',
			this.removeMailQueueParamsFromThread,
			this
		);
	},

	sendPageActionMetrics: function(action, optionalParameters) {
		const metricsData = _.assignIn(
			{
				'mail-v2.feature': 'single-thread',
				'mail-v2.action': action
			},
			optionalParameters
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
	}
});

module.exports = MailThreadBodyView;

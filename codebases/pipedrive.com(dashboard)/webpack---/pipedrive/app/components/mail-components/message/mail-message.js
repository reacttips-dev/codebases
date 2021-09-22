'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const { sanitizeHtml } = require('@pipedrive/sanitize-html');
const { remove } = require('@pipedrive/fetch');
const logger = new Pipedrive.Logger('mail', 'message');
const AttachmentsView = require('components/mail-components/attachments/attachments');
const BodyView = require('./body/body');
const MessageActions = require('./message-actions/message-actions');
const MailMsgUtils = require('utils/mail/mail-message-utils');
const template = require('./mail-message.html');
const Company = require('collections/company');
const Person = require('models/person');
const DropMenu = require('views/ui/dropmenu');
const ConfirmationDialog = require('views/ui/confirmation-dialog');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const OpenTrackingTooltipHelper = require('utils/mail/tracking-tooltip-utils/show-open-tracking-tooltip');
const { getAvatar } = require('utils/mail/get-avatar');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');
const snackbar = require('snackbars');

/**
 * Describes if the mail sender is linked user, person or doesn't have any link at all
 * @type {Object}
 */
const SenderLinkTypes = {
	LINKED_WITH_USER: 'user',
	LINKED_WITH_PERSON: 'person'
};
const MailMessageView = Pipedrive.View.extend({
	template: _.template(template),

	/**
	 * Uses SenderLinkTypes to define whether the sender is linked to user or person
	 * @type {Object}
	 */
	senderLinkType: null,

	/**
	 * User related to the message sender
	 * @type {Object}
	 */
	senderUser: null,

	/**
	 * Person related to the message sender
	 * @type {Object}
	 */
	senderPerson: null,

	/**
	 * Indicates wheter the mail message content is collapsed or expanded
	 * @type {Boolean}
	 */
	collapsed: true,

	openTrackingTooltipHelper: null,

	events: {
		'click .headerInfo a.party': 'onPartyClicked',
		'click .headerInfo .collapseExpandButtons button': 'showHideDetails',
		'click .scheduledMessageActions': 'renderScheduledActionsDropmenu'
	},

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.linkSender();

		this.initializeMessageActions();
	},

	render: function() {
		MailConnections.onReady(Pipedrive.View.prototype.render.bind(this));
	},

	/**
	 * Binds user or person to a mail sender if possible
	 * @void
	 */
	linkSender: function() {
		const userID = this.model.getSenderUserID();
		const personID = this.model.getSenderPersonID();

		if (userID) {
			this.senderLinkType = SenderLinkTypes.LINKED_WITH_USER;
			this.senderUser = this.getSenderUser();
		} else if (personID) {
			this.senderLinkType = SenderLinkTypes.LINKED_WITH_PERSON;
			this.senderPerson = this.getSenderPerson();
			this.pull(this.senderPerson, { success: _.bind(this.render, this) });
		}
	},

	getTemplateHelpers: function() {
		const isScheduledMail = !_.isEmpty(this.model.get('mail_queue'));
		const noContentText = _.gettext('This message has no content.');
		const hasBody = !!this.model.get('has_body_flag');
		const fromPartyName = this.getFromPartyName();
		const scheduledMailTimestamp =
			isScheduledMail && this.model.get('mail_queue').delay_until_time;
		const messageTime = scheduledMailTimestamp
			? this.model.get('mail_queue').delay_until_time
			: this.model.get('message_time');

		return {
			model: this.model,
			replyForwardAllowed: MailConnections.hasActiveNylasConnection(),
			messageTime: sanitizeHtml(MailMsgUtils.getMessageTimeString(messageTime), {
				loose: true
			}),
			messageTimeTooltip: MailMsgUtils.getMessageTimeTooltip(messageTime),
			getPartiesLinks: _.bind(this.getPartiesLinks, this),
			snippet: hasBody ? this.model.get('snippet') : noContentText,
			// Real body added later asynchronously
			body: hasBody ? '' : noContentText,
			fromPartyName,
			isScheduledMail,
			scheduledMailTimestamp,
			avatarHTML: getAvatar(
				fromPartyName,
				_.get(this.model.get('from'), '[0].email_address', ''),
				this.getAvatarURL()
			)
		};
	},

	getFromPartyName: function() {
		const fromPartyData = this.model.get('from') && this.model.get('from')[0];

		return fromPartyData ? fromPartyData.linked_person_name || fromPartyData.name || '' : '';
	},

	onAttachedToDOM: function() {
		this.initTooltips();

		if (this.$('.scheduledMessageActions')[0]) {
			this.scheduledMessageActionsDropmenu = new DropMenu({
				target: this.$('.scheduledMessageActions'),
				className: 'mailScheduleDropdown',
				alignRight: true,
				activeOnClick: false,
				data: [
					{
						titleHtml: _.gettext('Cancel and move to drafts'),
						click: () => this.onScheduledEmailCancel('keepDraft')
					},
					{
						titleHtml: _.gettext('Cancel and delete'),
						click: () => this.onScheduledEmailCancel()
					}
				]
			});
		}
	},

	afterRender: function() {
		this.$el.toggleClass('noContent', !this.model.get('has_body_flag'));

		this.initOpenTrackingIcon();
	},

	initOpenTrackingIcon: function() {
		const toShow = this.toShowTrackingIcon();

		this.$('.trackingIcon').toggle(!!toShow);
		this.stopListening(this.model, 'change:mail_tracking_status');
		this.openTrackingTooltipHelper = null;
		this.$('.trackingIcon svg').off('mouseenter');

		if (toShow) {
			const isOpened = this.model.get('mail_tracking_status') === 'opened';

			this.$('.trackingIcon').toggleClass('opened', isOpened);

			if (isOpened) {
				this.openTrackingTooltipHelper = new OpenTrackingTooltipHelper({
					$target: this.$('.trackingIcon svg'),
					collectionOpts: { messageId: this.model.get('id') }
				});
				this.$('.trackingIcon svg').mouseenter(this.onTrackingIconMouseEnter.bind(this));
			} else {
				this.$('.trackingIcon svg').tooltip({
					tip: _.gettext('Not opened yet'),
					position: 'bottom'
				});

				this.listenTo(
					this.model,
					'change:mail_tracking_status',
					this.initOpenTrackingIcon.bind(this)
				);
			}
		}

		this.listenToOpenTrackingSettingChange();
	},

	initializeMessageActions: function() {
		this.messageActionsView = new MessageActions({
			model: this.model,
			fromPartyName: this.getFromPartyName(),
			getPartiesLinks: this.getPartiesLinks.bind(this),
			sendPageActionMetrics: this.sendPageActionMetrics.bind(this)
		});

		this.addView({ '.messageActions': this.messageActionsView });
	},

	onTrackingIconMouseEnter: function() {
		this.openTrackingTooltipHelper.showTooltip();
	},

	listenToOpenTrackingSettingChange: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();

		this.stopListening(activeConnection, 'change:mail_tracking_open_mail_flag');
		this.listenTo(
			activeConnection,
			'change:mail_tracking_open_mail_flag',
			this.initOpenTrackingIcon.bind(this)
		);
	},

	toShowTrackingIcon: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const openTrackinSettingEnabled =
			activeConnection && activeConnection.get('mail_tracking_open_mail_flag');
		const isEmailTrackingEnabled = MailConnections.isEmailTrackingEnabled();

		return (
			this.model.isOwnerOfMessage() &&
			openTrackinSettingEnabled &&
			isEmailTrackingEnabled &&
			this.model.get('mail_tracking_status')
		);
	},

	getPartiesLinks: function(partyType, withEmail) {
		const parties = this.model.get(partyType);

		let partiesLinks;

		if (_.isEmpty(parties)) {
			if (partyType === 'to' && this.model.isUndisclosedRecipients()) {
				partiesLinks = _.gettext('Undisclosed recipients');
			} else {
				partiesLinks = null;
			}
		} else {
			partiesLinks = MailMsgUtils.getPartiesLinks(parties, withEmail);
		}

		return partiesLinks;
	},

	/**
	 * Gets the avatar URL of a person on user
	 * @return {String} URL of the picture
	 */
	getAvatarURL: function() {
		let avatarURL = '';

		if (this.senderLinkType === SenderLinkTypes.LINKED_WITH_USER) {
			avatarURL = this.senderUser.get('icon_url');
		} else if (this.senderLinkType === SenderLinkTypes.LINKED_WITH_PERSON) {
			avatarURL = this.senderPerson.getPictureUrl();
		}

		return avatarURL;
	},

	onFocus: function() {
		if (!this.model.get('body') && this.model.get('has_body_flag') && !this.collapsed) {
			this.setBodyView();
		}
	},

	getSenderUser: function() {
		const userID = this.model.getSenderUserID();

		return userID ? Company.where({ id: userID })[0] : null;
	},

	getSenderPerson: function() {
		const personID = this.model.getSenderPersonID();

		let person = null;

		if (personID) {
			person = new Person({ id: personID });
		}

		return person;
	},

	/**
	 * Collapses/expands mail message.
	 * If param 'collapse' isn't passed, it will toggle previous state.
	 * Also will trigger mail message loading on uncollapsed messages if .messageBody still empty
	 * @param  {Boolean} collapse (optional) to collapse or expand
	 * @param  {Boolean} silent   (optional) to trigger event or not
	 * @void
	 */
	toggleCollapse: function(collapse, silent) {
		if (!_.isBoolean(collapse)) {
			collapse = !this.collapsed;
		}

		if (!collapse && this.shouldAddBodyView()) {
			this.setBodyView();
		}

		if (!collapse && this.toInitRealAttachments()) {
			this.initAttachmentsView();
		}

		this.$el.toggleClass('collapsed', collapse);
		this.collapsed = collapse;

		if (!silent) {
			const eventName = collapse ? 'messageCollapsed' : 'messageExpanded';

			this.$el.trigger(eventName);
		}
	},

	shouldAddBodyView: function() {
		const hasBody = this.model.get('has_body_flag');
		const hasInlineAttachment = this.model.get('has_inline_attachments_flag');

		return (hasBody || hasInlineAttachment) && !this.bodyView && this.focused;
	},

	setBodyView: function() {
		this.bodyView = new BodyView({
			mailModel: this.model,
			onInlineAttachmentError: this.onInlineAttachmentError.bind(this)
		});
		this.addView({ '.messageBody': this.bodyView });
	},

	onInlineAttachmentError: function() {
		this.messageActionsView.STATE.set({
			showAttachmentDropmenu: true
		});
	},

	/**
	 * Whether to init the REAL attachments view
	 * @return {Boolean}
	 */
	toInitRealAttachments: function() {
		return this.model.get('has_real_attachments_flag') && !this.getView('.attachments');
	},

	/**
	 * Inits list attachments view in the messages footer. If no list attachments found, removes the view again.
	 * @void
	 */
	initAttachmentsView: function() {
		const attachmentsView = new AttachmentsView({
			mail_message_id: this.model.get('id'),
			mail_thread_id: this.model.get('mail_thread_id'),
			smart_bcc_flag: this.model.get('smart_bcc_flag')
		});

		this.addView({
			'.attachments': attachmentsView
		});

		this.listenToOnce(attachmentsView, 'noattachments', function() {
			this.removeView('.attachments');
		});
	},

	/**
	 * @return {Boolean} Whether mail message content is collapesed or expanded
	 */
	isCollapsed: function() {
		return this.collapsed;
	},

	onPartyClicked: function(ev) {
		MailMsgUtils.onPartyClicked.call(MailMsgUtils, ev, this.model, this.getTrackingData());
	},

	getTrackingData: function() {
		return {
			parent_object_id: this.model.get('mail_thread_id'),
			parent_object_type: 'mail_thread'
		};
	},

	showHideDetails: function(ev) {
		ev.preventDefault();
		ev.stopPropagation();

		this.sendPageActionMetrics('toggle-header-details');

		this.$('.messageHeader').toggleClass('details');
	},

	removeMailQueueItem: function(type) {
		remove(
			`/api/v1/mailbox/mailQueue/${this.model.get('mail_queue').mail_queue_id}${
				type ? `?${type}` : ''
			}`
		).catch((err) => {
			logger.warn('Cancelling scheduled mail failed', {
				error: err && err.message
			});
		});

		snackbar.show({
			text: _.gettext(
				type === 'keepDraft'
					? 'Message has been moved to drafts'
					: 'Message has been deleted'
			)
		});

		PDMetrics.trackUsage(null, 'email_schedule', 'cancelled', {
			deletion_type: type,
			thread_id: this.model.get('id')
		});

		if (type) {
			return;
		}

		this.model.destroy();
	},

	onScheduledEmailCancel: function(type) {
		const confirmMessageTitle = type
			? _.gettext(
					'Are you sure you want to cancel the sending and move this email to the drafts?'
			  )
			: _.gettext('Are you sure you want to cancel the sending and delete this email?');
		const dialogBody = type
			? _.gettext('This message will be moved to your drafts folder.')
			: _.gettext('This message will be permanently deleted. You cannot restore it later.');
		const secondaryButtonTitle = type
			? _.gettext('Cancel and move to drafts')
			: _.gettext('Cancel and delete');

		this.confirmationDialog = new ConfirmationDialog({
			el: 'body',
			title: confirmMessageTitle,
			message: dialogBody,
			primaryButton: {
				title: _.gettext('Keep as is')
			},
			secondaryButton: {
				title: secondaryButtonTitle,
				color: 'red',
				onClick: () => this.removeMailQueueItem(type)
			}
		});

		this.confirmationDialog.render();
	},

	renderScheduledActionsDropmenu: function() {
		this.scheduledMessageActionsDropmenu.render();
	},

	initTooltips: function() {
		const $elementsWithTooltips = this.$('[data-tooltip]:not([data-tooltip=""])');

		$elementsWithTooltips.each(function() {
			$(this).tooltip({
				tip: $(this).data('tooltip'),
				position: 'top'
			});
		});
	},

	sendPageActionMetrics: function(action, optionalParameters) {
		const metricsData = _.assignIn(
			{
				'mail-v2.feature': 'mail-message-component',
				'mail-v2.action': action
			},
			optionalParameters
		);

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
	}
});

module.exports = MailMessageView;

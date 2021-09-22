'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const rowTemplate = require('./threads-list-row.html');
const moment = require('moment');
const LinkedDealsCollection = require('pages/mail/collections/linked-deals');
const LinkedLeadsCollection = require('pages/mail/collections/linked-leads');
const User = require('models/user');
const MailHelpers = require('utils/mail/helpers');
const PDMetrics = require('utils/pd-metrics');
const DropMenu = require('views/ui/dropmenu');
const snackbars = require('snackbars');
const OpenTrackingTooltipHelper = require('utils/mail/tracking-tooltip-utils/show-open-tracking-tooltip');
const MailMsgUtils = require('utils/mail/mail-message-utils');
const threadSnippet = {
	inbox: 'snippet',
	drafts: 'snippet_draft',
	sent: 'snippet_sent',
	archive: 'snippet',
	search: 'snippet'
};
const ThreadsListRowView = Pipedrive.View.extend({
	template: _.template(rowTemplate),

	linkedDealModel: null,
	sharingDropmenu: null,
	openTrackingTooltipHelper: null,

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.threadModel = this.model;
		this.section = _.get(this.model.collection, 'section') || 'inbox';

		this.initLinkedLeadDealModel();
	},

	events: {
		'click td:not(.selectRowInput)': 'onRowClicked'
	},

	onLoad: function() {
		this.bindEvents();
	},

	onBlur: function() {
		// Remove the class in case user navigated away from the list before the highligh-fade-out animation ended.
		this.$el.removeClass('highlightFadeOut');
	},

	bindEvents: function() {
		this.listenTo(this.model, 'selected', this.updateCheckbox);
		this.listenTo(this.model, 'change', this.onThreadModelChange);
		this.listenTo(this.model, 'highlight', this.highlight);
	},

	templateHelpers: function() {
		return {
			model: this.model,
			section: this.section,
			participants: this.combinePartiesStr(),
			messageCount: this.model.get('message_count'),
			linkedEntityTitle: this.linkedDealModel ? this.linkedDealModel.get('title') : '',
			linkedEntityType: this.getLinkedEntityType(),
			threadTime: this.getThreadTime(),
			snippet: this.getSnippet()
		};
	},

	getSnippet: function() {
		return this.model.get(threadSnippet[this.section]) || '';
	},

	afterRender: function() {
		const hasScheduledMail = !_.isEmpty(this.model.get('mail_queue'));

		this.$el
			.toggleClass('unread', !this.model.get('read_flag'))
			.toggleClass('showTracking', this.toShowTrackingIcon())
			.toggleClass(
				'trackingNotOpened',
				this.model.get('mail_tracking_status') === 'not_opened'
			)
			.toggleClass('hasDraft', !!this.model.get('has_draft_flag') && !hasScheduledMail)
			.toggleClass('hasScheduledItem', hasScheduledMail)
			.toggleClass('hasMultipleMessages', this.model.get('message_count') > 1)
			.toggleClass('archived', this.section === 'search' && !!this.model.get('archived_flag'))
			.toggleClass('isShared', !!this.model.get('shared_flag'))
			.toggleClass('isPrivate', !this.model.get('shared_flag'))
			.toggleClass('hasAttachments', !!this.model.get('has_real_attachments_flag'));

		this.$el.attr('data-test', `thread-row-${this.model.get('id')}`);

		this.initTooltips();

		if (this.options.isLastItem && _.isFunction(this.options.onLastRowRendered)) {
			this.options.onLastRowRendered();
		}

		// for deals we have dealsModal that listens the change:title
		// as we don't have backbone model for leads
		// we need this hack to add lead title after row was rendered and attached to DOM
		if (this.model.get('lead_id')) {
			this.initLinkedLeadDealModel();
		}

		this.createDropMenu();
	},

	createDropMenu: function() {
		const data = [
			{
				titleHtml:
					`${'<span class="actionContainer"><span class="actionIcon">'}${_.icon(
						'unlocked',
						'small'
					)}</span>` +
					`<span class="actionHeaderText">${_.gettext(
						'Share within your company'
					)}</span>` +
					`<p class="actionDescriptionText">${_.gettext(
						'This email conversation will be visible to others only when it’s linked ' +
							'to contacts and deals in Pipedrive.'
					)}</p>` +
					`</span>`,
				click: this.onShareOptionClick.bind(this, true)
			},
			{
				titleHtml:
					`${'<span class="actionContainer"><span class="actionIcon">'}${_.icon(
						'ac-padlock',
						'small'
					)}</span>` +
					`<span class="actionHeaderText">${_.gettext(
						'Keep this conversation private'
					)}</span>` +
					`<p class="actionDescriptionText">${_.gettext(
						'This email conversation can still be linked to contacts and deals in Pipedrive, ' +
							'but it will only be visible to you.'
					)}</p>` +
					`</span>`,
				click: this.onShareOptionClick.bind(this, false)
			}
		];

		this.sharingDropmenu = new DropMenu({
			target: this.$('.sharingButtonWrapper'),
			ui: 'arrowDropmenu mailSharePrivate',
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

		snackbars.show({
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

	onAttachedToDOM: function() {
		if (this.options.isLastItem && _.isFunction(this.options.onLastRowInDOM)) {
			this.options.onLastRowInDOM();
		}
	},

	toShowTrackingIcon: function() {
		let toShow = true;

		if (!this.model.get('mail_tracking_status')) {
			toShow = false;
		} else if (_.includes(['inbox', 'archive', 'search'], this.section)) {
			const lastReceived = moment(this.model.get('last_message_received_timestamp')).unix();
			const lastSent = moment(this.model.get('last_message_sent_timestamp')).unix();

			if (lastReceived && lastSent) {
				toShow = lastReceived < lastSent;
			}
		}

		return toShow;
	},

	getThreadTime: function() {
		let timestampType;

		if (this.section === 'inbox' && this.model.get('last_message_received_timestamp')) {
			timestampType = 'last_message_received_timestamp';
		} else if (this.section === 'sent' && this.model.get('last_message_sent_timestamp')) {
			timestampType = 'last_message_sent_timestamp';
		} else {
			timestampType = 'last_message_timestamp';
		}

		const threadTime = moment.utc(this.model.get(timestampType)).local();

		return this.getFormattedTime(threadTime);
	},

	getFormattedTime: function(threadTime) {
		const todaysDate = moment.utc().local();

		let time;

		if (todaysDate.isSame(threadTime, 'd')) {
			time = threadTime.format('LT');
		} else if (todaysDate.diff(threadTime.startOf('day'), 'years') > 0) {
			time = threadTime.format('L');
		} else {
			time = threadTime.format('pd_day_month');
		}

		return time;
	},

	initTooltips: function() {
		// Tooltip for "date"
		this.$('td.lastMessageTime').tooltip({
			tip: MailMsgUtils.getMessageTimeTooltip(this.model.get('last_message_timestamp')),
			preDelay: 200,
			postDelay: 200,
			zIndex: 20000,
			fadeOutSpeed: 100,
			position: 'top-end',
			addClass: ['threadsListDate']
		});

		this.$('.participants__draftIndicator').tooltip({
			tip: _.gettext('Draft'),
			preDelay: 200,
			postDelay: 200,
			zIndex: 20000,
			fadeOutSpeed: 100,
			position: 'top'
		});

		this.$('.participants__scheduledEmail').tooltip({
			tip: _.gettext('This thread has scheduled email'),
			preDelay: 200,
			postDelay: 200,
			zIndex: 20000,
			fadeOutSpeed: 100,
			position: 'top'
		});

		this.initTrackingTooltip();
	},

	initTrackingTooltip: function() {
		const trackingStatus = this.model.get('mail_tracking_status');
		const $icon = this.$('.tracking svg');

		this.openTrackingTooltipHelper = null;
		$icon.off('mouseenter');

		if (trackingStatus === 'not_opened') {
			$icon.tooltip({
				tip: _.gettext('Not opened yet'),
				position: 'bottom',
				preDelay: 0,
				postDelay: 0
			});
		} else if (trackingStatus === 'opened') {
			this.openTrackingTooltipHelper = new OpenTrackingTooltipHelper({
				$target: $icon,
				collectionOpts: { threadId: this.model.get('id') }
			});
			$icon.mouseenter(this.onTrackingIconMouseEnter.bind(this));
		}
	},

	onTrackingIconMouseEnter: function() {
		this.openTrackingTooltipHelper.showTooltip();
	},

	/**
	 * Builds the participants string for the participants cell, according to the folder
	 * the user is currently viewing.
	 *
	 * @return {String}
	 */
	combinePartiesStr: function() {
		let partiesStr = '';

		const rawParties = this.getParties();
		const parties = this.mergeUserAddresses(rawParties);

		if (parties.length === 1) {
			partiesStr = MailHelpers.getSinglePartyStr(parties[0]);
		} else if (parties.length >= 4) {
			partiesStr = this.combinePartiesStrIfMoreThan3(parties);
		} else {
			partiesStr = this.combinePartiesStrIf2or3(parties);
		}

		return partiesStr;
	},

	/**
	 * Merges all User mail address parties by leaving the first in place and discarding next ones
	 * Used to avoid showing multiple "You" labels in parrties string
	 * @void
	 */
	mergeUserAddresses: function(parties) {
		let userPartyPushed = false;

		const resultArray = [];

		_.forEach(parties, (party) => {
			if (User.isValidatedEmailAddress(party.email_address)) {
				if (userPartyPushed) {
					return;
				}

				resultArray.push(party);
				userPartyPushed = true;
			} else {
				resultArray.push(party);
			}
		});

		return resultArray;
	},

	/**
	 * Returns the right list of participants, according to the folder/section the user is viewing.
	 *
	 * Returns:
	 * - "inbox" and "archive" - all the senders in a conversation in a chronological order
	 * 		(the sender of first message, second, third, etc).
	 * - "sent" - all recipients from messages that were sent (not draft message) by current
	 * 		user (me) in the same order they were added.
	 * - "drafts" - all recipients added to the "to/cc/bcc" fields of the draft message.
	 * 		And only these - NO parties of already sent and received messages.
	 *
	 * @return {Array} The list of objects of participants data
	 */
	getParties: function() {
		let parties = [];

		const partiesInModel = this.model.get('parties');
		const section = this.section === 'search' ? this.model.getValidSection() : this.section;

		if (_.includes(['inbox', 'archive', 'search'], section)) {
			parties = partiesInModel.from;
		} else if (section === 'sent') {
			parties = this.getSentParties(partiesInModel);
		} else if (section === 'drafts') {
			const draftsParties = this.model.get('drafts_parties');

			parties = _.concat(draftsParties.to, draftsParties.cc, draftsParties.bcc);

			return _.uniqBy(parties, 'email_address');
		}

		return _.uniqBy(parties, 'id');
	},

	getSentParties: function(parties) {
		const to = _.filter(parties.to, { latest_sent: true });
		const cc = _.filter(parties.cc, { latest_sent: true });
		const bcc = _.filter(parties.bcc, { latest_sent: true });

		if (_.isEmpty(to) && _.isEmpty(cc) && _.isEmpty(bcc)) {
			// fallback in case BE returns everything with latest_sent false
			const output =
				_.get(parties, 'to[0]') ||
				_.get(parties, 'cc[0]') ||
				_.get(parties, 'bcc[0]') ||
				{};

			return [output];
		}

		return _.concat(to, cc, bcc);
	},

	/**
	 * Used if there are more than 3 parties in the array.
	 *
	 * Format examples:
	 * - In "inbox" or "archive" - "Aleksander … Heli, Ragnar"
	 * - In "sent" or "drafts" - "Aleksander, Heli, Ragnar, …"
	 *
	 * @param  {Array} parties
	 * @return {String} 			Parties combined into a string
	 */
	combinePartiesStrIfMoreThan3: function(parties) {
		let partiesStr = '';

		if (_.includes(['inbox', 'archive', 'search'], this.section)) {
			partiesStr = `${MailHelpers.getSinglePartyStr(parties[0], true)} ... `;
			partiesStr += `${MailHelpers.getSinglePartyStr(parties[parties.length - 2], true)}, `;
			partiesStr += MailHelpers.getSinglePartyStr(parties[parties.length - 1], true);
		} else if (_.includes(['drafts', 'sent'], this.section)) {
			partiesStr = `${MailHelpers.getSinglePartyStr(parties[0], true)}, `;
			partiesStr += `${MailHelpers.getSinglePartyStr(parties[1], true)}, `;
			partiesStr += `${MailHelpers.getSinglePartyStr(parties[2], true)}, ...`;
		}

		return partiesStr;
	},

	/**
	 * Used if there are 2 or 3 parties in the array. Just combines the parties into a string,
	 * where parties are separated by commas.
	 *
	 * @param  {Array} parties
	 * @return {String} 			Parties combined into a string
	 */
	combinePartiesStrIf2or3: function(parties) {
		const partiesStrings = _.map(parties, (partyData) => {
			return MailHelpers.getSinglePartyStr(partyData, true);
		});

		return partiesStrings.join(', ');
	},

	onThreadModelChange: function() {
		this.render();
		const dealId = this.model.get('deal_id');
		const leadId = this.model.get('lead_id');
		const linkedDealId = this.linkedDealModel && this.linkedDealModel.get('id');
		const toInitLinkedLeadDealModel = dealId && (!linkedDealId || linkedDealId !== dealId);

		// toggle hasLinkedEntity class
		// so if deal or lead was unlinked, then icon would be removed
		this.toggleLinkedEntity();

		if (toInitLinkedLeadDealModel || leadId) {
			this.initLinkedLeadDealModel();
		}
	},

	toggleLinkedEntity: function() {
		this.$el.toggleClass('hasLinkedEntity', !!this.getLinkedEntityType());
	},

	getLinkedEntityType: function() {
		if (this.model.get('deal_id')) {
			return 'deal';
		}

		if (this.model.get('lead_id')) {
			return 'lead';
		}
	},

	initLinkedLeadDealModel: function() {
		this.linkedDealModel && this.stopListening(this.linkedDealModel);
		const dealId = this.model.get('deal_id');
		const leadId = this.model.get('lead_id');

		if (leadId) {
			LinkedLeadsCollection.getLead(
				leadId,
				(lead) => lead && this.changeLinkedEntityTitle(lead.title)
			);
		}

		if (dealId) {
			const dataGetDeal = {
				dealId,
				success: function(dealModel) {
					this.linkedDealModel = dealModel;
					this.onLinkedDealTitleChange();
					this.listenTo(
						this.linkedDealModel,
						'change:title',
						this.onLinkedDealTitleChange
					);
				}.bind(this)
			};

			LinkedDealsCollection.getDeal(dataGetDeal);
		} else {
			this.linkedDealModel = null;
		}
	},

	onLinkedDealTitleChange: function() {
		this.changeLinkedEntityTitle(this.linkedDealModel.get('title'));
	},

	changeLinkedEntityTitle: function(title) {
		// toggle hasLinkedEntity class
		this.toggleLinkedEntity();
		this.$('td.linked .linkedEntityTitle').text(title);
	},

	/**
	 * Redirects to the single thread view
	 * @void
	 */
	onRowClicked: function() {
		let section;

		if (this.model.isDraftOnly()) {
			section = 'new';
		} else {
			section = this.section;
		}

		app.router.go(null, `/mail/${section}/${this.model.id}`);
	},

	/**
	 * Triggers click on row selection checkbox if chekcbox status is different from model rowSelected
	 */
	updateCheckbox: function() {
		const checkbox = this.$('.selectRowInput input');

		if (checkbox.is(':checked') !== this.model.rowSelected) {
			checkbox.trigger('click');
		}

		this.$el.toggleClass('selected', checkbox.is(':checked'));
	},

	highlight: function() {
		const $thisEl = this.$el;

		$thisEl
			.addClass('highlightFadeOut')
			.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', () => {
				$thisEl.removeClass('highlightFadeOut');
			});
	}
});

module.exports = ThreadsListRowView;

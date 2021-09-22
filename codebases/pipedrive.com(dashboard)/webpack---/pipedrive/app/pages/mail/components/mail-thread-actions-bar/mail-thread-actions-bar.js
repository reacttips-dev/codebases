'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const iamClient = require('utils/support/iam');
const MailConnections = require('collections/mail/global-singletons/mail-connections');

/**
 * A base-component to be used by extending actions-bars. Not meant to be used directly.
 */

const ActionsBarComponent = Pipedrive.View.extend({
	events: {
		'click .barItems .back': 'onBackButtonClick',
		'click .threadNavigation .cui4-button': 'onThreadNavClick'
	},

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
		this.threadModel = this.options.threadModel;
		this.threadNavigationEnabled = !!this.options.threadsCollection;

		if (this.threadNavigationEnabled) {
			this.threadsCollection = this.options.threadsCollection;
		}
	},

	onLoad: function() {
		this.bindEvents();

		this.render();
	},

	bindEvents: function() {
		if (this.threadNavigationEnabled) {
			this.listenTo(this.threadsCollection, 'sync', this.onCollectionSync);
			this.listenTo(
				User.counts,
				`change:${this.options.section}_mail_threads_count`,
				this.updateConversationCounter
			);
		}
	},

	updateConversationCounter: function() {
		this.$('[data-threads-count]').text(
			User.counts.get(`${this.options.section}_mail_threads_count`)
		);
	},

	getThreadPosition: function() {
		return (
			this.threadsCollection &&
			this.threadsCollection.getThreadIndexById(this.threadModel.get('id')) + 1
		);
	},

	getTemplateHelpers: function() {
		const threadCount = this.threadsCollection && this.threadsCollection.getCount();
		const currentThreadPosition = this.getThreadPosition();
		const showSettingsButton = User.settings.get('custom_sender_name_field_visible');
		const showThreadCounter = !!(
			!this.threadModel.isNew() &&
			currentThreadPosition &&
			threadCount
		);

		let templateHelpers = {
			showThreadCounter,
			showSettingsButton
		};

		if (showThreadCounter) {
			templateHelpers = _.assignIn({}, templateHelpers, {
				threadCount,
				currentThreadPosition,
				nextThreadHref: this.getNextThreadHref(),
				previousThreadHref: this.getPreviousThreadHref()
			});
		}

		return templateHelpers;
	},

	afterRender: function() {
		this.renderCoachmark();
		this.initTooltips();
	},

	initTooltips: function() {
		this.$('.threadNavigation .previous').tooltip({
			tip: _.gettext('Previous'),
			position: 'bottom'
		});

		this.$('.threadNavigation .next').tooltip({
			tip: _.gettext('Next'),
			position: 'bottom'
		});

		this.$('.threadNavigation .emailSettingsButton').tooltip({
			tip: _.gettext('Email settings'),
			position: 'bottom'
		});
	},

	renderCoachmark: function() {
		const settingsButton = document.querySelector('.emailSettingsButton');

		if (!settingsButton) {
			return;
		}

		if (!MailConnections.isMicrosoftConnection()) {
			iamClient.initialize(() => {
				iamClient.addCoachmark(
					iamClient.coachmarks.EMAIL_SENDER_NAME_FIELD,
					settingsButton
				);
			});
		}
	},

	getNextThreadHref: function() {
		let href = '';

		const nextId = this.getNextThreadId();

		if (nextId) {
			const nextThreadModel = this.threadsCollection.find({ id: nextId });

			href = `/mail/${
				nextThreadModel.isDraftOnly() ? 'new' : this.options.section
			}/${nextId}`;
		}

		return href;
	},

	getNextThreadId: function() {
		const nextThreadId = this.threadsCollection.getNextThreadId(this.threadModel);

		if (!nextThreadId) {
			const pullOptions = {
				data: {
					folder: this.options.section
				}
			};

			this.threadsCollection.pullPage(pullOptions);
		}

		return nextThreadId;
	},

	getPreviousThreadHref: function() {
		let href = '';

		const previousId = this.getPreviousThreadId();

		if (previousId) {
			const previousThreadModel = this.threadsCollection.find({ id: previousId });

			href = `/mail/${
				previousThreadModel.isDraftOnly() ? 'new' : this.options.section
			}/${previousId}`;
		}

		return href;
	},

	getPreviousThreadId: function() {
		return this.threadsCollection.getPreviousThreadId(this.threadModel);
	},

	onCollectionSync: function() {
		this.render();
	},

	getSearchPrevPath: function() {
		const lastKeyword = this.threadsCollection.getSearchKeyword();
		const lastPartyId = this.threadsCollection.getPartyData('partyId');

		let prevSearchPath;

		if (lastKeyword) {
			prevSearchPath = `/mail/search/bykeyword/${lastKeyword}`;
		} else if (lastPartyId) {
			prevSearchPath = `/mail/search/byparty/${lastPartyId}`;
		}

		return prevSearchPath;
	},

	getBackButtonHref: function() {
		const isSearch = this.options.section === 'search';
		const section = this.threadModel.getValidSection();
		const prevPath = (isSearch && this.getSearchPrevPath()) || `/mail/${section}`;

		return prevPath;
	},

	/**
	 * Simply, tracks the action and lets the default stuff happen.
	 * @void
	 */
	onBackButtonClick: function() {
		app.router.go(null, this.getBackButtonHref(), true, false);
		this.sendMetrics('back-button-click');
	},

	/**
	 * Simply, tracks the action and lets the default stuff happen.
	 * @void
	 */
	onThreadNavClick: function() {
		this.sendMetrics('thread-navigation-click');
	}
});

module.exports = ActionsBarComponent;

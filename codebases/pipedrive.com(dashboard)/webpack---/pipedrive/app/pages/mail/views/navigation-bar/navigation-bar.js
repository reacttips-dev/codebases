'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const template = require('./navigation-bar.html');
const $ = require('jquery');
const MailViewAnalytics = require('utils/analytics/mail-view-analytics');
const PDMetrics = require('utils/pd-metrics');

const NavigationBar = Pipedrive.View.extend({
	template: _.template(template),

	section: null,

	events: {
		'click .active': 'onActiveItemClick',
		'click li.compose a': 'onComposeClick',
		'click .folder a': 'trackMailViewFolderChanged'
	},

	initialize: function(options) {
		this.options = options;
		this.router = options.router;
		this.router.on('sectionChange', this.setActiveItem, this);
	},

	onLoad: function() {
		this.render();
		this.listenTo(User.counts, 'change:unread_mail_threads_inbox_count', this.render);
		this.listenTo(User.counts, 'change:unsent_mail_threads_outbox_count', this.render);
		this.listenTo(MailConnections.instance, 'change add', this.render);
		MailConnections.onReady(this.render.bind(this));
	},

	getTemplateHelpers: function() {
		return {
			inboxUnreadCount: User.counts.get('unread_mail_threads_inbox_count'),
			outboxUnsentCount: User.counts.get('unsent_mail_threads_outbox_count'),
			syncRelatedButtonsEnabled:
				!MailConnections.hasNeverConnected() ||
				this.options.toShowSilverGoldPlatinumMailPromo(),
			composeTooltip: _.gettext('Compose'),
			groupEmailingEnabled: User.companyFeatures.get('group_emailing_beta'),
			scheduleForLaterEnabled: User.companyFeatures.get('scheduled_emails')
		};
	},

	afterRender: function() {
		if (this.section) {
			this.setActiveItem(this.section);
		}

		this.initTooltips();
	},

	setActiveItem: function(section) {
		this.section = section;

		this.$('li.folder.active').removeClass('active');
		this.$(`li.folder.${this.section}`).addClass('active');
	},

	initTooltips: function() {
		const $elementsWithTooltips = this.$('[data-tooltip]:not([data-tooltip=""])');

		$elementsWithTooltips.each(function() {
			$(this).tooltip({
				tip: $(this).data('tooltip'),
				preDelay: 0,
				postDelay: 0,
				position: 'right'
			});
		});
	},

	onActiveItemClick: function(ev) {
		const clickedPath = $(ev.currentTarget)
			.find('a')
			.attr('href');

		this.trigger('activeItemClicked', clickedPath);
	},

	onComposeClick: function() {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'navigation-bar',
			'mail-v2.action': 'mail-compose-button-click'
		});
	},

	trackMailViewFolderChanged: function(ev) {
		const mailFolder = $(ev.currentTarget).data('section');

		MailViewAnalytics.trackMailViewFolderChanged(mailFolder);
	}
});

module.exports = NavigationBar;

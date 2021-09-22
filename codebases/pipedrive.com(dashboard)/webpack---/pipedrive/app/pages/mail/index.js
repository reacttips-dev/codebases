'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('./main.html');
const NavigationBarView = require('./views/navigation-bar/navigation-bar');
const Router = require('./router');
const User = require('models/user');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const MailViewAnalytics = require('utils/analytics/mail-view-analytics');
const PDMetrics = require('utils/pd-metrics');
const defaultOptions = {};

module.exports = Pipedrive.View.extend({
	/** @lends pages/mail/MailMainView.prototype */
	stackable: true,
	hasFilledPastSyncBar: false,
	template: _.template(template),
	templateHelpers: {},

	events: {
		'click .userReconnect .nylasReconnectLink': 'onUserReconnect',
		'click .nylasReauth .nylasReauthLink': 'onUserReauth',
		'click .userReconnect .cui4-message__close': 'onUserReconnectWarningClose'
	},

	/**
	 * Mailpage	 View
	 *
	 * @class  MailMainView View
	 * @constructs
	 * @augments module:Pipedrive.View
	 *
	 * @param {Object} options Options to set for the mailbox view
	 * @returns {pages/mail/MailMainView} Returns itself
	 */
	initialize: function(options) {
		this.options = _.assignIn({}, options, defaultOptions);

		this.router = new Router({
			toShowSilverGoldPlatinumMailPromo: this.toShowSilverGoldPlatinumMailPromo.bind(this)
		});
		this.initChildViews();

		this.sendMetrics('mail-page-loaded');
	},

	onLoad: function() {
		this.render();
	},

	onMailConnectionsChange: function() {
		this.updateLastDisconnectedEmail();
		this.updateLastConnectedEmail();
		this.toggleNoticeBar('nylasReauth', MailConnections.needsNylasReauth());
		this.toggleNoticeBar('userReconnect', MailConnections.needsUserReconnect());
		this.toggleNoticeBar('pastSync', MailConnections.isPastSyncing());
	},

	toggleNoticeBar: function(noticeBarName, toShow) {
		this.$(`.noticeBar.${noticeBarName}`).toggleClass('active', !!toShow);

		const hasActiveNoticeBars = !!this.$('.noticeBar.active').length;

		this.$('#mail .mainSectionWrapper').toggleClass('noticeBarActive', hasActiveNoticeBars);
	},

	updateLastDisconnectedEmail: function() {
		const lastDisconnectedAccount = MailConnections.getLastDisconnectedAccount();
		const emailAddress = lastDisconnectedAccount
			? lastDisconnectedAccount.get('email_address')
			: '';

		this.$el.find('.noticeBar.userReconnect .emailAddress').text(emailAddress);
	},

	updateLastConnectedEmail: function() {
		const connectedAccount = MailConnections.getConnectedNylasConnection();
		const emailAddress = connectedAccount ? connectedAccount.get('email_address') : '';

		this.$el.find('.noticeBar.pastSync .emailAddress').text(emailAddress);
	},

	initChildViews: function() {
		this.navigationBarView = new NavigationBarView({
			router: this.router,
			toShowSilverGoldPlatinumMailPromo: this.toShowSilverGoldPlatinumMailPromo.bind(this)
		});
		this.addView({ '.navigationBar': this.navigationBarView });
		this.listenTo(this.navigationBarView, 'activeItemClicked', this.onActiveNavItemClick);
	},

	afterRender: function() {
		this.router.viewStack.setContainer(this.$('.mainSectionWrapper'));

		this.listenTo(MailConnections.instance, 'change add remove', this.onMailConnectionsChange);
		MailConnections.onReady(this.onMailConnectionsChange.bind(this));
	},

	/**
	 * If is in a threads-list and clicks on that list's item in mail's main navigation bar
	 * again, the list scrolls back to top.
	 * @param  {String} clickedPath 	The url path of the clicked item
	 * @void
	 */
	onActiveNavItemClick: function(clickedPath) {
		const currentStackView = this.router.viewStack.getCurrent();

		// Removes "/" from the beginning of the path to make it comparable
		clickedPath = clickedPath.substring(1);

		if (currentStackView.key === clickedPath) {
			currentStackView.instance.onActiveNavItemClick();
		}
	},

	onUserReconnectWarningClose: function() {
		this.toggleNoticeBar('userReconnect', false);

		User.settings.set('hide_email_reconnect_warning', true);
		User.settings.save();

		MailConnections.trigger('change');

		MailViewAnalytics.warningClosed();
	},

	onUserReconnect: function(ev) {
		ev.preventDefault();
		MailConnections.reconnectLastDisconnectedAccount();
		MailViewAnalytics.warningClicked();
	},

	onUserReauth: function(ev) {
		ev.preventDefault();
		MailViewAnalytics.warningClicked();
		window.location.replace(MailConnections.getAuthLink());
	},

	toShowSilverGoldPlatinumMailPromo: function() {
		return (
			(User.isSilver() || MailConnections.isNonConnectedGoldOrHigher()) &&
			MailConnections.hasNeverConnected()
		);
	},

	sendMetrics: function(action) {
		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'mail-page',
			'mail-v2.action': action
		});
	},

	onBlur: function() {
		this.router.blurCurrentView();
	},

	onUnload: function() {
		this.router.off();
	},

	onDestroy: function() {
		this.router.destroyViewStack();
	},

	onFocus: function() {
		MailViewAnalytics.trackMailViewOpened();
	}
});

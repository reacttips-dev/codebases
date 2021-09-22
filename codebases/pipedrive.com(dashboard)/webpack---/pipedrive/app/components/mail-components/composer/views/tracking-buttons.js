'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const $ = require('jquery');
const template = require('../templates/tracking-buttons.html');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const PDMetrics = require('utils/pd-metrics');

module.exports = Pipedrive.View.extend({
	template: _.template(template),

	mailTrackingOpenMail: false,
	mailTrackingLink: false,

	events: {
		'click .trackingOpenMail': 'onTrackingOpenMailClicked',
		'click .trackingLinkClick': 'onTrackingLinkClicked'
	},

	initialize: function(options) {
		this.options = options || {};
		this.draftModel = options.draftModel;
	},

	getTemplateHelpers: function() {
		return {};
	},

	onLoad: function() {
		this.render();
	},

	onAttachedToDOM: function() {
		this.initOpenTrackingButton();
		this.initLinkTrackingButton();
	},

	initOpenTrackingButton: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const toShowButton =
			activeConnection && activeConnection.get('mail_tracking_open_mail_flag');

		this.$('.trackingOpenMail').toggle(!!toShowButton);

		if (toShowButton) {
			let trackingOpenMailEnabled;

			if (this.draftModel.isNew()) {
				trackingOpenMailEnabled = activeConnection.get(
					'last_mail_tracking_open_mail_value'
				);
			} else {
				trackingOpenMailEnabled = this.draftModel.get('mail_tracking_open_mail');
			}

			this.toggleTrackingOpenMailButtonState(trackingOpenMailEnabled);
		}

		this.listenTo(
			activeConnection,
			'change:mail_tracking_open_mail_flag',
			this.initOpenTrackingButton
		);
	},

	initLinkTrackingButton: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();
		const toShowButton = activeConnection && activeConnection.get('mail_tracking_link_flag');

		this.$('.trackingLinkClick').toggle(!!toShowButton);

		if (toShowButton) {
			let trackingLinkEnabled;

			if (this.draftModel.isNew()) {
				trackingLinkEnabled = activeConnection.get('last_mail_tracking_link_value');
			} else {
				trackingLinkEnabled = this.draftModel.get('mail_tracking_link');
			}

			this.toggleTrackingLinkButtonState(trackingLinkEnabled);
		}

		this.listenTo(
			activeConnection,
			'change:mail_tracking_link_flag',
			this.initLinkTrackingButton
		);
	},

	onTrackingOpenMailClicked: function(ev) {
		ev.preventDefault();
		const currentState = $(ev.currentTarget).hasClass('enabled');

		this.toggleTrackingOpenMailButtonState(!currentState, true);
		this.options.saveDraft();

		PDMetrics.trackUsage(null, 'email_composer', 'interacted', {
			interaction: 'track_open',
			wysiwyg_formatting: this.options.fontPickersEnabled
		});
	},

	onTrackingLinkClicked: function(ev) {
		ev.preventDefault();
		const currentState = $(ev.currentTarget).hasClass('enabled');

		this.toggleTrackingLinkButtonState(!currentState, true);
		this.options.saveDraft();

		PDMetrics.trackUsage(null, 'email_composer', 'interacted', {
			interaction: 'track_link',
			wysiwyg_formatting: this.options.fontPickersEnabled
		});
	},

	toggleTrackingOpenMailButtonState: function(state, showTipImmediately) {
		this.mailTrackingOpenMail = state;
		this.$('.trackingOpenMail')
			.toggleClass('enabled', !!state)
			.tooltip({
				tip: state
					? _.gettext('Do not track email opening')
					: _.gettext('Track email opening'),
				showOnInit: showTipImmediately,
				position: 'top'
			});
	},

	toggleTrackingLinkButtonState: function(state, showTipImmediately) {
		this.mailTrackingLink = state;
		this.$('.trackingLinkClick')
			.toggleClass('enabled', !!state)
			.tooltip({
				tip: state
					? _.gettext('Do not track link opening')
					: _.gettext('Track link opening'),
				showOnInit: showTipImmediately,
				position: 'top'
			});
	},

	getButtonStates: function() {
		return {
			mail_tracking_open_mail: this.mailTrackingOpenMail,
			mail_tracking_link: this.mailTrackingLink
		};
	},

	setCurrentStateToMailConnections: function() {
		const activeConnection = MailConnections.getConnectedNylasConnection();

		activeConnection.set('last_mail_tracking_open_mail_value', this.mailTrackingOpenMail);
		activeConnection.set('last_mail_tracking_link_value', this.mailTrackingLink);
	}
});

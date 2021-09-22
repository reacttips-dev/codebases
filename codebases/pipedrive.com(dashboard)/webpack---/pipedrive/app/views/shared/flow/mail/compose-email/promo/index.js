const Pipedrive = require('pipedrive');
const _ = require('lodash');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');
const User = require('models/user');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const MailGoldRushUtils = require('utils/mail/gold-rush');
const learnMoreContextualSupport = require('utils/mail/contextual-support');
const UpgradeButtonView = require('views/shared/upgrade-button');

const FlowMailTabPromoView = Pipedrive.View.extend({
	template: null,

	events: {
		'click [data-analytics]': 'trackClicks',
		'click .learn-more': 'defineContextualSupport'
	},

	initialize(options) {
		this.options = options || {};
		this.template = _.template(this.getTemplate());
	},

	onLoad() {
		this.render();
		this.options.onRender();
		this.trackViewLoading();
	},

	afterRender() {
		this.createUpgradeButton();
	},

	getTemplate() {
		if (User.isSilver()) {
			return require('./upgrade-to-gold.html');
		} else if (MailConnections.isNonConnectedGoldOrHigher()) {
			return require('./connect-your-email.html');
		}
	},

	getTemplateHelpers() {
		return {
			mailConnectLink: MailConnections.getConnectLink(),
			goldTierName: User.get('tier_names').gold
		};
	},

	createUpgradeButton() {
		this.upgradeButtonView = new UpgradeButtonView({
			addon: 'nylas_sync',
			component: 'flow_mail_compose'
		});
		this.upgradeButtonView.render();
		this.addView('.button-container', this.upgradeButtonView);

		if (MailGoldRushUtils.isGoldRushPeriodActive()) {
			this.$('.gold-rush-teaser').show();
		}
	},

	defineContextualSupport(event) {
		event.preventDefault();

		return learnMoreContextualSupport.openLearnMoreSupport();
	},

	trackViewLoading() {
		const viewName = this.getTrackingViewName();

		PDMetrics.trackPage('Mail', viewName);
	},

	trackClicks(ev) {
		const trackingMap = {
			'upgrade-to-gold': {
				name: 'Clicked Upgrade Plan',
				description: 'button'
			},
			'learn-more': {
				name: 'Clicked Learn more',
				description: 'link'
			},
			'connect-your-email': {
				name: 'Connect email',
				description: 'button'
			}
		};
		const trackingKey = $(ev.currentTarget).data('analytics');
		const trackingData = trackingMap[trackingKey];
		const viewName = this.getTrackingViewName();

		PDMetrics.track(trackingData.name, {
			page: 'Mail',
			view: viewName,
			description: trackingData.description
		});
	},

	getTrackingViewName() {
		let viewName;

		if (User.isSilverAdmin()) {
			viewName = 'Send email - Silver';
		} else if (MailConnections.isNonConnectedGoldOrHigher()) {
			viewName = 'Send email - Gold or higher';
		}

		return viewName;
	}
});

module.exports = FlowMailTabPromoView;

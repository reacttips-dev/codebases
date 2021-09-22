'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const User = require('models/user');
const Tutorial = require('views/shared/tutorial');
const SmartBccUtils = require('utils/mail/smart-bcc');
const GoldRushUtils = require('utils/mail/gold-rush');
const PDMetrics = require('utils/pd-metrics');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const learnMoreContextualSupport = require('utils/mail/contextual-support');
const $ = require('jquery');
const UpgradeButtonView = require('views/shared/upgrade-button');

const React = require('react');
const ReactDOM = require('react-dom');
const { VideoOverlay, VideoThumbnail } = require('@pipedrive/convention-ui-react');

let templateUtils;
let silverAdminPromoTrackingUtils;

const EmptyThreadsList = Pipedrive.View.extend({
	template: null,
	templateHelpers: null,

	events: {
		'click .empty-inbox-welcome .empty-inbox-welcome__thumbnail': 'activateTutorial',
		'click .video__thumbnail': 'openVideoIntro',
		'click .resetFilters': 'resetFilters',
		'click .learn-more': 'defineContextualSupport',

		// Tracking..
		'click [data-empty-inbox-promo="silver-admin-promo"] .track-analytics':
			'trackInboxSilverAdminPromo',
		'click [data-composer-drafts-sent-archive-promo="silver-admin-promo"] .track-analytics':
			'trackDraftsSentArchiveSilverAdminPromo'
	},

	initialize: function(options) {
		this.options = _.isObject(options) ? options : {};
	},

	onLoad: function() {
		const ready = Pipedrive.Ready(['MailConnections'], this.onAsyncDataReady.bind(this));

		MailConnections.onReady(ready.set.bind(ready, 'MailConnections'));
	},

	onAsyncDataReady: function() {
		this.setTemplate();
		this.render();
	},

	afterRender: function() {
		this.createUpgradeButton();
	},

	onAttachedToDOM: function() {
		this.initVideoThumbnail();
	},

	setTemplate: function() {
		const section = this.options.section;
		const templateData = {
			section,
			threadsCollection: this.options.threadsCollection
		};

		this.template = templateUtils.getTemplate(templateData);
		this.templateHelpers = templateUtils.getTemplateHelpers(templateData);
	},

	createUpgradeButton: function() {
		const isPromoShown =
			(User.isSilver() && !MailConnections.nylasSyncEnabled()) ||
			templateUtils.shouldSeeInboxSilverWelcome();

		if (isPromoShown) {
			this.upgradeButtonView = new UpgradeButtonView({
				addon: 'nylas_sync',
				component: this.templateHelpers.analyticsSectionName
			});
			this.upgradeButtonView.render();
			this.addView('.button-container', this.upgradeButtonView);

			if (GoldRushUtils.isGoldRushPeriodActive()) {
				this.$('.gold-rush-teaser').css('display', 'flex');
			}
		}
	},

	defineContextualSupport: function(event) {
		event.preventDefault();

		return learnMoreContextualSupport.openLearnMoreSupport();
	},

	resetFilters: function() {
		this.options.threadsCollection.clearFilters();
	},

	activateTutorial: function() {
		const tutorial = new Tutorial({ user: User });

		tutorial.startInlineManual('15493');
	},

	initVideoThumbnail: function() {
		const videoThumbnailElement = this.$el.find('.video__thumbnail')[0];
		const tittle = _.gettext('Sales Inbox');

		videoThumbnailElement &&
			ReactDOM.render(
				<VideoThumbnail
					image={'https://play.vidyard.com/A7sNpGN83ZeNpj6u3W7WB8.jpg'}
					imageAlt={tittle}
					title={tittle}
					description={_.gettext('Email sync, tracking, templates')}
					lengthInSeconds={143}
					noGrayscale
				/>,
				videoThumbnailElement
			);
	},

	closeVideoIntro: function(videoElement) {
		ReactDOM.unmountComponentAtNode(videoElement);
	},

	openVideoIntro: function() {
		const videoElement = this.$el.find('.video__player')[0];
		const academyLink =
			'https://www.pipedrive.com/academy/courses/automate-manual-work-and-save-time/chapters/sales-inbox?ref=webapp_mail';

		videoElement &&
			ReactDOM.render(
				<VideoOverlay
					visible={true}
					onClose={() => this.closeVideoIntro(videoElement)}
					videoUrl={'https://embed.vidyard.com/share/A7sNpGN83ZeNpj6u3W7WB8'}
					title={_.gettext('Sales Inbox')}
					description={
						<>
							<span>
								{_.gettext(
									'This video is part of the Automate manual work and save time course.'
								)}
							</span>
							<a href={academyLink}>
								{_.gettext('Continue learning in Pipedrive Academy')}
							</a>
						</>
					}
				/>,
				videoElement
			);
	},

	trackInboxSilverAdminPromo: function(ev) {
		silverAdminPromoTrackingUtils.doTracking(ev, 'Welcome Video');
	},

	trackDraftsSentArchiveSilverAdminPromo: function(ev) {
		silverAdminPromoTrackingUtils.doTracking(ev, 'Welcome to Mail Page');
	}
});

/**
 * Utils for picking the right template and template helpers for the empty list view
 * @type {Object}
 */
templateUtils = {
	templates: {
		// Regular empty list templates:
		defaultEmpty: require('./templates/default.html'),
		emptyStateForFilterMatches: require('./templates/empty-state-for-filter-matches.html'),
		emptyStateForSearch: require('./templates/empty-state-for-search.html'),

		// Promo-related empty list templates:
		draftsSentArchiveUpgradeToGoldPromo: require('./templates/promo/drafts-sent-archive-upgrade-to-gold.html'),
		draftsSentArchiveConnectYourEmailPromo: require('./templates/promo/drafts-sent-archive-connect-your-email.html'),
		inboxUpgradeToGoldPromo: require('./templates/promo/inbox-upgrade-to-gold.html'),
		inboxConnectYourEmailPromo: require('./templates/promo/inbox-connect-your-email.html')
	},

	defaultTemplateTexts: {
		inbox: {
			key: 'inbox',
			title: _.gettext('Inbox Zero'),
			message: _.gettext('Please enjoy your day!')
		},
		drafts: {
			key: 'drafts',
			title: _.gettext('Nothing in Drafts'),
			message: _.gettext('Save a draft and it will be shown here.')
		},
		sent: {
			key: 'sent',
			title: _.gettext('Nothing in Sent'),
			message: _.gettext('Send a message and it will be shown here.')
		},
		archive: {
			key: 'archive',
			title: _.gettext('Nothing in Archive'),
			message: _.gettext('Archive a conversation and it will be shown here.')
		},
		search: {
			key: 'search',
			title: _.gettext('No messages matched your search'),
			message: _.gettext('Check your spelling and try again.')
		}
	},

	templateTextsForFilters: {
		search: {
			key: 'search',
			title: _.gettext('No messages matched your search'),
			message: _.gettext('Check your spelling or %sreset your filters%s.', [
				'<a href="#" class="resetFilters link">',
				'</a>'
			])
		},
		default: {
			title: _.gettext('No messages matched your filters'),
			message: _.gettext('Try a different combination or %sreset your filters%s.', [
				'<a href="#" class="resetFilters link">',
				'</a>'
			])
		}
	},

	getTemplate: function(options) {
		const isEmptyBecauseFilters = !_.isEmpty(options.threadsCollection.getActiveFilters());
		const section = options.section;

		let template;

		if (isEmptyBecauseFilters) {
			template = _.template(this.templates.emptyStateForFilterMatches);
		} else {
			const getTemplatesBySectionMap = {
				inbox: _.bind(this.getTemplateInbox, this),
				drafts: _.bind(this.getTemplateDraftsSentArchive, this),
				sent: _.bind(this.getTemplateDraftsSentArchive, this),
				archive: _.bind(this.getTemplateDraftsSentArchive, this),
				search: _.bind(this.getTemplateSearch, this)
			};

			template = _.template(getTemplatesBySectionMap[section]());
		}

		return template;
	},

	/**
	 * Returns a template for an empty inbox based on different criterias.
	 * @return {String}
	 */
	getTemplateInbox: function() {
		if (
			(User.isSilver() && !MailConnections.nylasSyncEnabled()) ||
			this.shouldSeeInboxSilverWelcome()
		) {
			PDMetrics.trackPage('Mail', 'Welcome Video');

			return this.templates.inboxUpgradeToGoldPromo;
		}

		// Promo should be shown to the customers who haven't had active email sync before
		if (MailConnections.hasNeverConnected()) {
			return this.templates.inboxConnectYourEmailPromo;
		}

		return this.getTemplateDefault();
	},

	shouldSeeInboxSilverWelcome: function() {
		const hasHadNothingInInbox = User.counts.hasHadNothingInInbox();

		// Some users may be silver users, but still have nylas_sync switched on via BO
		const nylasSyncOff = !User.settings.get('nylas_sync');

		return nylasSyncOff && User.isSilver() && hasHadNothingInInbox;
	},

	getTemplateDraftsSentArchive: function() {
		if (!MailConnections.nylasSyncEnabled() && User.isSilver()) {
			PDMetrics.trackPage('Mail', 'Welcome to Mail Page');

			return this.templates.draftsSentArchiveUpgradeToGoldPromo;
		}

		// Promo should be shown to the customers who haven't had active email sync before
		if (MailConnections.hasNeverConnected()) {
			return this.templates.draftsSentArchiveConnectYourEmailPromo;
		}

		return this.getTemplateDefault();
	},

	getTemplateDefault: function() {
		return this.templates.defaultEmpty;
	},

	getTemplateSearch: function() {
		return this.templates.emptyStateForSearch;
	},

	getAnalyticsSection: function(templateData) {
		let section = templateData.section;

		if (templateData.section === 'drafts') {
			section = 'draft';
		}

		return `mail_${section}`;
	},

	getTemplateHelpers: function(templateData) {
		return {
			analyticsSectionName: this.getAnalyticsSection(templateData),
			section: this.getTemplateTexts(templateData),
			bccEmail: User.get('cc_email'),
			bccHref: SmartBccUtils.getTestEmailLinkHrefValue(),
			smartBccExplanationText: this.getSmartBccExplanationText(),
			mailConnectLink: MailConnections.getConnectLink(),
			goldTierName: User.get('tier_names').gold
		};
	},

	getTemplateTexts: function(templateData) {
		const hasActiveFilters = !_.isEmpty(templateData.threadsCollection.getActiveFilters());

		let data;

		if (hasActiveFilters) {
			const key = templateData.section === 'search' ? 'search' : 'default';

			data = this.templateTextsForFilters[key];
		} else {
			data = this.defaultTemplateTexts[templateData.section];
		}

		return data;
	},

	getSmartBccExplanationText: function() {
		const bccEmail = User.get('cc_email');
		const bccHref = SmartBccUtils.getTestEmailLinkHrefValue();

		return _.gettext(
			'When sending emails, include your unique company email address \n' +
				'(i.e. %s), to the BCC field and these conversations will be sent to your Pipedrive ' +
				"mail; they'll automatically be linked to the relevant contacts and deals when applicable.",
			[
				`<a class="track-analytics" href="${bccHref}" data-analytics="first-email-link">${bccEmail}</a>`
			]
		);
	}
};

/**
 * Tracking for marketing people
 * @type {Object}
 */
silverAdminPromoTrackingUtils = {
	trackingMap: {
		'first-email-link': {
			name: 'Clicked Send First Email (BCC)',
			description: 'link'
		},
		'first-email-button': {
			name: 'Clicked Send First Email (BCC)',
			description: 'button'
		},
		'upgrade-to-gold': {
			name: 'Clicked Upgrade Plan',
			description: 'button'
		},
		'learn-more': {
			name: 'Clicked Learn more',
			description: 'link'
		}
	},

	doTracking: function(ev, view) {
		const trackingKey = $(ev.currentTarget).data('analytics');
		const trackingData = this.trackingMap[trackingKey];

		PDMetrics.track(trackingData.name, {
			page: 'Mail',
			view,
			description: trackingData.description
		});
	}
};

module.exports = EmptyThreadsList;

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const { InlineInfo } = require('@pipedrive/convention-ui-react');
const sendCampaignTemplate = require('templates/lists/send-campaign-button.html');
const logger = new Pipedrive.Logger('person', 'send-campaign');
const componentLoader = require('webapp-component-loader');
const Summary = require('models/summary');

const baseUrl = '/marketing/campaigns/new';

/** @lends views/lists/PersonMarketingStatusChangeView.prototype */
const SendCampaignView = Pipedrive.View.extend({
	template: _.template(sendCampaignTemplate),
	events: {
		'click .sendCampaignButton #send-campaign': 'sendCampaign'
	},
	/**
	 * Send Campaign View
	 *
	 * @class  Send Campaign View
	 * @constructs
	 * @augments module:Pipedrive.View
	 *
	 * @param {Object} options Options to set for the List view
	 * @returns {view/SendCampaignView} Returns itself for chaining
	 */
	initialize: function(options) {
		this.options = options || {};
		this.listSettings = this.options.listSettings;
		this.collection = this.options.collection;
		this.summary = this.listSettings.getSummary();

		componentLoader.load('froot:router').then((router) => {
			this.router = router;
		});

		this.summaryModel = new Summary({
			type: 'person'
		});

		this.render();
		this.renderInlineHelper();
	},
	renderInlineHelper() {
		const target = this.$el.find('#send-campaign-info');

		try {
			ReactDOM.render(
				<InlineInfo
					text={_.gettext(
						'You can send email campaigns only to contacts with the marketing status "Subscribed"'
					)}
					showLinkIcon
				/>,
				target.get(0)
			);
		} catch (err) {
			logger.log('Could not load component: InlineInfo', {
				error_message: err
			});
		}
	},
	selfRender: function() {
		this.$el.html(
			this.template({
				canAccessMarketingApp: this.options.canAccessMarketingApp
			})
		);
	},
	sendCampaign: async function() {
		const filters = this.listSettings.getFilter();
		// eslint-disable-next-line camelcase
		const { type: filter_type, value: filter_value } = filters;
		const filter = {
			filter_type,
			filter_value,
			created_from_page: 'person_list_view'
		};
		const queryParamsString = new URLSearchParams(filter).toString();

		this.router.navigateTo([baseUrl, queryParamsString].join('?'));
	},
	remove: function() {
		this.undelegateEvents();
		this.$el.empty();
		this.stopListening();

		return this;
	}
});

module.exports = SendCampaignView;

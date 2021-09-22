const MailMessageComponent = require('components/mail-components/message/mail-message');
const _ = require('lodash');
const $ = require('jquery');
const PDMetrics = require('utils/pd-metrics');

module.exports = MailMessageComponent.extend({
	events: _.assignIn(MailMessageComponent.prototype.events, {
		'click .messageHeader': 'onMessageHeaderClicked'
	}),

	onAttachedToDOM: function() {
		MailMessageComponent.prototype.onAttachedToDOM.call(this);

		const shoulBeCollapsed = !this.options.isLastItem && !!this.model.get('read_flag');

		this.toggleCollapse(shoulBeCollapsed);
	},

	getBodyUtilsOpts: function() {
		const opts = MailMessageComponent.prototype.getBodyUtilsOpts.call(this);

		return _.assignIn(opts, { metricsData: { 'mail-v2.param.where': 'single-thread' } });
	},

	onMessageHeaderClicked: function(ev) {
		const clickOnButton = $(ev.target).parents('div.buttons').length > 0;
		const isLastItem = this.model.collection.last().get('id') === this.model.get('id');

		if (clickOnButton || isLastItem) {
			return;
		}

		PDMetrics.trackUsage(null, 'mail_view', 'action_taken', {
			'mail-v2.feature': 'mail-message-component',
			'mail-v2.action': 'toggle-message-collapse',
			'mail-v2.param.where': 'single-thread'
		});

		this.toggleCollapse();
	}
});

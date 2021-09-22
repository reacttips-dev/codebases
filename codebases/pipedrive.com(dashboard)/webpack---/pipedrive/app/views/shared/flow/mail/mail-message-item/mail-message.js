const MailMessageComponent = require('components/mail-components/message/mail-message');
const _ = require('lodash');
const MessageActions = require('./message-actions/message-actions');
const template = require('./mail-message.html');
const PDMetrics = require('utils/pd-metrics');

/**
 * Mail Item View
 */
module.exports = MailMessageComponent.extend({
	template: _.template(template),

	/**
	 * Indicates wheter the mail message content is collapsed or expanded
	 * @type {Boolean}
	 */
	collapsed: true,

	events: _.assignIn(MailMessageComponent.prototype.events, {
		'click .rightSideContent .collapseExpandButtons button': 'onCollapseButtonClick'
	}),

	afterRender: function() {
		MailMessageComponent.prototype.afterRender.call(this);
		this.toggleCollapse(this.collapsed);
	},

	getBodyUtilsOpts: function() {
		const opts = MailMessageComponent.prototype.getBodyUtilsOpts.call(this);

		return _.assignIn(opts, {
			metricsData: {
				'mail-v2.param.where': 'flow',
				'mail-v2.param.type': this.options.relatedModel.type
			}
		});
	},

	initializeMessageActions: function() {
		this.messageActionsView = new MessageActions({
			model: this.model,
			sendPageActionMetrics: this.sendMetrics.bind(this),
			relatedModel: this.options.relatedModel
		});

		this.addView({ '.messageActions': this.messageActionsView });
	},

	onCollapseButtonClick: function() {
		this.sendMetrics('toggle-message-collapse', null, 'mail-collapse-toggled');

		this.toggleCollapse();
	},

	sendMetrics: function(action, optionalParameters, interaction) {
		const metricsData = _.assignIn(
			{
				'mail-v2.feature': 'mail-message-component',
				'mail-v2.action': action,
				'mail-v2.param.where': 'flow',
				'mail-v2.param.type': this.options.relatedModel.type
			},
			optionalParameters
		);
		const [, objectType, objectId] = window.location.pathname.split('/');

		if (action) {
			PDMetrics.trackUsage(null, 'mail_view', 'action_taken', metricsData);
		}

		if (interaction) {
			PDMetrics.trackUsage(null, 'detail_view_email', 'interacted', {
				object_type: objectType,
				object_id: Number(objectId),
				thread_id: this.model.get('mail_thread_id'),
				interaction,
				email_sync_type: this.model.get('smart_bcc_flag') ? 'smart_bcc' : 'nylas'
			});
		}
	},

	getTrackingData: function() {
		return {
			container_component: 'contact_card.flow_mail',
			parent_object_id: _.get(this.options, 'relatedModel.id'),
			parent_object_type: _.get(this.options, 'relatedModel.type')
		};
	}
});

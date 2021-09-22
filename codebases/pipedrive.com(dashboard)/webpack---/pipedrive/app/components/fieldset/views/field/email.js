const _ = require('lodash');
const User = require('models/user');
const FieldPhone = require('./phone');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const { getDisplayLabel } = require('../../../../views/ui/typeLabels');

module.exports = FieldPhone.extend({
	type: 'email',

	getReadValue: function() {
		return _.map(
			this.value,
			_.bind(function(item) {
				const value = _.isObject(item) ? item.value : item;
				const openInNewTab = User.settings.get('open_email_links_in_new_tab');
				const displayLabel = getDisplayLabel('email', item.label);
				const hasNylasConnection = MailConnections.hasActiveNylasConnection();
				const bcc = this.options.bcc;

				return {
					link: `mailto:${value}${
						!hasNylasConnection && bcc ? `?bcc=${encodeURIComponent(bcc)}` : ''
					}`,
					label: item.label,
					displayLabel,
					value: this.formatValue(value),
					target: openInNewTab ? '_blank' : ''
				};
			}, this)
		);
	},

	formatValue: function(value) {
		return value;
	},

	// Overwrites the phone class' tracking method. Add email field specific tracking here if needed.
	trackValueClick: null
});

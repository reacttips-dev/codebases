const Pipedrive = require('pipedrive');
const _ = require('lodash');
const PromoView = require('./promo/index');
const ComposerView = require('./mail-composer/mail-composer');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const User = require('models/user');
const template = require('./compose-email.html');

/**
 * This view decides whether to show the mail-composer or a promo view.
 */
module.exports = Pipedrive.View.extend({
	template: _.template(template),

	view: null,

	initialize: function(options) {
		this.options = options;
	},

	getTemplateHelpers: function() {
		return {};
	},

	afterRender: function() {
		MailConnections.onReady(() => {
			const viewOpts = Object.assign(this.options, {
				el: this.$('.flowComponentEditor')[0]
			});

			if (
				MailConnections.hasNeverConnected() &&
				(User.isSilver() || MailConnections.isNonConnectedGoldOrHigher())
			) {
				this.view = new PromoView(viewOpts);
			} else if (
				MailConnections.nylasSyncEnabled() ||
				MailConnections.hasActiveNylasConnection()
			) {
				this.view = new ComposerView(viewOpts);
			}

			this.view.render();
		});
	},

	update: function() {
		if (_.isFunction(this.view.update)) {
			this.view.update();
		}
	}
});

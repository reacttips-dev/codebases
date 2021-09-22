const Cookies = require('js-cookie');
const _ = require('lodash');
const Pipedrive = require('pipedrive');
const componentLoader = require('webapp-component-loader');
const Template = require('templates/shared/tutorial.html');

module.exports = Pipedrive.View.extend({
	tagName: 'div',
	template: _.template(Template),
	config: null,
	video: false,
	previousStep: null,
	initialize: function(opts) {
		this.target = opts.target;
		this.config = opts.config;
		this.user = opts.user;
		this.onboardingVersion = opts.onboardingVersion;

		if (this.target) {
			this.target.removeClass('ready');
		}

		componentLoader.register({
			'inline-manual': {
				js: 'https://inlinemanual.com/embed/player.a8f7383d7f595c6e27930c5dfb1e3652.js'
			}
		});
	},

	startInlineManual: function(topicCode, options) {
		componentLoader.load('inline-manual').then(
			function() {
				// eslint-disable-next-line no-undef
				inline_manual_player.setCallbacks(options);
				// eslint-disable-next-line no-undef
				inline_manual_player.activateTopic(topicCode);
			}.bind(this)
		);
	},

	setCookie: function(name, val) {
		Cookies.set(name, val, {
			expires: 30,
			domain: app.config.cookieDomain,
			path: '/'
		});
	}
});

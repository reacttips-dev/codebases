'use strict';

const _ = require('lodash');
const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const ReactDOM = require('react-dom');
const React = require('react');

module.exports = ServiceLoader.extend({
	component: 'upgrade-button',
	serviceName: 'Upgrade Button',
	template: _.template('<div class="upgradeButton"></div>'),

	initialize: function(options) {
		this.props = options;
		ServiceLoader.prototype.initialize.apply(this, options);
	},

	selfRender: function() {
		this.$el.html(this.template());
	},

	onDestroy: function() {
		ReactDOM.unmountComponentAtNode(this.$el.get(0));
	},

	renderPage: function(UpgradeButton) {
		ReactDOM.render(
			React.createElement(
				UpgradeButton.component,
				_.defaults(
					{
						webappApi: new WebappApi()
					},
					this.props
				),
				null
			),
			this.$el.get(0)
		);
	}
});

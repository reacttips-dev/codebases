const React = require('react');
const ReactDOM = require('react-dom');
const WebappApi = require('webapp-api/index');
const ServiceLoader = require('components/service-loader');
const User = require('models/user');

module.exports = ServiceLoader.extend({
	serviceName: 'Quick info card',
	component: 'quick-info-card',
	template: '',

	initialize: function(options) {
		const webappApi = new WebappApi();

		this.options = {
			...options,
			popoverProps: {
				portalTo: document.body,
				...options.popoverProps
			},
			triggerElement: this.el,
			webappApi
		};

		ServiceLoader.prototype.initialize.apply(this, options);
	},

	/**
	 * Override to prevent template from rendering over the parent view.
	 */
	selfRender() {},

	async renderPage({ default: QuickInfoCard }) {
		QuickInfoCard.displayName = 'QuickInfoCard';

		if (!User.companyFeatures.get('quick_info_card') || !this.options.id) {
			return;
		}

		/**
		 * Validate that the node is mounted to the DOM
		 * and not an unmounted `createElement` reference.
		 */
		if (!document.body.contains(this.el)) {
			return;
		}

		this.containerEl = document.createElement('div');
		document.body.append(this.containerEl);

		ReactDOM.render(React.createElement(QuickInfoCard, { ...this.options }), this.containerEl);
	},

	onDestroy() {
		if (this.containerEl) {
			ReactDOM.unmountComponentAtNode(this.containerEl);
		}
	}
});

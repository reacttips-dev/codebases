'use strict';

const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Pipedrive = require('pipedrive');
const componentLoader = require('webapp-component-loader');
const Template = require('./index.html');
const logger = new Pipedrive.Logger(`webapp.${app.ENV}`, 'serviceloader');
const View = Pipedrive.View.extend({
	template: _.template(Template),

	stackable: true,

	component: null,

	serviceUrl: null,

	serviceCSSUrl: null,

	servicePage: null,

	// Name of the service as seen by the customers and in graylog
	serviceName: 'Service',

	error: null,

	model: null,

	initialize: function() {
		this.ready = Pipedrive.Ready(['service']);
	},

	onLoad: function() {
		this.loadExternalPage();
	},

	loadExternalPage: function() {
		if (this.component) {
			return componentLoader
				.load(this.component)
				.then((service) => {
					/**
					 * To allow migration without downtime in a service we have a double check here.
					 * If the service states that it is a microFE we will switch to loading microFE loading.
					 * Fortunately this wouldn't load the service twice as componentLoader caches the result.
					 */
					if (service.isMicroFEComponent) {
						this.loadMicroFEComponent();
					} else {
						this.onServiceLoad(service);
					}
				})
				.catch((error) => {
					this.onServiceRequireError(error);
				});
		}

		const externalComponent = {
			js: this.serviceUrl
		};

		if (this.serviceCSSUrl) {
			externalComponent.css = this.serviceCSSUrl;
		}

		const componentConf = {};
		const serviceName = this.serviceName.toLowerCase().replace(/[ ._-]/g, '-');

		componentConf[serviceName] = externalComponent;

		componentLoader.register(componentConf);
		componentLoader
			.load(serviceName)
			.then(this.onServiceLoad.bind(this))
			.catch(this.onServiceRequireError.bind(this));
	},

	loadMicroFEComponent: async function() {
		const MicroFEComponent = await componentLoader.load('froot:MicroFEComponent');
		const microFEProps =
			this.getMicroFEProps && typeof this.getMicroFEProps === 'function'
				? this.getMicroFEProps()
				: {};

		this.render();

		try {
			ReactDOM.render(
				<MicroFEComponent
					componentName={this.component}
					componentProps={{ ...microFEProps, visible: true }}
				/>,
				this.$('.servicePage').get(0)
			);
			this.ready.set('service');
		} catch (err) {
			this.logError(err);
			this.showErrorMessage();
		}
	},

	templateHelpers: function() {
		return {
			error: this.error
		};
	},

	onServiceLoad: function(ServicePage) {
		const isPromise = typeof ServicePage.then === 'function';

		function renderLoadedComponent(Component) {
			this.error = null;
			this.render();
			const element = this.$('.servicePage')[0];

			this.renderPage(Component, element, this.model);
			this.ready.set('service');
		}

		function throwServiceError(err) {
			this.logError(err);
			this.showErrorMessage();

			throw new Error(`${this.serviceName} page not defined`);
		}

		if (isPromise) {
			ServicePage.then(renderLoadedComponent.bind(this)).catch(throwServiceError.bind(this));
		} else if (ServicePage) {
			renderLoadedComponent.call(this, ServicePage);
		} else {
			throwServiceError.call(this);
		}
	},

	onServiceRequireError: function(err) {
		this.logError(err);
		this.showErrorMessage();
	},

	logError: function(err) {
		const message = `Could not load service: ${this.serviceName}`;
		const data = {
			serviceName: this.serviceName,
			component: this.component
		};

		if (!err) {
			data.error_message = 'unknown error';
		} else if (typeof err === 'string') {
			data.error_message = err;
		} else {
			data.error_message = err.message;
			data.stack = err.stack;
		}

		logger.log(message, data);
	},

	showErrorMessage: function() {
		this.error = this.getErrorMessage();
		this.render();
	},

	getErrorMessage: function() {
		return _.gettext('%s temporarily unavailable', [this.serviceName]);
	},

	go: function(path) {
		this.ready.onReady(_.bind(this.route, this, path));
	},

	/**
	 * Abstract method that is called after service is loaded.
	 * @param  {Object} ServicePage loaded service file
	 * @param  {DOMNode} element     [description]
	 */
	renderPage: function() {},

	callServicePageMethod: function(...args) {
		const method = args[0];

		if (this.servicePage && typeof this.servicePage[method] === 'function') {
			args.shift();

			this.servicePage[method].apply(this.servicePage, args);
		}
	},

	/**
	 * The following lifecycle events are called on
	 * the this.servicePage if it has properties of the same name.
	 *
	 * It is encouraged to have the logic for those callbacks on webapp service side
	 * but feel free to completely override them if you want your logic to be on the webapp side.
	 */

	/**
	 * Triggered when webapp routes to a webapp service.
	 * It happens on all URL changes related to the webapp service.
	 */
	route: function(path) {
		this.callServicePageMethod('route', path);
	},

	/**
	 * Triggered when this view receives focus meaning it's visible for the user.
	 */
	onFocus: function() {
		this.callServicePageMethod('onFocus');
	},

	/**
	 * Triggered when this view loses focus meaning it's no longer visible for the user.
	 */
	onBlur: function() {
		this.callServicePageMethod('onBlur');
	},

	/**
	 * Triggered when this view will be unloaded.
	 * The view still exists and can be loaded again.
	 */
	onUnload: function() {
		this.callServicePageMethod('onUnload');
	},

	/**
	 * Triggered when this view is destroyed.
	 * After this event the view cannot be loaded again and will be created again if required.
	 */
	onDestroy: function() {
		this.callServicePageMethod('onDestroy');
	}
});

module.exports = View;

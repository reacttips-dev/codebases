const ReactDOM = require('react-dom');
const Backbone = require('backbone');
const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const _ = require('lodash');

module.exports = ServiceLoader.extend({
	template: _.template('<% if (!error) { %><div></div><% } %>'),
	component: 'marketplace-app-extensions-ui',
	serviceName: 'Marketplace app extensions',

	hasSelectedRow: false,

	initialize: function(options) {
		this.type = _.get(options, 'type', null);
		this.parentEl = _.get(options, 'parentEl', null);
		this.resource = _.get(options, 'resource', null);
		this.view = _.get(options, 'view', null);
		this.model = _.get(options, 'model', null);
		this.collection = _.get(options, 'collection', null);
		this.renderDropdown = _.get(options, 'renderDropdown', false);
		this.onPanelsLoaded = _.get(options, 'onPanelsLoaded', () => {});
		this.toggleManageSidebar = _.get(options, 'toggleManageSidebar', () => {});

		if (this.collection && this.collection instanceof Backbone.Collection) {
			this.bindCollectionEvents();
		}

		ServiceLoader.prototype.initialize.apply(this, options);
	},

	bindCollectionEvents: function() {
		this.collection.on('selected', (state) => {
			this.hasSelectedRow = state;
		});
	},

	refresh: function() {
		if (this.servicePage && this.servicePage.update) {
			this.servicePage.update(this.getServiceOptions());
		} else if (this.servicePage && this.servicePage.refresh) {
			this.servicePage.refresh(this.getServiceOptions());
		}

		return false;
	},

	getModelOptions: function() {
		let modelOptions = {};

		if (this.model && this.model instanceof Backbone.Model) {
			modelOptions = _.assign(modelOptions, {
				selectedIds: [this.model.get('id')]
			});
		}

		return modelOptions;
	},

	getCollectionOptions: function() {
		let collectionOptions = {};

		if (this.collection && this.collection instanceof Backbone.Collection) {
			const selectedIds = _.get(this.collection, 'selectedIds', []);
			const excludedIds = _.get(this.collection, 'excludedIds', []);

			collectionOptions = _.assign(collectionOptions, {
				filter: _.get(this.collection, 'options.filter'),
				data: _.get(this.collection, 'options.data'),
				firstLetter: _.get(this.collection, 'options.firstLetter')
			});

			if (this.hasSelectedRow || selectedIds.length > 0 || excludedIds.length > 0) {
				collectionOptions = _.assign(collectionOptions, {
					selectedIds,
					excludedIds
				});
			}
		}

		return collectionOptions;
	},

	getServiceOptions: function() {
		let serviceOptions = {
			el: this.$el.get(0),
			parentEl: this.parentEl,
			api: new WebappApi(),
			type: this.type,
			resource: this.resource,
			view: this.view,
			renderDropdown: this.renderDropdown
		};

		serviceOptions = Object.assign(
			serviceOptions,
			this.getCollectionOptions(),
			this.getModelOptions()
		);

		if (this.type === 'panel') {
			serviceOptions.toggleManageSidebar = this.toggleManageSidebar;
			serviceOptions.onPanelsLoaded = this.onPanelsLoaded;
		}

		return serviceOptions;
	},

	renderPage: async function(ServicePage) {
		const serviceOptions = this.getServiceOptions();

		if (ServicePage.mount) {
			this.servicePage = ServicePage;
			this.servicePage.mount(serviceOptions);
		} else {
			this.servicePage = new ServicePage(serviceOptions);
		}
	},

	update(props) {
		if (this.servicePage && this.servicePage.update) {
			this.servicePage.update(props);
		}
	},

	onUnload: function() {
		const serviceOptions = this.getServiceOptions();

		if (this.servicePage && this.servicePage.unmount) {
			this.servicePage.unmount(serviceOptions);
		}
	},

	onDestroy: function() {
		ReactDOM.unmountComponentAtNode(this.$el.get(0));
	}
});

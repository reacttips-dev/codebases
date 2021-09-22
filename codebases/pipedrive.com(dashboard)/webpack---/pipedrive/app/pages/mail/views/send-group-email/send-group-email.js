const React = require('react');
const ReactDOM = require('react-dom');
const ServiceLoader = require('components/service-loader/index');
const WebappApi = require('webapp-api/index');
const MailConnections = require('collections/mail/global-singletons/mail-connections');
const { default: getDragDropContext } = require('utils/react-dnd-context');
const _ = require('lodash');
const BulkEditUtils = require('utils/bulk-edit-utils');

module.exports = ServiceLoader.extend({
	component: 'email-components:send-group-email',
	serviceName: 'email-components-send-group-email',
	template: _.template('<div class="servicePage"></div>'),

	initialize: function(...rest) {
		this.componentProps = {};
		this.API = new WebappApi();
		ServiceLoader.prototype.initialize.apply(this, rest);
	},

	onSelected: function(type, collection, totalCount) {
		const { selectedIds, excludedIds, bulkEditFilter } = collection;
		const selectedItemsCount = BulkEditUtils.selectedItemsCount(collection, totalCount);
		const sort = _.get(collection, 'options.data.sort');

		this.componentProps = {
			type,
			selection: {
				selectedIds: [...selectedIds],
				excludedIds: [...excludedIds],
				bulkEditFilter
			},
			selectedItemsCount,
			sort
		};

		this.renderComponent();
	},

	renderPage: function(ServicePage) {
		this.component = ServicePage;
		this.renderComponent();
	},

	renderComponent: function() {
		if (!this.component) {
			return;
		}

		const { API, componentProps } = this;

		ReactDOM.render(
			React.createElement(
				this.component,
				{
					API,
					MailConnections,
					getDragDropContext,
					componentProps
				},
				null
			),
			this.$el.get(0)
		);
	},

	getErrorMessage: function() {
		return _.gettext('Sending group emails is temporarily unavailable');
	}
});

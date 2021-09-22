const Pipedrive = require('pipedrive');
const CustomViewModel = require('models/custom-view');
const User = require('models/user');
const logger = new Pipedrive.Logger('filter');
const _ = require('lodash');

const GraphqlModel = require('./graphql');

const {
	getFilter,
	getFilters,
	parseToOldFilter,
	parseToOldFilters
} = require('client/graphql/queries/filters');

module.exports = GraphqlModel.extend({
	type: 'filter',

	allowDirectSync: true,

	url: function() {
		if (this.get('id')) {
			return `${app.config.api}/filters/${this.get('id')}`;
		} else {
			return `${app.config.api}/filters`;
		}
	},

	graph: function() {
		const options = { fetchPolicy: 'no-cache' };

		if (this.get('id')) {
			options.query = getFilter;
			options.variables = { id: this.get('id') };
		} else {
			options.query = getFilters;
		}

		return options;
	},

	initialize: function() {},

	selfOwned: function() {
		return _.isEqual(User.id, this.get('user_id'));
	},

	hasCustomView: function() {
		const customViewId = this.get('custom_view_id');

		return parseInt(customViewId, 10) > 0;
	},

	getAssignedCustomView: function(callback) {
		const customViewId = this.get('custom_view_id');
		const cachedView = User.customViews.get(customViewId);

		if (cachedView) {
			return callback(cachedView);
		}

		const customViewToFetch = new CustomViewModel({ id: customViewId }, { User });

		customViewToFetch.pull({
			success: (view) => {
				User.customViews.add(view);
				callback(view);
			},
			error: (...args) => {
				args.unshift(`Unable to fetch custom view for id: ${customViewId}`);
				logger.error.apply(logger, args);
				this.unset('custom_view_id', { silent: true });
				callback();
			}
		});
	},

	parse: function(response) {
		const filter = _.get(response, 'data.filter');
		const filters = _.get(response, 'data.filters');

		response = {
			data: filter ? parseToOldFilter(filter) : parseToOldFilters(filters)
		};

		if (_.isObject(response.data)) {
			return response.data;
		}

		return response;
	}
});

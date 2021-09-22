const { Model } = require('@pipedrive/webapp-core');
const _ = require('lodash');
const Logger = require('@pipedrive/logger-fe').default;
const GraphqlClient = require('client/graphql');

const logger = new Logger(`webapp.${app.ENV}`, 'graphql-model');

function tryToCall(fn) {
	try {
		return fn();
	} catch (err) {
		logger.logError(err, err.message, 'warning');
	}
}

module.exports = Model.extend({
	pull: async function(options) {
		if (!options || !_.isObject(options)) {
			options = {};
		}

		this.lastGraphQuery = GraphqlClient.query(this.getGraphQueryOptions());
		this.lastGraphQuery.pulling = true;

		let response;

		try {
			response = await this.lastGraphQuery;

			if (!response.success && window.app.ENV === 'dev') {
				const error = new Error(response.errorMeta.message);

				error.response = response;

				throw error;
			}

			response = this.parse ? tryToCall(() => this.parse(response)) : response;

			this.set(response);

			options.success && tryToCall(() => options.success(this));
		} catch (error) {
			options.error && tryToCall(() => options.error(this, {}, error));
		} finally {
			this.lastGraphQuery.pulling = false;
		}

		return response;
	},

	pulling: function() {
		return this.lastGraphQuery && this.lastGraphQuery.pulling;
	},

	getGraphQueryOptions: function() {
		const { query, variables, fetchPolicy, important } = this.graph();

		return { query, variables, fetchPolicy, context: { important } };
	}
});

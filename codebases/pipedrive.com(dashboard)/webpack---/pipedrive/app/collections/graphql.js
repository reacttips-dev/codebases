const { Collection } = require('@pipedrive/webapp-core');
const GraphqlModel = require('models/graphql');

module.exports = Collection.extend({
	pull: GraphqlModel.prototype.pull,
	pulling: GraphqlModel.prototype.pulling,
	getGraphQueryOptions: GraphqlModel.prototype.getGraphQueryOptions
});

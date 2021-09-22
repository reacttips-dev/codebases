const _ = require('lodash');
const userSelf = require('models/user');
const teams = require('collections/teams');
const companyUsers = require('collections/company');
const Logger = require('utils/logger');
const ModelCollectionFactory = require('components/model-collection-factory/index');
const router = require('./router');
const componentLoader = require('webapp-component-loader');
const getDragDropContext = require('utils/react-dnd-context').default;
const PDMetrics = require('utils/pd-metrics');

const WebappApiItems = {};

function WebappApi() {
	if (!(this instanceof WebappApi)) {
		throw new Error('WebappApi needs to be called with the new keyword');
	}

	return {
		getDragDropContext,
		config: _.cloneDeep(app.config),
		userSelf,
		companyUsers,
		teams,
		logger: Logger,
		modelCollectionFactory: ModelCollectionFactory,
		router,
		pdMetrics: PDMetrics,
		componentLoader,
		...WebappApiItems
	};
}

WebappApi.assign = (items) => {
	Object.assign(WebappApiItems, items);
};

module.exports = WebappApi;

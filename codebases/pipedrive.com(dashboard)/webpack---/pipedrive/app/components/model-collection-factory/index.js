const Pipedrive = require('pipedrive');
/* eslint-disable quote-props */
const models = {
	activity: require('models/activity'),
	customfield: require('models/customfield'),
	currency: require('models/currency'),
	deal: require('models/deal'),
	document: require('models/document'),
	mailConnection: require('models/mail/mail-connection'),
	mailMessage: require('models/mail/message'),
	mailQueueItem: Pipedrive.Model,
	mailThread: require('models/mail/thread'),
	mailParty: require('models/mail/party'),
	mailTracking: Pipedrive.Model,
	filter: require('models/filter'),
	goal: require('models/goal'),
	organization: require('models/organization'),
	person: require('models/person'),
	product: require('models/product'),
	story: require('models/story'),
	note: require('models/note'),
	marketing: require('models/marketing'),
	invoice: require('models/invoice'),
	participant: require('models/participant'),
	dealFollower: require('models/follower'),
	personFollower: require('models/follower'),
	organizationFollower: require('models/follower'),
	organizationRelation: require('models/related-organization'),
	export: require('models/export'),
	file: require('models/file'),
	field: require('models/field'),
	user: Pipedrive.Model
};
const collections = {
	activity: require('collections/activities'),
	deal: require('collections/deals'),
	file: require('collections/files'),
	filter: require('collections/filters'),
	followers: require('collections/followers'),
	organization: require('collections/organizations'),
	person: require('collections/persons'),
	product: require('collections/products'),
	language: require('collections/languages')
};
/* eslint-enable quote-props */
const getModelClass = function(type) {
	if (!models.hasOwnProperty(type)) {
		throw new Pipedrive.ModelException(`Model of "${type}" not found`);
	}

	return models[type];
};
const getCollectionClass = function(type) {
	if (!collections.hasOwnProperty(type)) {
		throw new Pipedrive.CollectionException(`Collection of "${type}" not found`);
	}

	return collections[type];
};

module.exports = {
	getModel: function(type, data, options) {
		const Model = getModelClass(type);

		return new Model(data, options);
	},
	instanceOfModel: function(type, model) {
		const Model = getModelClass(type);

		return model instanceof Model;
	},
	getCollection: function(type, data, options) {
		const Collection = getCollectionClass(type);

		// Some of the collections (i.e languages) are already initialized
		if (typeof Collection === 'object') {
			return Collection;
		}

		return new Collection(data, options);
	},
	instanceOfCollection: function(type, collection) {
		const Collection = getCollectionClass(type);

		return collection instanceof Collection;
	}
};

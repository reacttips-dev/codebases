const Pipedrive = require('pipedrive');
const LeadModel = require('models/lead');

module.exports = Pipedrive.Collection.extend({
	model: LeadModel
});

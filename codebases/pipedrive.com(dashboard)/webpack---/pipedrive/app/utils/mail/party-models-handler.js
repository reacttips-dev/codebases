const MailPartyModel = require('models/mail/party');
const _ = require('lodash');

/**
 * A helper-class for the message model to manage it's parties.
 * @param {Object} parties 	Expected format:
 *                          {
 *                          	'to': [ {..}, {..}, {..} ],
 *                          	'cc': [ {..}, {..}, {..} ],
 *                          	'bcc': [ {..}, {..}, {..} ],
 *                          	'from': [ {..}, {..}, {..} ]
 *                          }
 */

const PartyModelsHandler = function(parties) {
	this.initLists();
	this.populateLists(parties);
};

_.assignIn(PartyModelsHandler.prototype, {
	/**
	 * Object of lists of party models
	 * @type {Object}
	 */
	partyModelLists: null,

	initLists: function() {
		this.partyModelLists = this.getAllowedModelListsFormat();
	},

	getAllowedModelListsFormat: function() {
		return {
			to: [],
			cc: [],
			bcc: [],
			from: []
		};
	},

	/**
	 * Fills the party model lists with parties of the message model.
	 * @param  {Object} parties
	 * @void
	 */
	populateLists: function(parties) {
		const partyTypes = _.keys(this.partyModelLists);

		_.forEach(
			partyTypes,
			_.bind(function(partyType) {
				const partiesData = parties[partyType];

				_.forEach(partiesData, _.bind(this.addPartyToList, this, partyType));
			}, this)
		);
	},

	/**
	 * Combines the data of a party into a model and adds it into the party models list by the type of the party.
	 * @param {String} partyType 	"to", "cc", "bcc" or "from"
	 * @param {Object} partyData
	 */
	addPartyToList: function(partyType, partyData) {
		const partyModel = new MailPartyModel(partyData);

		this.partyModelLists[partyType].push(partyModel);
	},

	/**
	 * Finds and returns a single party model from all the lists, that matches the provided id.
	 * @param  {Number} partyId
	 * @return {module:Pipedrive.Model}
	 */
	getById: function(partyId) {
		return _.find(_.flatten(_.values(this.partyModelLists), true), { id: partyId });
	}
});

module.exports = PartyModelsHandler;

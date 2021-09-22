'use strict';

const Pipedrive = require('pipedrive');
const Person = require('models/person');

/**
 * Creates the participant model
 *
 * @classdesc
 * Represents the participant of something (i.e. a deal). Participant model
 * itself contains a submodel that is an actual {@link models/Person Person}
 * model and can be used as such.
 *
 * @class models/Participant
 * @augments module:Pipedrive.Model
 */

module.exports = Pipedrive.Model.extend(
	/** @lends models/Participant.prototype */ {
		/**
		 * Participant is only a wrapper for the real person model.
		 * @type {models/Person}
		 */
		person: null,
		/**
		 * Type of {@link module:Pipedrive.Model Pipedrive.Model}.
		 * @type {String}
		 */
		type: 'participant',

		allowDirectSync: true,
		/**
		 * Indicates the name of the sub-model property
		 * @type {String}
		 */
		submodel: 'person',
		/**
		 * Read-only fields of the model
		 * @type {Array}
		 */
		readonly: ['person'],

		/**
		 * Builds the API URL of the model
		 * @private
		 * @return {String} Returns Model’s API URL
		 */
		url: function() {
			if (this.get('id')) {
				return `${app.config.api}/deals/${this.deal_id ||
					this.get('related_item_id')}/participants/${this.get('id')}`;
			} else {
				return `${app.config.api}/deals/${this.deal_id ||
					this.get('related_item_id')}/participants`;
			}
		},

		/**
		 * Parses data from response data object or collection response data
		 * @private
		 * @param  {Object} data Data object to parse
		 * @return {Object}      Data part of the API response
		 */
		parse: function(data) {
			data = data.data || data;

			if (data.related_item_type) {
				const identifier = `${data.related_item_type}_id`;

				this[identifier] = data.related_item_data[identifier];
			}

			this.setPerson(data.person);
			delete data.person;

			return data;
		},

		/**
		 * Creates actual Person model from the API data or updates existing
		 * person model’s data
		 * Also adds participants related objects to person model
		 * @param {Object} data Person data from the API
		 */
		setPerson: function(data) {
			if (this.person instanceof Person) {
				this.person.set(data);
			} else {
				this.person = new Person(data);
			}

			this.person.relatedObjects = this.getRelatedObjects();
		}
	}
);

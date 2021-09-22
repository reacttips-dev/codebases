const Pipedrive = require('pipedrive');
const Company = require('collections/company');

('use strict');

/**
 * Creates the follower model
 *
 * @classdesc
 * Represents the follower of something (i.e. a deal).
 *
 * @class models/Follower
 * @augments module:Pipedrive.Model
 */

module.exports = Pipedrive.Model.extend(
	/** @lends models/Follower.prototype */ {
		user: null,
		/**
		 * Type of {@link module:Pipedrive.Model Pipedrive.Model}.
		 * @type {String}
		 */
		type: 'follower',

		allowDirectSync: true,
		/**
		 * Indicates the name of the sub-model property
		 * @type {String}
		 */
		submodel: 'user',
		/**
		 * Read-only fields of the model
		 * @type {Array}
		 */
		readonly: ['user'],
		initialize: function(options) {
			this.options = options || {};

			if (this.options.user_id) {
				this.setUser(this.options.user_id);
			}
		},
		/**
		 * Parses collection response data
		 * @private
		 * @param  {Object} data Data object to parse
		 * @return {Object}      Data part of the API response
		 */
		parse: function(data) {
			data = data.data ? data.data[0] : data;

			return data;
		},

		/**
		 * Gets user from company collection
		 * by ID
		 * @param {Object} data userId of the data from the API
		 */
		setUser: function(userId) {
			this.user = Company.getUserById(userId);
		}
	}
);

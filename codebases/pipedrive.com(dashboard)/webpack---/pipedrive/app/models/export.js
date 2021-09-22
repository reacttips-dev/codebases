const Pipedrive = require('pipedrive');
const Cookies = require('js-cookie');

/**
 * @classdesc
 * Exports model
 *
 * @class models/Exports
 * @augments module:Pipedrive.Model
 */

module.exports = Pipedrive.Model.extend({
	type: 'export',

	initialize: function() {
		this.selfUpdateFromSocket();
	},

	/**
	 * API endpoint for exports
	 * @return {String} API endpoint
	 */
	url: function() {
		if (!this.get('id')) {
			return `${app.config.api}/exports`;
		}

		return `${app.config.api}/exports/${this.get('id')}`;
	},

	/**
	 * Start exporting
	 * @param {Object} data export parameters
	 * @return {String} API endpoint
	 */
	start: function(data) {
		this.save(data);
	},

	/**
	 * API endpoint for export download
	 * @return {String} API endpoint
	 */
	getDownloadUrl: function() {
		return `${app.config.api}/exports/${this.get('id')}/download?session_token=${Cookies.get(
			'pipe-session-token'
		)}`;
	}
});

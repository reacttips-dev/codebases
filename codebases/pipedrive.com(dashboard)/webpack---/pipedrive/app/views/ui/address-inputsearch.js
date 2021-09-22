const Inputsearch = require('views/ui/inputsearch');
const _ = require('lodash');
const AddressSearch = require('collections/addresssearch');
const AddressGeocoder = require('utils/google-maps-geocoder');

/**
 * @classdesc
 * Create new Input Search component for addresses
 *
 * @param  {Object} options
 * @class views/ui/AddressInputsearch
 * @augments {views/ui/InputSearch}
 */

const addressInputSearch = Inputsearch.extend({
	initialize: function(options) {
		Inputsearch.prototype.initialize.call(this, options);

		this.on('geocoded', options.on.geocoded);
	},

	getSearchCollection: function() {
		return new AddressSearch();
	},

	/**
	 * Geocode and set input value
	 * @param {Object} result
	 */
	setResult: function(result) {
		if (!result) {
			return;
		}

		Inputsearch.prototype.setResult.call(this, result);
		this.geocodeResult(this.result.get('title'));
	},

	geocodeResult: function(address) {
		AddressGeocoder.geocodeAddress(
			address,
			_.bind(function(geocodedData) {
				this.trigger('geocoded', geocodedData, this.el);
			}, this)
		);
	},

	render: function() {
		Inputsearch.prototype.render.call(this);

		this.$list.addClass('poweredByGoogle');
	}
});

module.exports = addressInputSearch;

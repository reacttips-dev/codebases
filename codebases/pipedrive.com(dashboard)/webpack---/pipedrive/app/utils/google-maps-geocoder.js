const GoogleMapsHelper = require('utils/google-maps');
const _ = require('lodash');

/**
 * Inputsearch for addresses
 */

let local;

const googleMapsGeocoder = {
	geocoder: null,

	initGeocoder: function(callback) {
		GoogleMapsHelper.ready(
			_.bind(function(google) {
				this.geocoder = new google.maps.Geocoder();
				callback();
			}, this)
		);
	},

	geocodeAddress: function(address, callback) {
		if (this.geocoder) {
			local.geocode.call(this, address, callback);
		} else {
			this.initGeocoder(_.bind(local.geocode, this, address, callback));
		}
	}
};

local = {
	geocode: function(address, callback) {
		this.geocoder.geocode({ address }, function(result, status) {
			if (status === 'OK' && result.length > 0) {
				const geocoded = _.cloneDeep(result[0]);

				geocoded.original_address = address;

				if (geocoded.geometry && geocoded.geometry.location) {
					geocoded.geometry.location = {
						lat: _.result(geocoded.geometry.location, 'lat'),
						lng: _.result(geocoded.geometry.location, 'lng')
					};
				}

				return callback(geocoded);
			}
		});
	}
};

module.exports = googleMapsGeocoder;

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const logger = Pipedrive.Logger('utils', 'google-maps');

export default async (componentLoader) => {
	const User = await componentLoader.load('webapp:user');
	/**
	 * GoogleMapsHelper creates a singleton class on the application to reuse
	 * Google library if and when needed
	 *
	 * @class utils/GoogleMapsHelper
	 */
	const GoogleMapsHelper = function() {
		// eslint-disable-next-line prefer-rest-params
		this.initialize.apply(this, arguments);
	};

	_.assignIn(
		GoogleMapsHelper.prototype,
		Pipedrive.Events,
		/** @lends utils/GoogleMapsHelper.prototype */ {
			started: false,

			/**
			 * Initializes Helper and prepares global google map initialize
			 * function
			 * @void
			 * @private
			 */
			initialize: function() {
				const self = this;

				window.initialize_google_map = function() {
					self.google = window.google;
					self.trigger('init', self.google);
					delete window.initialize_google_map;
				};
			},

			/**
			 * Method that is used to access google maps library. On first request
			 * the google library is required and initialized, consecutive requests
			 * serve previously loaded class.
			 *
			 * @example
			 * <caption>Basic usage of GoogleMapsHelper</caption>
			 * GoogleMapsHelper.ready(function(google) {
			 *   var map = new google.maps.Map($container, viewSettings);
			 * });
			 * @static
			 * @param  {Function} callback Callback method to invoke when google
			 *                             library is ready
			 * @void
			 */
			ready: function(callback) {
				if (this.google) {
					return callback(this.google);
				} else {
					User.getUser(function() {
						componentLoader.register({
							'google-maps': {
								js: User.additionalData.google_maps_js_url
							}
						});
						componentLoader
							.load('google-maps')
							.then(function() {
								logger.log('Google Maps loaded');
							})
							.catch(function(e) {
								logger.error('Failed to load Google Maps', e);
							});
					});

					this.on('init', callback);
				}
			}
		}
	);

	return new GoogleMapsHelper();
};

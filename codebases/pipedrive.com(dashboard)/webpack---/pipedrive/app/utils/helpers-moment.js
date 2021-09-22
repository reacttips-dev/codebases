const _ = require('lodash');

const moment = require('moment');

let customFormats;

const helpers = {
	LOCALE: 'en',

	is24HourFormat: function() {
		return !_.includes(
			moment()
				.localeData()
				.longDateFormat('LT'),
			'A'
		);
	},

	getEditorTimeFormat: function() {
		return this.is24HourFormat() ? 'HH:mm' : 'hh:mm A';
	},

	injectCustomizations: function() {
		moment.fn.getEditorTime = function() {
			const locale = this.locale();

			let time = '';

			if (this.isValid()) {
				this.locale('en');
				time = this.format(helpers.getEditorTimeFormat());
				this.locale(locale);
			}

			return time;
		};

		const origFormat = moment.fn.format;

		/**
		 * Extends the original moment'js's method "format"
		 *
		 * @param  {String} inputString 	The desired format, as defined here http://momentjs.com/docs/#/displaying/format/
		 *                               	or a custom Pipedrive format (see customFormats below).
		 * @return {String}             	Formatted date / time string
		 */
		moment.fn.format = function(inputString) {
			if (_.isFunction(customFormats[inputString])) {
				inputString = customFormats[inputString].call(this);
			}

			return origFormat.call(this, inputString);
		};
	},

	formatOverrides: {
		// Override Australian start of the week day as mysql has different ideas about it. This will make BE match FE
		'en-au': { week: { dow: 0 } }
	}
};

/**
 * Contains methods that return customized moment.js formats.
 *
 * You can use the method names with moment.js like that:
 * @example
 * var custumFormattedDate = moment(model.get('date')).format('methodNameHereAsString');
 *
 * @type {Object}
 */
customFormats = {
	pd_day_month: function() {
		const userLocale = this.locale();

		// List of Pipedrive's most important locales and their format patterns ..

		const formatPatterns = {
			'en': 'MMM D',

			'en-gb': 'D MMM',
			'en-au': 'D MMM',
			'en-ca': 'D MMM',
			'en-nz': 'D MMM',
			'nl': 'D MMM',
			'fr': 'D MMM',
			'fr-ca': 'D MMM',
			'fr-ch': 'D MMM',
			'sv': 'D MMM',
			'ru': 'D MMM',
			'it': 'D MMM',
			'pl': 'D MMM',

			'pt': 'D [de] MMM',
			'pt-br': 'D [de] MMM',
			'es': 'D [de] MMM',

			'de': 'D. MMM',
			'fi': 'D. MMM',
			'et': 'D. MMM',
			'da': 'D. MMM',
			'nb': 'D. MMM',
			'cs': 'D. MMM'
		};

		// .. and a fallback for the rest.

		const fallback = 'l';

		return formatPatterns.hasOwnProperty(userLocale) ? formatPatterns[userLocale] : fallback;
	}
};

module.exports = helpers;

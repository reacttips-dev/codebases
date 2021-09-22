const Pipedrive = require('pipedrive');
const _ = require('lodash');
const moment = require('moment-timezone');
const Logger = require('@pipedrive/logger-fe').default;
const logger = new Logger(`webapp.${app.ENV}`, 'user-timezone');

module.exports = Pipedrive.Model.extend({
	url: function() {
		return `${app.config.api}/users/${this.user.get('id')}/profile`;
	},

	initialize: function(user) {
		this.user = user;
	},

	// Guess and save the new timezone the user is in
	// if the user has switched between timezones of different offsets.
	saveTimezone: function() {
		if (!this.user.settings.get('timezone_automatic_update')) {
			return;
		}

		try {
			const timezoneInValidMomentFormat = this.user.get('timezone_name').replace(' ', '_');

			const userOffset = moment()
				.tz(timezoneInValidMomentFormat)
				.format('Z');
			const browserOffset = moment().format('Z');

			if (userOffset !== browserOffset) {
				this.save({
					timezone_val: moment.tz.guess()
				});
			}
		} catch (err) {
			logger.logError(err, 'Failed to save timezone');
		}
	},

	// Defer checking and saving to the next cycle
	// to improve startup time.
	saveDeferred: function() {
		_.defer(_.bind(this.saveTimezone, this));
	}
});

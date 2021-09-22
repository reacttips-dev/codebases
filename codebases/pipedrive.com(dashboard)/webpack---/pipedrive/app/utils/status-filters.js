'use strict';
const moment = require('moment');
const _ = require('lodash');

module.exports = {
	filters: {
		planned: function() {
			return {
				start_date: null,
				end_date: null,
				done: 0
			};
		},

		overdue: function() {
			return {
				start_date: null,
				end_date: moment.utc().format('YYYY-MM-DD HH:mm:ss'),
				done: 0
			};
		},

		today: function() {
			const utcOffset = moment().utcOffset();
			const dayStartLocal = moment().startOf('day');
			const dayStartUTC = moment(dayStartLocal).subtract(utcOffset, 'minutes');
			const dayEndUTC = moment(dayStartUTC).add(1, 'days');

			return {
				start_date: dayStartUTC.format('YYYY-MM-DD HH:mm'),
				end_date: dayEndUTC.format('YYYY-MM-DD HH:mm')
			};
		},

		tomorrow: function() {
			const utcOffset = moment().utcOffset();
			const tomorrowStartLocal = moment()
				.startOf('day')
				.add(1, 'days');
			const tomorrowStartUTC = moment(tomorrowStartLocal).subtract(utcOffset, 'minutes');
			const tomorrowEndUTC = moment(tomorrowStartUTC).add(1, 'days');

			return {
				start_date: tomorrowStartUTC.format('YYYY-MM-DD HH:mm'),
				end_date: tomorrowEndUTC.format('YYYY-MM-DD HH:mm')
			};
		},

		thisWeek: function() {
			const utcOffset = moment().utcOffset();
			const weekStartLocal = moment().startOf('week');
			const weekStartUTC = moment(weekStartLocal).subtract(utcOffset, 'minutes');
			const weekEndUTC = moment(weekStartUTC).add(7, 'days');

			return {
				start_date: weekStartUTC.format('YYYY-MM-DD HH:mm'),
				end_date: weekEndUTC.format('YYYY-MM-DD HH:mm')
			};
		},

		nextWeek: function() {
			const utcOffset = moment().utcOffset();
			const nextWeekStartLocal = moment()
				.startOf('week')
				.add(7, 'days');
			const nextWeekStartUTC = moment(nextWeekStartLocal).subtract(utcOffset, 'minutes');
			const nextWeekEndUTC = moment(nextWeekStartUTC).add(7, 'days');

			return {
				start_date: nextWeekStartUTC.format('YYYY-MM-DD HH:mm'),
				end_date: nextWeekEndUTC.format('YYYY-MM-DD HH:mm')
			};
		},

		customTimeRange: function(opts = {}) {
			const dateFormat = moment()
				.localeData()
				.longDateFormat('L');
			const dateFrom = opts.dateFrom ? moment(opts.dateFrom, dateFormat) : moment();
			const dateTo = opts.dateTo ? moment(opts.dateTo, dateFormat) : moment();
			const dateFromUTC = dateFrom.utc();
			const dateToUTCOffset = dateTo.utcOffset();
			const dateToEndUTC = dateTo.add(1, 'days').subtract(dateToUTCOffset, 'minutes');

			return {
				start_date: dateFromUTC.format('YYYY-MM-DD HH:mm'),
				end_date: dateToEndUTC.format('YYYY-MM-DD HH:mm')
			};
		}
	},

	descriptions: [
		{
			name: _.gettext('To-do'),
			key_string: 'planned'
		},
		{
			name: _.gettext('Overdue'),
			key_string: 'overdue'
		},
		{
			name: _.gettext('Today'),
			key_string: 'today'
		},
		{
			name: _.gettext('Tomorrow'),
			key_string: 'tomorrow'
		},
		{
			name: _.gettext('This week'),
			key_string: 'thisWeek'
		},
		{
			name: _.gettext('Next week'),
			key_string: 'nextWeek'
		},
		{
			name: _.gettext('Select period'),
			key_string: 'customTimeRange'
		}
	],

	defaultFilter: 'planned'
};

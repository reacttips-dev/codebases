const TimeParsers = require('utils/timeparsers');
const _ = require('lodash');
const moment = require('moment');
const $ = require('jquery');

function getSpec(spec) {
	const specifications = _.keys(TimeParsers);

	if (-1 === _.indexOf(specifications, spec)) {
		spec = specifications[0];
	}

	return spec;
}

function getStringBoolean(attr) {
	return attr ? '1' : '0';
}

module.exports = {
	timestamp: function(time, spec, utc, f) {
		spec = getSpec(spec);
		f = f || 'YYYY-MM-DD HH:mm:ss';

		if (!(time instanceof moment.fn.constructor)) {
			time = utc ? moment.utc(time, f).local() : moment(time, f);
		}

		return TimeParsers[spec](time);
	},

	interactiveTimestamp: function(time, spec, utc, f) {
		if (!time) {
			return;
		}

		const $timestamp = $('<span class="interactiveTimestamp"></span>');
		const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

		f = f || defaultFormat;

		if (time instanceof moment.fn.constructor) {
			$timestamp.attr('data-time', time.format(defaultFormat));
		} else {
			$timestamp.attr('data-time', time);
		}

		$timestamp.attr('data-utc', getStringBoolean(utc));
		$timestamp.attr('data-notime', getStringBoolean(time.noTime));
		$timestamp.attr('data-spec', spec);
		$timestamp.attr(
			'title',
			_.timestamp(time, time.noTime ? 'longDateNoTime' : 'longDate', utc, f)
		);

		if (f !== defaultFormat) {
			$timestamp.attr('data-f', f);
		}

		const timestampString = _.timestamp(time, spec, utc, f);

		$timestamp.text(timestampString).trigger('contentUpdate');

		return $timestamp[0].outerHTML;
	},

	diff: function(source, update) {
		return _.reduce(
			update,
			function(diffs, value, key) {
				if (_.has(source, key) && _.isEqual(source[key], value)) {
					return diffs;
				}

				const diff = {};

				diff[key] = _.cloneDeep(value);

				return _.merge(diffs, diff);
			},
			{}
		);
	}
};

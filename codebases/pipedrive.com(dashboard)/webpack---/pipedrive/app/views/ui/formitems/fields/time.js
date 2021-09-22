const template = require('../template');
const _ = require('lodash');
const moment = require('moment');
const $ = require('jquery');
const timepickerBinds = [];
const bindTimePicker = function(cfg) {
	const input = document.getElementById(cfg.uuid);

	if (!input) {
		return;
	}

	const isDurationField = cfg.key === 'duration';
	const isDueTimeField = cfg.key === 'due_time';
	const config = _.assignIn(
		{
			show24Hours:
				!_.includes(
					moment()
						.localeData()
						.longDateFormat('LT'),
					'A'
				) || isDurationField,
			step: 15,
			startTime: isDurationField ? '00:15' : '00:00',
			endTime: '23:45',
			// Set default hour to now
			defaultSelected: isDueTimeField
				? `${moment().get('hour')}:${moment().get('minute')}`
				: null
		},
		cfg.config
	);

	if (input.enriched) {
		return;
	}

	input.enriched = true;

	timepickerBinds.push(input);

	$(input).timePicker(config);
};

const destroyOverlays = function(type) {
	const len = timepickerBinds.length;

	for (let i = 0; i < len; i++) {
		const element = timepickerBinds[i];

		if (element && element.timePicker && $(element).parents(type).length) {
			$.timePicker(element).destroy();
		}

		timepickerBinds.shift(i, 1);
	}
};

const bindFieldEvents = function(options, selector) {
	bindTimePicker(options);

	if (_.isBoolean(options.clear) && options.clear) {
		$(selector + options.uuid).on('click', (ev) => {
			ev.stopPropagation();
			ev.preventDefault();
			$(`#${options.uuid}`).val('');

			if (_.isObject(options.on) && _.isFunction(options.on.clear)) {
				options.on.clear();
			}
		});
	}
};

app.global.bind('ui.*.event.scroll', () => {
	const len = timepickerBinds.length;

	for (let j = 0; j < len; j++) {
		$.timePicker(timepickerBinds[j]).hide();
	}
});

app.global.bind('ui.timepicker.event.close', () => {
	for (let i = 0; i < timepickerBinds.length; i++) {
		if ($(timepickerBinds[i]).length) {
			$.timePicker(timepickerBinds[i]).destroy();
			timepickerBinds.shift(i, 1);
		}
	}
});

app.global.bind('ui.modal.dialog.close', _.bind(destroyOverlays, this, '#modal'));
app.global.bind('ui.popover.event.close', _.bind(destroyOverlays, this, '#popover'));

module.exports = function(opts) {
	const options = _.assignIn({ uuid: `time-${_.makeid()}` }, opts);

	setTimeout(() => bindFieldEvents(options, '#clear-'), 10);

	if (opts.subfields) {
		options.sub = _.assignIn(
			{
				uuid: `time-${_.makeid()}`
			},
			opts.subfields[0]
		);

		setTimeout(() => bindFieldEvents(options.sub, '#'), 10);
	}

	options.field_type = 'time';
	delete options.subfields;
	delete options.options;

	return template({ input: options });
};

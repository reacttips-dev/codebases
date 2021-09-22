const Pipedrive = require('pipedrive');
const _ = require('lodash');
const Pikaday = require('pikaday');
const moment = require('moment');
const $ = require('jquery');
const pikadayBinds = {};
const destroyOverlays = function(type) {
	// eslint-disable-next-line no-unused-vars
	for (const i in pikadayBinds) {
		if ($(`[name=${i}]`).parents(type).length) {
			pikadayBinds[i].destroy();
			delete pikadayBinds[i];
		}
	}
};
const getValue = function(cfg, inputEl) {
	return cfg.sub ? moment(pikadayBinds[inputEl.name].getDate()) : null;
};
const isInvalidInput = function(inputDate, keyCode) {
	const keys = Pipedrive.common.keyCodes();
	const isGenericKey = _.includes(_.values(keys), keyCode);

	return isGenericKey || !inputDate.isValid();
};
const createOnOpenHandler = function(valueContainer, inputEl, cfg) {
	return function() {
		valueContainer.value = getValue(cfg, inputEl);

		if (cfg.sub && valueContainer.value) {
			cfg.sub.minDate = valueContainer.value.toDate();
		}

		$(inputEl)
			.off('keyup.pikadayKeyup')
			.on('keyup.pikadayKeyup', (ev) => {
				const inputDate = moment($(inputEl).val(), 'L', true);

				if (isInvalidInput(inputDate, ev.keyCode)) {
					return;
				}

				if (pikadayBinds[inputEl.name] instanceof Pikaday) {
					/**
					 * Pikaday needs iso standard date string
					 */
					pikadayBinds[inputEl.name].setDate(inputDate.format());
				}
			});
	};
};
const getSubInput = function(cfg) {
	return cfg.noField ? null : document.getElementById(cfg.sub.uuid);
};
const isDatesValid = function(valueContainer, untilDate, newValue) {
	return valueContainer.value && untilDate < newValue;
};
const createOnSelectHandler = function(valueContainer, inputEl, cfg) {
	return function() {
		if (cfg.sub) {
			const subInput = getSubInput(cfg);
			const untilCalendar = pikadayBinds[subInput.name];
			const newValue = moment(pikadayBinds[inputEl.name].getDate());

			cfg.sub.minDate = newValue.toDate();

			if (untilCalendar) {
				const untilDate = untilCalendar.getDate();

				untilCalendar.setMinDate(newValue.toDate());

				if (isDatesValid(valueContainer, untilDate, newValue)) {
					const daysDiff = Math.abs(valueContainer.value.diff(untilDate, 'days')) || 1;

					untilCalendar.setDate(newValue.add(daysDiff, 'days').toDate());
					untilCalendar.setMinDate(newValue.subtract(daysDiff, 'days').toDate());
				}
			}
		}

		$(inputEl).trigger('change');

		if (_.isFunction(cfg.onSelect)) {
			cfg.onSelect(this.getDate());
		}
	};
};
const createEventHandlers = function(inputEl, cfg) {
	const valueContainer = { value: null };

	return {
		onOpen: createOnOpenHandler(valueContainer, inputEl, cfg),
		onSelect: createOnSelectHandler(valueContainer, inputEl, cfg)
	};
};
const getConfig = function(inputEl, cfg) {
	const handlers = createEventHandlers(inputEl, cfg);

	return _.assignIn(
		{
			field: inputEl,
			firstDay: moment()
				.startOf('week')
				.isoWeekday(),
			format: moment()
				.localeData()
				.longDateFormat('L'),
			minDate: cfg.sub ? null : cfg.minDate,
			i18n: {
				months: moment.months('MMMM'),
				weekdays: moment.weekdays(),
				weekdaysShort: moment.weekdaysShort()
			},
			onOpen: handlers.onOpen,
			onSelect: handlers.onSelect,
			showDaysInNextAndPreviousMonths: true
		},
		cfg.config
	);
};

// Hide all date pickers when user scrolls
app.global.bind('ui.*.event.scroll', () => {
	// eslint-disable-next-line no-unused-vars
	for (const i in pikadayBinds) {
		if (pikadayBinds[i].hide) {
			pikadayBinds[i].hide();
		}
	}
});

// Fully remove when user closes the dialog or modal
app.global.bind('ui.modal.dialog.close', _.bind(destroyOverlays, this, '#modal'));
app.global.bind('ui.popover.event.close', _.bind(destroyOverlays, this, '#popover'));

module.exports = {
	render: function(cfg) {
		const input = cfg.noField ? null : document.getElementById(cfg.uuid);
		const config = getConfig(input, cfg);

		if (!input || input.enriched) {
			return;
		}

		input.enriched = true;
		pikadayBinds[input.name] = new Pikaday(config);

		return pikadayBinds[input.name];
	},
	clear: function(inputId) {
		const input = document.getElementById(inputId);
		const datepicker = pikadayBinds[input.name];

		if (datepicker) {
			datepicker.setDate(null);
			datepicker.gotoToday();
		}
	}
};

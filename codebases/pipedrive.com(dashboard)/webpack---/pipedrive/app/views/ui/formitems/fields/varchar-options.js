const createLoadCallback = require('../create-load-callback');
const _ = require('lodash');
const template = require('../template');
const selectField = require('./select');
const $ = require('jquery');

function bindSubfieldEvents(options, subfieldOptions) {
	$(`#${options.uuid}`).on('change', function() {
		const isOther = Number($(this).val()) === 0 && $(this).val() !== '';
		const $subfieldElement = $(`#${subfieldOptions.uuid}`);

		$subfieldElement.closest('span.input').toggleClass('hidden', !isOther);

		if (isOther) {
			$subfieldElement.focus();
		}
	});

	if (options.options && options.options.length === 1) {
		$(`#${options.uuid}`)
			.closest('span.input')
			.addClass('hidden');
		$(`#${subfieldOptions.uuid}`)
			.closest('span.input')
			.removeClass('hidden');
	}
}

function getFieldOptions(opts) {
	const options = _.assignIn(
		{
			uuid: `vo-${_.makeid()}`,
			freeTextAllowed: true,
			options: [],
			placeholder: _.gettext('Choose an option'),
			allowClear: true
		},
		opts
	);

	options.options = _.clone(options.options) || {};

	if (options.value || options.value === '') {
		let optionSelected = false;

		_.forEach(options.options, function(option) {
			if (!optionSelected) {
				optionSelected = option.label === options.value;
				option.selected = optionSelected;
			}
		});

		if (!options.subfield) {
			options.subfield = {
				key: `${options.key}-other`,
				value: optionSelected ? '' : options.value
			};
		}
	}

	return options;
}

module.exports = function(opts) {
	const options = getFieldOptions(opts);
	const hasValue = options.value || options.value === '';

	let subfieldHtml = '';
	let subfieldOptions = {};

	if ((options.subfield && options.freeTextAllowed) || !options.options.length) {
		const hasValueAndIsOtherSelected = hasValue && !_.find(options.options, { selected: true });

		subfieldOptions = _.assignIn(
			{
				uuid: `voSubfield-${_.makeid()}`,
				loadCallback: `async${_.makeid()}`,
				field_type: 'varchar',
				wrapClassName: hasValueAndIsOtherSelected ? '' : 'hidden'
			},
			options.subfield
		);

		options.options.push({
			id: 0,
			label: _.gettext('Other...'),
			selected: false
		});

		createLoadCallback(subfieldOptions.loadCallback, function() {
			bindSubfieldEvents(options, subfieldOptions);
		});

		subfieldHtml = template({ input: subfieldOptions });
	}

	return selectField(options) + subfieldHtml;
};

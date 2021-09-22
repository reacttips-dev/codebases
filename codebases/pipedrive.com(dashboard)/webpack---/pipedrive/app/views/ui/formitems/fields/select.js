const $ = require('jquery');
const _ = require('lodash');
const createLoadCallback = require('../create-load-callback');
const template = require('../template');
const selectors = require('../select');

function bindSelectEvents(elementId) {
	$(`#${elementId}`)
		.on('change.form', function() {
			$(this).trigger('change.select2');
			$(this).select2('enable', !$(this).prop('disabled'));
		})
		.on('reset.form', function() {
			$(this).val($('option[selected]', this).attr('value'));
			$(this).trigger('change.select2');
			$(this).select2('enable', !$(this).prop('disabled'));
		});
}

function selectField(opts) {
	const options = _.assignIn(
		{
			uuid: `select-${_.makeid()}`,
			loadCallback: `async_${_.makeid()}`,
			allowClear: false,
			minimumResultsForSearch: 10
		},
		opts
	);

	options.field_type = 'select';

	// Note that because browsers assume the first option element is selected
	// in non-multi-value select boxes an empty first option element must be
	// provided (<option></option>) for the placeholder to work.
	if ((options.allowClear || options.placeholder) && !!options.options?.[0].id) {
		options.options.unshift({
			id: '',
			label: ''
		});
	}

	createLoadCallback(options.loadCallback, function() {
		const select2options = _.assignIn(
			{
				dropdownAutoWidth: true,
				width: $(`#${options.uuid}`).data('width')
					? $(`#${options.uuid}`).data('width')
					: 'copy',
				placeholder: options.placeholder,
				allowClear: options.allowClear,
				minimumResultsForSearch: options.minimumResultsForSearch,
				formatResult: options.formatOption,
				formatSelection: options.formatSelect
			},
			opts.select2
		);

		if (options.select2options) {
			_.assignIn(select2options, options.select2options);
		}

		selectors.render(options.uuid, select2options);

		bindSelectEvents(options.uuid);
	});

	return template({ input: options });
}

module.exports = selectField;

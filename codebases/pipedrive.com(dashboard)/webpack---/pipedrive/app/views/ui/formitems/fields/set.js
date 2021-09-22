const $ = require('jquery');
const _ = require('lodash');
const template = require('../template');
const createLoadCallback = require('../create-load-callback');
const select = require('../select');

module.exports = function(opts) {
	const options = _.assignIn(
		{
			uuid: `set-${_.makeid()}`,
			field_type: 'set',
			loadCallback: `async_${_.makeid()}`
		},
		opts
	);

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

		select.render(options.uuid, select2options);

		const $selector = select.get(options.uuid);

		$selector
			.prev()
			.find('.select2-input')
			.on('focus', function() {
				$selector.select2('open');
			});

		$(`#${options.uuid}`)
			.on('change.form', function() {
				$(this).trigger('change.select2');
			})
			.on('reset.form', function() {
				$(this).val($('option[selected]', this).attr('value'));
				$(this).trigger('change.select2');
			});
	});

	return template({ input: options });
};

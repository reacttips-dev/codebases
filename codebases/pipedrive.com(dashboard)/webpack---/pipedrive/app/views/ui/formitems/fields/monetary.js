const User = require('models/user');
const _ = require('lodash');
const template = require('../template');
const select = require('../select');
const createLoadCallback = require('../create-load-callback');
const Currencies = require('collections/currencies');
const $ = require('jquery');

let currencyList = [];

Currencies.ready(
	_.bind(function(c) {
		currencyList = c.models;
	}, this)
);

module.exports = function(opts) {
	opts.sub = _.assignIn(
		{
			uuid: `currency-${_.makeid()}`
		},
		opts.subfields[0]
	);

	opts.sub.data = {
		width: opts.subfields[0].width ? opts.subfields[0].width : '59%'
	};

	delete opts.field_type;
	delete opts.subfields;
	delete opts.options;

	const options = _.assignIn(
		{
			uuid: `price-${_.makeid()}`,
			field_type: 'monetary',
			loadCallback: `async_${_.makeid()}`
		},
		opts
	);

	createLoadCallback(options.loadCallback, function() {
		select.render(options.sub.uuid, {
			dropdownAutoWidth: true,
			width: $(`#${options.sub.uuid}`).data('width')
				? $(`#${options.sub.uuid}`).data('width')
				: 'copy'
		});

		$(`#${options.sub.uuid}`)
			.on('change.form', function() {
				$(this).trigger('change.select2');
			})
			.on('reset.form', function() {
				$(this).val($('option[selected]', this).attr('value'));
				$(this).trigger('change.select2');
			});
	});

	$(opts.el).one('remove', function() {
		select.destroy(options.sub.uuid);
	});

	return template({ input: options, currencies: currencyList, user: User });
};

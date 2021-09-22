const _ = require('lodash');
const template = require('../template');
const $ = require('jquery');

let customCheckboxEvents = false;

const bindCheckboxEvents = function() {
	$(document).on('change.form reset.form', 'input[type=checkbox]', function(ev) {
		if (
			$(this).prop('disabled') &&
			$(this)
				.parents('label')
				.hasClass('disabled')
		) {
			ev.preventDefault();

			return;
		}

		if (this.name) {
			$(`[name="${this.name}"]:not(:checked)`)
				.parents('label')
				.removeClass('selected');
		}

		$(this)
			.parents('label')
			[$(this).prop('disabled') ? 'addClass' : 'removeClass']('disabled');
		$(this)
			.parents('label')
			[$(this).prop('checked') ? 'addClass' : 'removeClass']('selected');
	});
};
const buildRegularOptions = function(options) {
	return _.assignIn(
		{
			key: `check_${_.makeid()}`,
			value: '',
			checked: false,
			field_type: 'checkbox',
			noWrap: true
		},
		options
	);
};

module.exports = function(opts) {
	const options = buildRegularOptions(opts);

	if (!customCheckboxEvents) {
		bindCheckboxEvents();
		customCheckboxEvents = true;
	}

	return $.trim(template({ input: options }));
};

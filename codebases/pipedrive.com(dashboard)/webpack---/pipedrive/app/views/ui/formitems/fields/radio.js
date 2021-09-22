const template = require('../template');
const _ = require('lodash');
const $ = require('jquery');

let customRadioEvents = false;

function bindRadioEvents() {
	$(document)
		.on('change.form reset.form', 'input[type=radio]', function() {
			$(this).data('changed', true);

			const labelParent = $(this).parent('label');
			const formElement = labelParent.parent('.form-switch-buttons');

			if (formElement.length > 0) {
				formElement.children().each((_, e) => $(e).removeClass('active'));
			} else {
				$(`[name="${this.name}"]:not(:checked)`)
					.parents('label')
					.removeClass('active');
			}

			labelParent[$(this).prop('disabled') ? 'addClass' : 'removeClass']('disabled');
			labelParent[$(this).prop('checked') ? 'addClass' : 'removeClass']('active');
		})
		.on('click.widget', '.deselectable .active input[type=radio]:checked', function() {
			if ($(this).data('changed')) {
				$(this).data('changed', null);

				return;
			}

			$(this)
				.prop('checked', false)
				.trigger('change.form');
		});
}

function radioField(opts) {
	const options = _.assignIn(
		{
			key: `choice_${_.makeid()}`,
			value: '',
			checked: false,
			field_type: 'radio',
			noWrap: true
		},
		opts
	);

	if (!customRadioEvents) {
		bindRadioEvents();
		customRadioEvents = true;
	}

	return $.trim(template({ input: options }));
}

module.exports = radioField;

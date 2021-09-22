const varcharAuto = require('./varchar-auto');
const _ = require('lodash');
const $ = require('jquery');
const getFieldItemContent = function(fieldType, opts, cfg, noResultsMessage) {
	const options = _.assignIn(
		{
			data: {
				el: opts.el,
				type: fieldType,
				helper: true,
				noResultsMessage
			},
			wrapClassName: 'hasIcon',
			iconClass: `sm-${fieldType}`
		},
		opts
	);

	options.key = `${opts.key}_helper`;

	const config = _.assignIn(
		{
			type: fieldType,
			on: {
				change: function(result, input) {
					const inputValue = $.trim(input.value);
					const fieldIdHolder = input.previousSibling;

					if (_.isEmpty(inputValue)) {
						fieldIdHolder.value = '';
					} else {
						fieldIdHolder.value = result && result.get('id');
					}

					/* eslint-disable no-undefined */
					if (noResultsMessage === undefined) {
						/* eslint-enable no-undefined */
						if (Number(fieldIdHolder.value) === 0 && inputValue) {
							$(input)
								.parent()
								.append($('<span class="badge">').text(_.gettext('New')));
						} else {
							$(input)
								.parent()
								.find('.badge')
								.remove();
						}
					}
				}
			}
		},
		cfg
	);

	const $content = $('<div>').html(varcharAuto(options, config));

	$content
		.find('span.input input')
		.before(`<input type="hidden" name="${opts.key}" value="${opts.value_id || ''}" />`);

	return $content.html();
};

module.exports = {
	person: function(opts, cfg) {
		return getFieldItemContent('person', opts, cfg);
	},

	organization: function(opts, cfg) {
		return getFieldItemContent('organization', opts, cfg);
	},

	deal: function(opts, cfg) {
		// Setting noResultsMessage null will hide option to add new items from inputsearch
		return getFieldItemContent('deal', opts, cfg, null);
	}
};

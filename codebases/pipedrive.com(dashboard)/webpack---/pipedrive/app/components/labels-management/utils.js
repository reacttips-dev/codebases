'use strict';

const _ = require('lodash');

module.exports = {
	formatSelect2LabelOption: function(option) {
		const color = _.escape(option.element[0].dataset.color);
		const outline = _.escape(option.element[0].dataset.outline) === 'false' ? false : true;

		if (option.id) {
			const badgeClass = color ? ` cui4-badge--${color}` : '';
			const badgeOutlineClass = outline ? 'cui4-badge--outline' : '';

			return `<div class="cui4-badge${badgeClass} ${badgeOutlineClass}"><div class="cui4-badge__label">${_.escape(
				option.text
			)}</div></div>`;
		}

		return option.text;
	}
};

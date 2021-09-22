const template = require('../template');
const _ = require('lodash');
const radioField = require('./radio');
const selectField = require('./select');

function renderSelectField(opts) {
	if (opts.style && opts.style.match(/deselectable/)) {
		opts.allowClear = true;
	}

	_.forEach(opts.options, (opt) => {
		if (opt.checked === true) {
			opt.selected = true;
		}
	});

	return selectField(opts);
}

module.exports = function(opts) {
	let labels = '';

	_.forEach(opts.options, (opt) => {
		labels += opt.label ? opt.label.trim() : '';

		if (opt.selected) {
			opt.checked = opt.selected;
		}
	});

	// Use select dropmenu when there are more than 4 options or total number of characters is more than 25
	if (
		!opts.force &&
		_.isObject(opts.options) &&
		(_.keys(opts.options).length > 4 || labels.length > 25)
	) {
		return renderSelectField(opts);
	}

	if (!opts.options) {
		opts.options = [
			{
				id: null,
				label: `(${_.gettext('none')})`
			}
		];
	}

	if (opts.tabindex) {
		opts.options[0].tabindex = opts.tabindex;
	}

	const options = _.assignIn(opts, { field_type: 'enum' });

	return template({ input: options, radio: radioField });
};

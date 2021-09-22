const createLoadCallback = require('../create-load-callback');
const _ = require('lodash');
const template = require('../template');
const selectField = require('./select');
const varcharField = require('./varchar');
const { getTypeLabels } = require('../../typeLabels');
const $ = require('jquery');

function createSelectArray(labels) {
	return _.map(labels, ({ label, displayLabel }, i) => {
		return {
			id: label.toLowerCase(),
			label: displayLabel,
			selected: i === 0
		};
	});
}

function getSelectArray(options) {
	const typeLabels = getTypeLabels(options.field_originalType);

	let selectArray = createSelectArray(typeLabels);

	if (options.field_originalType === 'phone') {
		const defaultLabels = selectArray.map((item) => item.id.toLowerCase());

		_.forEach(options.value, (customLabel) => {
			const label = customLabel.label;

			if (_.isString(label) && !_.includes(defaultLabels, label.toLowerCase())) {
				selectArray.push({
					id: label.toLowerCase(),
					label: customLabel.displayLabel,
					selected: false
				});
			}
		});

		selectArray = _.uniq(selectArray, (item) => {
			return item.id;
		});
	}

	return selectArray;
}

function appendField($wrap, options, selectOptions, varcharOptions) {
	const removeLinkHtml = _.form.button({
		icon: 'trash',
		size: 'small',
		wrapClassName: 'removeContactField',
		color: 'ghost'
	});

	selectOptions.uuid = `${options.field_originalType}-${_.makeid()}`;

	if (
		!$wrap
			.find('.inputContactRow')
			.first()
			.find('.removeContactField').length
	) {
		$wrap
			.find('.inputContactRow')
			.first()
			.append(removeLinkHtml)
			.closest('.inputContact')
			.addClass('multiple');
	}

	$wrap
		.find('.inputContactRow')
		.last()
		.after(`<span class="inputContactRow">${removeLinkHtml}</span>`);
	$wrap
		.find('.inputContactRow')
		.last()
		.prepend(selectField(selectOptions))
		.prepend(varcharField(varcharOptions))
		.find('> input')
		.val('')
		.focus();
}

function setSelectedOptions(options, val) {
	_.forEach(options, (option) => {
		option.selected = val.label && option.id === val.label.toLowerCase();
	});

	return options;
}

function createContactTemplate(values, options, selectOptions, varcharOptions) {
	const contactTemplate = template({
		input: _.assignIn(options, { field_type: 'contact' }),
		addLinkText: _.gettext('add one more')
	});
	const $content = $('<div>').html(contactTemplate);

	$content
		.find('.input')
		.addClass('inputContact')
		.attr('data-fieldtype', options.field_originalType)
		.attr('id', `${options.uuid}_wrap`);

	$content
		.find('.inputContactRow')
		.prepend(selectField(selectOptions))
		.prepend(varcharField(varcharOptions));

	// add more existing fields
	while (values && values.length) {
		const val = values.shift();

		varcharOptions.value = val.value;
		selectOptions.options = setSelectedOptions(selectOptions.options, val);

		appendField($content, options, selectOptions, varcharOptions);
	}

	return $content.html();
}

function getValues(options) {
	return _.isArray(options.value) && options.value.length ? _.clone(options.value) : null;
}

function getSelectOptions(options, selectArray) {
	return {
		uuid: `${options.uuid}_label`,
		key: `${options.key}[][label]`,
		field_type: 'select',
		withLabel: false,
		noWrap: true,
		options: _.clone(selectArray),
		defaultValue: 'work'
	};
}

function getVarcharOptions(options) {
	return _.assignIn(_.clone(options), {
		field_type: 'varchar',
		withLabel: false,
		noWrap: true,
		key: `${options.key}[][value]`
	});
}

// This is a recursive field. The recursion happens
// in the callback.
function contactField(opts, append) {
	const options = opts;
	const selectArray = getSelectArray(options);

	if (!append) {
		createLoadCallback(options.loadCallback, () => {
			return onLoadHandler(options);
		});
	}

	const selectOptions = getSelectOptions(options, selectArray);
	const varcharOptions = getVarcharOptions(options);

	delete varcharOptions.loadCallback;

	if (options.tabindex) {
		selectOptions.tabindex = options.tabindex;
	}

	// apply existing value for editing
	const values = getValues(options);

	if (values) {
		const firstVal = values.shift();

		varcharOptions.value = firstVal.value;
		_.forEach(selectOptions.options, (option) => {
			option.selected = firstVal.label && option.id === firstVal.label.toLowerCase();
		});
	}

	let html = '';

	if (append) {
		const $wrap = $(`#${options.uuid}_wrap`);

		appendField($wrap, options, selectOptions, varcharOptions);
	} else {
		html = createContactTemplate(values, options, selectOptions, varcharOptions);
	}

	return html;
}

function onLoadHandler(options) {
	const $wrap = $(`#${options.uuid}_wrap`);

	if ($wrap.length) {
		$wrap.on('click', '.addContactField', (ev) => {
			ev.preventDefault();

			if (
				$(ev.target)
					.closest('.inputContact')
					.hasClass('disabled')
			) {
				return;
			}

			// Recursion
			contactField(_.assignIn(options, { value: null }), true);
		});
		$wrap.on('click', '.removeContactField', (ev) => {
			ev.preventDefault();

			const $removedContent = $(ev.currentTarget).parent();

			$removedContent.remove();

			if ($wrap.find('.inputContactRow').length === 1) {
				$wrap
					.find('.inputContactRow')
					.closest('.inputContact')
					.removeClass('multiple')
					.find('.removeContactField')
					.remove();
			}
		});
	}
}

module.exports = contactField;

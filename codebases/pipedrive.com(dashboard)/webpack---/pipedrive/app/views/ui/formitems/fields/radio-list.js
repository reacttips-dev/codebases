const $ = require('jquery');
const _ = require('lodash');

let options = {};
let maxWidth = 0;
let selectWidth = 0;
let listWidth = 0;
let visibleValues;
let radioListContainer;

function initRadioList(opts) {
	options = opts || {};

	return {
		element: initRadios() + initSelect(),
		formatRadioList: onReady
	};
}

function initRadios() {
	let radios = '';

	_.forEach(options.values, function(value) {
		radios += _.form.radio(value);
	});

	return radios;
}

function initSelect(excludeValues) {
	const selectValues = _.clone(options.values);
	const selectedOption = _.find(selectValues, { checked: true });

	_.forEach(excludeValues, function(val) {
		_.remove(selectValues, { value: val });
	});

	_.forEach(selectValues, function(selectValue) {
		selectValue.selected = selectValue === selectedOption;
	});

	return _.form.select(
		_.assignIn({}, options.selectOptions, {
			options: selectValues,
			formatSelect,
			formatOption,
			minimumResultsForSearch: -1
		})
	);
}

function formatSelect(options) {
	const $el = $(options.element);
	const data = $el.data();
	const text = options.text;

	if (data.icon) {
		return `<span class="select2-type-icon">${_.icon(
			`ac-${_.escape(data.icon)}`,
			'small'
		)}</span>`;
	}

	return `<span>${_.escape(text)}</span>`;
}

function formatOption(object) {
	const $el = $(object.element);
	const data = $el.data();
	const text = object.text;

	if (data.icon) {
		return (
			`<span class="select2-type-icon">${_.icon(
				`ac-${_.escape(data.icon)}`,
				'small'
			)}</span>` +
			`<span class="select2-activity-type" value="${object.id}">${_.escape(text)}</span>`
		);
	}

	return `<span class="select2-activity-type">${_.escape(text)}</span>`;
}

function onReady(container) {
	radioListContainer = container;
	updateList();
	bindListeners();
}

function bindListeners() {
	const containerEl = radioListContainer;
	const onRadioChange = function(e) {
		const target = e.target;

		let selectedRadio;

		if (target.value) {
			selectedRadio = containerEl.find(`input[value=${target.value}]`);
		} else {
			containerEl.find('input[type=radio]:first').trigger('change');
		}

		containerEl.children().removeClass('active');
		$(selectedRadio)
			.parent()
			.addClass('active');
	};
	const onSelectChange = function(e) {
		const target = e.target;
		const value = target.value;

		let selectedRadio;

		if (value) {
			selectedRadio = containerEl.find(`input[value=${value}]`);
			selectedRadio.prop('checked', true);
			selectedRadio.trigger('click').trigger('change');
		}

		$(target.parentElement).addClass('active');
	};

	containerEl.find('select').on('select2-selected', onSelectChange);
	containerEl.find('label.widget-radio input[type=radio]').on('click', onRadioChange);
}

function getElementsWidth(elements) {
	let width = 0;

	_.each(elements, function(el) {
		width += $(el).outerWidth();
	});

	return width;
}

function updateList() {
	maxWidth = radioListContainer.width();

	const selectListSelector = `.${options.selectOptions.wrapClassName}`;
	const radios = radioListContainer.find('label.widget-radio');
	const updateProperties = {
		isCollapsed: getElementsWidth(radios) > maxWidth
	};

	let newSelect;

	selectWidth = radioListContainer.find(selectListSelector).width();
	visibleValues = [];
	listWidth = selectWidth;

	if (maxWidth === 0) {
		return;
	}

	if (updateProperties.isCollapsed) {
		_.each(radios, function(el) {
			$(el)
				.find('span.widget-radio_label')
				.hide();
		});
	}

	if (getElementsWidth(radios) > maxWidth) {
		_.each(radios, formatRadioElement);
		_.each(radios.not(':hidden'), setVisibleValue);

		newSelect = initSelect(visibleValues);
		radioListContainer.find(selectListSelector).replaceWith(newSelect);

		if (
			!_.isEmpty(
				$(radios)
					.not(':visible')
					.find(':checked')
			)
		) {
			radioListContainer.find(selectListSelector).addClass('active');
		}
	} else {
		radioListContainer.find(selectListSelector).remove();
	}

	if (_.isFunction(options.onUpdate)) {
		options.onUpdate(updateProperties);
	}
}

function formatRadioElement(el) {
	const currentRadio = $(el);

	listWidth += currentRadio.outerWidth();

	if (listWidth >= maxWidth) {
		currentRadio.hide();
	}
}

function setVisibleValue(el) {
	visibleValues.push(
		$(el)
			.find('input')
			.val()
	);
}

module.exports = initRadioList;

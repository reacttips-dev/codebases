const template = require('../template');
const _ = require('lodash');
const autocomplete = require('../autocomplete');
const createLoadCallback = require('../create-load-callback');
const $ = require('jquery');
const QuickInfoCard = require('views/quick-info-card');

let inputSearch;

function getSettings(options) {
	const settings = {
		name: options.key,
		value: options.value,
		uuid: options.uuid ? options.uuid : options.key,
		data: options.data,
		on: options.on,
		returnStringValue: options.returnStringValue,
		exclude: options.exclude,
		defaultSize: options.defaultSize,
		isFetching: options.isFetching
	};

	if (options.prefillModel) {
		settings.prefillModel = options.prefillModel;
	}

	return settings;
}

function getChildNode(value, name) {
	const badge = `<span class="badge">${_.gettext('New')}</span>`;
	const cross = _.icon('sm-cross', 's', null, 'multipleOptionsElement__cross');
	const dataId = value.id ? ` data-id="${value.id}"` : '';
	const classNames = `multipleOptions__element${
		value.id ? '' : ' multipleOptions__element--new'
	}${value.showWarning ? ' multipleOptions__element--noemail' : ''}`;
	const inputName = `${name}_${value.id || _.makeid()}`;
	const escapedValue = _.escape(value.name);
	const input = `<input type="hidden" name="${inputName}" value="${escapedValue}" />`;
	const warning = `<span class="multipleOptionsElement__warning">${_.icon(
		'warning-outline',
		'small',
		'yellow'
	)}</span>`;

	return `<span class="${classNames}"${dataId}>${input}${cross}${escapedValue}${
		value.id ? '' : badge
	}${value.showWarning ? warning : ''}</span>`;
}

function removeElement($element) {
	const $input = $element.siblings('input');
	const elementId = $element.data('id');

	if ($element.siblings('.multipleOptions__element').length === 0) {
		const placeholder = $input.data('placeholder');

		if (placeholder) {
			$input.attr({
				placeholder,
				size: placeholder.length
			});
		}
	}

	if (elementId) {
		inputSearch.removeExcludeItem(elementId);
	}

	$element.remove();
	$input.focus();
}

function onChange(result, element, options) {
	const $element = $(element);

	let value;

	if (result && result.attributes) {
		value = {
			id: result.attributes.id,
			name: result.attributes.name,
			showWarning: options.allowWarnings && showWarning(result)
		};
		inputSearch.addExcludeItem(value.id);
	} else if ($element && $element.val()) {
		value = {
			name: $element.val(),
			showWarning: options.allowWarnings
		};
	} else {
		return;
	}

	$element.before(getChildNode(value, $element.data('name')));
	createTooltip.call(
		$element
			.parent()
			.find('.multipleOptionsElement__warning')
			.last()
	);
	$element
		.parent()
		.find('.multipleOptionsElement__cross')
		.last()
		.on('click', options, onRemove);

	$element
		.parent()
		.find('.multipleOptions__element')
		.each((e, el) => {
			new QuickInfoCard({
				el,
				id: parseInt(el.getAttribute('data-id'), 10),
				type: 'person',
				source: 'activity_form',
				popoverProps: {
					placement: 'left'
				}
			});
		});

	$element.val('');
	$element.attr('size', inputSearch.options.defaultSize);
	$element.removeAttr('placeholder');
	$element.focus();
}

function showWarning(result) {
	return !_.get(result.get('email'), '[0].value');
}

function onFocus(element) {
	$(element)
		.parent()
		.addClass('multipleOptions--active');
}

function onBlur(element) {
	$(element)
		.parent()
		.removeClass('multipleOptions--active');
}

function onRemove(e) {
	const $element = $(e.target).closest('.multipleOptions__element');
	const elementId = $element.data('id');

	removeElement($element);

	if (_.isFunction(e.data.onRemove)) {
		e.data.onRemove(elementId);
	}
}

function onClear($input) {
	if ($input && _.isFunction($input.siblings)) {
		const elements = $input.siblings('.multipleOptions__element');

		_.each(elements, (el) => {
			removeElement($(el));
		});
	}
}

function onKeydown(e, defaultSize) {
	const $input = $(e.target);
	const key = e.keyCode || e.charCode;

	let valueLength = parseInt($input.attr('size'), 10);

	if (key === 8 || key === 46) {
		valueLength--;
	} else {
		valueLength++;
	}

	$input.attr('size', _.max([valueLength, defaultSize]));
}

function bindEvents(options) {
	const $element = $(`#${options.uuid}`);
	const $elementParent = $element.parent();

	$element.on('keydown', (e) => {
		onKeydown(e, options.defaultSize);
	});
	$elementParent.on('click', () => {
		$element.show();
		$element.focus();
	});
	$elementParent.find('.multipleOptionsElement__cross').on('click', options, onRemove);
	$elementParent.find('.multipleOptionsElement__warning').each(createTooltip);
	$elementParent.find('.multipleOptions__element').each((e, el) => {
		new QuickInfoCard({
			el,
			id: parseInt(el.getAttribute('data-id'), 10),
			type: 'person',
			source: 'activity_form',
			popoverProps: {
				placement: 'left'
			}
		});
	});
}

function createTooltip() {
	const $this = $(this);

	$this.tooltip({
		tip: _.gettext("This person doesn't have an e-mail address"),
		preDelay: 0,
		postDelay: 0,
		zIndex: 20000,
		fadeOutSpeed: 100,
		position: 'top'
	});
}

module.exports = function(opts) {
	const options = _.assignIn(
		{
			uuid: `mac-${_.makeid()}`,
			returnStringValue: false,
			loadCallback: `async_${_.makeid()}`,
			on: {
				change: function(result, element) {
					onChange(result, element, opts);

					if (_.isFunction(opts.onChange)) {
						opts.onChange(result, element);
					}
				},
				focus: onFocus,
				blur: function(element) {
					onBlur(element);
				},
				clear: function(element) {
					onClear(element);
					_.result(opts, 'onClear');
				}
			},
			exclude: _.reduce(
				opts.values,
				(excludedIds, value) => {
					excludedIds.push(value.id);

					return excludedIds;
				},
				[]
			),
			defaultSize: opts.placeholder ? opts.placeholder.length : opts.defaultSize
		},
		opts
	);

	options.field_type = 'varcharMultipleOptions';

	const settings = getSettings(options);

	createLoadCallback(options.loadCallback, () => {
		inputSearch = autocomplete.render(settings, options);
		bindEvents(options);
	});

	return template({ input: options });
};

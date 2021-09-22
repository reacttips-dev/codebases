const template = require('../template');
const _ = require('lodash');
const createLoadCallback = require('../create-load-callback');
const autocomplete = require('../autocomplete');

function getParams(options, cfg) {
	const params = {
		field_type: options.autocomplete_field_type,
		field_key: options.key,
		return_field_key: 'title',
		include_related_objects: options.include_related_objects
	};

	if (_.includes(['person', 'organization'], options.key)) {
		params.strict_mode = true;
	}

	return cfg && cfg.additional_parameters
		? _.assignIn(params, cfg.additional_parameters)
		: params;
}

function getFieldTypeDescription(config) {
	let description;

	if (config.typeDescription) {
		description = config.typeDescription;
	} else if (config.type === 'custom') {
		description = _.gettext('value');
	}

	return description;
}

function getSettings(options, opts, config, cfg) {
	const settings = {
		name: options.key,
		value: options.value,
		uuid: options.uuid ? options.uuid : options.key,
		data: _.assignIn({ type: config.type }, opts.data ? opts.data : {}),
		on: config.on,
		returnStringValue: options.returnStringValue,
		additional_parameters: getParams(options, cfg),
		exclude: config.exclude,
		typeDescription: getFieldTypeDescription(config),
		isFetching: options.isFetching
	};

	if (cfg && cfg.limit) {
		settings.limit = cfg.limit;
	}

	if (config.placeholder) {
		settings.placeholder = config.placeholder;
	}

	if (config.resultItemView) {
		settings.resultItemView = config.resultItemView;
	}

	if (options.prefillModel) {
		settings.prefillModel = options.prefillModel;
	}

	return settings;
}

module.exports = function(opts, cfg) {
	const options = _.assignIn(
		{
			clear: false,
			uuid: `ac-${_.makeid()}`,
			limit: 8,
			returnStringValue: false,
			loadCallback: `async_${_.makeid()}`
		},
		opts
	);

	options.field_type = 'autocomplete';

	const config = _.assignIn(
		{
			value: '',
			type: 'custom',
			on: {
				select: function() {},
				change: function() {},
				clear: function() {}
			}
		},
		cfg
	);
	const settings = getSettings(options, opts, config, cfg);

	if (config.type === 'global') {
		settings.minimumQueryLength = opts.minimumQueryLength || 3;
	}

	createLoadCallback(options.loadCallback, () => {
		autocomplete.render(settings, options);
	});

	return template({ input: options });
};

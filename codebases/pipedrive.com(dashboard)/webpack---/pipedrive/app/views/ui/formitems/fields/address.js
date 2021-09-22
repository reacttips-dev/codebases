const createLoadCallback = require('../create-load-callback');
const _ = require('lodash');
const autocomplete = require('../autocomplete');
const template = require('../template');
const $ = require('jquery');
const getExtendedConfig = function(cfg) {
	return _.assignIn(
		{
			value: '',
			type: 'address',
			on: {
				select: function() {},
				change: function() {},
				clear: function() {},
				geocoded: function(geocodeData, inputEl) {
					const geocodeDataEl = $(inputEl)
						.parent()
						.find('input[name="geocodeData"]');

					if (geocodeData && !_.isEmpty(geocodeDataEl)) {
						geocodeDataEl.data(geocodeData);
					}
				}
			}
		},
		cfg
	);
};
const getUUID = function(options) {
	return options.uuid ? options.uuid : options.key;
};
const getData = function(opts, config) {
	return _.assignIn({ type: config.type, noResultsMessage: null }, opts.data ? opts.data : {});
};
const hasParams = function(cfg) {
	return cfg && cfg.params;
};

module.exports = function(opts, cfg) {
	const options = _.assignIn(
		{
			clear: false,
			uuid: `ac-${_.makeid()}`,
			loadCallback: `async_${_.makeid()}`
		},
		opts
	);

	options.field_type = 'address';

	const config = getExtendedConfig(cfg);

	config.params = {
		return_field_key: 'title'
	};

	if (hasParams(cfg)) {
		config.params = _.assignIn(config.params, cfg.params);
	}

	const settings = {
		name: options.key,
		value: options.value,
		uuid: getUUID(options),
		data: getData(config, opts),
		on: config.on
	};

	settings.params = config.params;

	if (config.placeholder) {
		settings.placeholder = config.placeholder;
	}

	createLoadCallback(options.loadCallback, function createLoadCallbackForAddress() {
		autocomplete.renderAddress(settings);
	});

	const $content = $('<div>').html(template({ input: options }));

	$content.find('span.input input').before('<input type="hidden" name="geocodeData"/>');

	return $content.html();
};

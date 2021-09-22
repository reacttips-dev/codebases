const template = require('../template');
const _ = require('lodash');
const createLoadCallback = require('../create-load-callback');
const $ = require('jquery');
const getState = function(states, charsLeft) {
	let validState = null;
	let validStateLength;

	_.forEach(states, function(length, state) {
		if (charsLeft <= length && (!validStateLength || length < validStateLength)) {
			validState = state;
			validStateLength = length;
		}
	});

	return validState;
};

/**
 * Applies the character limit functionality.
 * characterLimit settings must have 'max' variable set for this to work.
 * Crewates a new element in the end of the input that will be filled with the amount of characters left.
 * Sets state classes  from characterLimit 'states' object.
 * Object must contains desired classes as keys and the amount of characters left from where the state is set.
 * Only the closest state is set.
 * Example:
 * {
 *   warning: 20,
 *   critical: 10
 * }
 * In this example the state warning will be applied when there are less than or equal to 20 characters available.
 * If the number of characters changes to 10 then the state critical will be applies.
 * On every change an event called 'characterLimitChange' will be fired on the input with data of characters left and state.
 *
 * @param {Object} cfg
 */

const bindCharacterLimit = function(cfg) {
	const $input = $(`#${cfg.uuid}`);
	const $characterLimit = $('<span class="characterLimit"></span>');
	const characterLimitSettings = cfg.characterLimit;

	$characterLimit.insertAfter($input);

	if (characterLimitSettings.max) {
		$input
			.on('input.form', function() {
				const length = $input.val().length;
				const left = characterLimitSettings.max - length;
				const eventData = {
					inputLength: length,
					overMax: left < 0
				};

				$characterLimit.html(left);
				$characterLimit.toggleClass('overMax', eventData.overMax);

				if (characterLimitSettings.states) {
					const validState = getState(characterLimitSettings.states, left);

					if (validState) {
						eventData.state = validState;
					}

					$characterLimit.attr('data-state', validState);
				}

				$input.trigger('characterLimitChange', eventData);
			})
			.trigger('input.form');
	}
};

module.exports = function(opts) {
	const options = _.assignIn(
		{
			field_type: 'text',
			uuid: `textarea-${_.makeid()}`
		},
		opts
	);

	if (opts.characterLimit) {
		options.loadCallback = `async_${_.makeid()}`;
		createLoadCallback(options.loadCallback, function() {
			bindCharacterLimit(options);
		});
	}

	return template({ input: options });
};

const $ = require('jquery');
const _ = require('lodash');
const createLoadCallback = require('../create-load-callback');
const Search = require('collections/autocomplete');
const template = require('../template');
const selectors = require('../select');
const tokenSeparators = [',', ';'];

function getInputSeparator(input) {
	input = $.trim(input);

	const separator = _.find(tokenSeparators, function(item) {
		if (_.includes(input, item)) {
			return item;
		}
	});

	return separator ? separator : false;
}

function getAddress(input) {
	input = $.trim(input);

	if (_.includes(input, '<') && _.includes(input, '>')) {
		const address = input.substring(input.lastIndexOf('<') + 1, input.lastIndexOf('>'));

		return address;
	}

	return input;
}

function getTokenText(input) {
	input = $.trim(input);

	if (_.includes(input, '<') && _.includes(input, '>')) {
		const address = getAddress(input);
		const name = $.trim(
			input.substring(0, input.lastIndexOf('<') - 1).replace(new RegExp('/"/', 'g'), '')
		);
		const text = name ? `${name} (${address})` : address;

		return text;
	}

	return input;
}

function createTokenObj(input) {
	input = $.trim(input);

	const address = getAddress(input);
	const text = getTokenText(input);

	return { id: address, text };
}

function initSelection(element, callback) {
	const emailArray = element.val().split(',');
	const data = _.map(emailArray, function(email) {
		return {
			id: email,
			text: email
		};
	});

	callback(data);
}

function isInSelection(email, oldSelection, currentSelection) {
	const isInOldSelection = _.isObject(
		_.find(oldSelection, function(obj) {
			return obj.id === email;
		})
	);
	const isInCurrentSelection = _.isObject(
		_.find(currentSelection, function(obj) {
			return obj.id === email;
		})
	);

	return isInOldSelection || isInCurrentSelection;
}

function tokenizer(input, oldSelection, callback) {
	const emailsFromInput = getEmailsFromInput(input);

	if (!emailsFromInput) {
		return;
	}

	let returnString = '';

	const currentSelection = [];

	_.forEach(emailsFromInput, function(item) {
		const address = getAddress(item);

		let tokenObj;

		// Tokenize if the address has email properties and is not already tokenized
		if (isInSelection(address, oldSelection, currentSelection)) {
			return;
		} else if (_.isEmail(address)) {
			tokenObj = createTokenObj(item);

			currentSelection.push(tokenObj);

			return callback(tokenObj);
		} else if (item) {
			returnString = item;
		}
	});

	return returnString;
}

function getEmailsFromInput(input) {
	const cleanedInput = input.replace(/.(\w+):/gi, '');
	const separator = getInputSeparator(cleanedInput);
	const emailArrayFromInput = emailsFromStringToArr(cleanedInput);

	let emailArray = [];
	let emailsToReturn = [];

	if (!separator && emailArrayFromInput.length <= 1) {
		return;
	}

	if (separator) {
		emailArray = cleanedInput.split(separator);
	} else {
		emailArray = emailArrayFromInput;
	}

	_.forEach(emailArray, function(email) {
		const emailsFromString = emailsFromStringToArr(email);

		if (emailsFromString.length > 1) {
			emailsToReturn = emailsToReturn.concat(emailsFromString);
		} else {
			emailsToReturn.push($.trim(email));
		}
	});

	return emailsToReturn;
}

function emailsFromStringToArr(input) {
	return input.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi) || [];
}

function formatNoMatches() {
	return '';
}

function getEmails(model) {
	const emails = [];
	const name = model.get('name');
	const email = model.get('email');

	// Fallback for non strict_mode=true responses
	if (_.isArray(email)) {
		_.forEach(email, function(addr) {
			if (addr.value) {
				emails.push({
					name,
					email: addr.value
				});
			}
		});
	} else {
		emails.push({
			name,
			email
		});
	}

	return emails;
}

function query(search, options, elUuid) {
	if (options.term.length < 2) {
		return;
	}

	const searchData = {
		term: options.term
	};
	const resultsData = {
		results: [],
		more: false
	};

	options.callback(resultsData);

	search.limitedPull({
		data: searchData,
		success: _.bind(
			onSearchQuerySuccess,
			null,
			options.callback,
			resultsData,
			options.term,
			elUuid
		)
	});
}

function onSearchQuerySuccess(callback, resultsData, searchTerm, elUuid, collection) {
	let exactEmailMatch = false;

	collection.each(function(model) {
		if (model.get('email')) {
			const emails = getEmails(model);

			_.forEach(emails, function(mail) {
				resultsData.results.push({
					id: mail.email,
					text: mail.name ? `${mail.name} (${mail.email})` : mail.email,
					personModel: model
				});

				if (mail.email === searchTerm) {
					exactEmailMatch = true;
				}
			});
		}
	});

	// avoid making union with the search term
	resultsData.results = _.unionBy(resultsData.results, function(result) {
		return result.personModel && result.id;
	});

	// if there is an exact match - remove the default search result
	// default result does not have personModel
	if (exactEmailMatch) {
		resultsData.results = _.filter(resultsData.results, function(result) {
			return result.personModel;
		});
	}

	// trigger custom event on search
	$(`#${elUuid}`).trigger({ type: 'select2:searchResults', resultsData });
	callback(resultsData);
}

function createSearchChoice(term, data) {
	if (
		$(data).filter(function() {
			return this.text.localeCompare(term) === 0;
		}).length === 0
	) {
		return createTokenObj(term);
	}
}

function initInlineLabel(options) {
	const $p = $(`#${options.uuid}`).siblings('.label:visible');

	if ($p.length) {
		$(`#${options.uuid}`)
			.siblings('.select2-container')
			.find('.select2-choices')
			.css({
				'padding-left': $p.outerWidth() + 10
			});
	} else {
		const $label = $(`#${options.uuid}`).siblings('.label');
		// Trigger 'show' to execute this

		$(`#${options.uuid}`).on('show.formitem', function() {
			$(this)
				.siblings('.select2-container')
				.find('.select2-choices')
				.css({
					'padding-left': $label.outerWidth() + 10
				});
		});
	}

	$(`#${options.uuid}`)
		.parent()
		.find('input[type=text]')
		.one('focus.formitem', function() {
			const $p = $(`#${options.uuid}`).siblings('.label:visible');

			if ($p.length) {
				$(this)
					.parents('.select2-choices')
					.css({
						'padding-left': $p.outerWidth() + 10
					});
			}
		});
}

function bindFormEvents(options) {
	$(`#${options.uuid}`)
		.on('change.form', function(ev) {
			$(this).trigger('change.select2');
			$(this).select2('enable', !$(this).prop('disabled'));

			if (_.isFunction(options.onChange) && ev) {
				options.onChange(ev);
			}
		})
		.on('reset.form', function() {
			$(this).val($('option[selected]', this).attr('value'));
			$(this).trigger('change.select2');
			$(this).select2('enable', !$(this).prop('disabled'));
		})
		.on('focus.form', function() {
			$(this).select2('focus');
		});
}

function initValue(options) {
	$(`#${options.uuid}`).select2(
		'data',
		_.map(options.value, function(o) {
			if (_.isString(o)) {
				return { id: o, text: o };
			} else {
				return {
					id: o.address,
					text: o.name ? `${o.name} (${o.address})` : o.address,
					valid: o.valid
				};
			}
		})
	);
}

function formatSelectionCssClass(data, selector) {
	selector.parent().attr('data-id', data.id);

	if (data.valid === false) {
		selector.parent().addClass('notValid');
	}

	return;
}

module.exports = function(opts) {
	const options = _.assignIn(
		{
			uuid: `emailPicker-${_.makeid()}`,
			loadCallback: `async_${_.makeid()}`,
			cannotBeEmpty: true
		},
		opts
	);

	options.field_type = 'emailPicker';
	const elUuid = options.uuid;

	createLoadCallback(options.loadCallback, function() {
		const search = new Search();

		search.type = 'person';

		selectors.render(options.uuid, {
			tags: [],
			tokenSeparators,
			selectOnBlur: true,
			minimumInputLength: 2,
			formatSelectionCssClass,
			dropdownCssClass: options.className,
			initSelection,
			tokenizer,
			formatNoMatches,
			formatSearching: null,
			createSearchChoice,
			query: function(options) {
				return query(search, options, elUuid);
			}
		});

		if (options.inlineLabel && !options.noPadding) {
			initInlineLabel(options);
		}

		bindFormEvents(options);

		if (options.value) {
			initValue(options);
		}
	});

	return template({ input: options });
};

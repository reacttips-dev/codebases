const Pipedrive = require('pipedrive');
const _ = require('lodash');

module.exports = Pipedrive.Model.extend({
	url: function() {
		return `${app.config.api}/${this.collectionType}s/summary`;
	},

	initialize: function(options) {
		this.collectionType = options.type;

		if (options.type === 'activity') {
			this.collectionType = 'activitie';
		}

		this.alphabet = {
			letters: []
		};

		this.on('sync', this.initAlphabet, this);
		this.on('update:alphabet', this.updateAlphabet, this);
	},

	pull: function() {
		if (this.pulling()) {
			this.lastFetchRequest.abort();
		}

		// eslint-disable-next-line prefer-rest-params
		return Pipedrive.Model.prototype.pull.apply(this, arguments);
	},

	initAlphabet: function() {
		if (_.isObject(this.additionalData) && _.isArray(this.additionalData.alphabet)) {
			const alphabet = this.additionalData.alphabet;

			if (this.alphabet.letters.join('') === alphabet.join('')) {
				return;
			}

			this.alphabet.letters = alphabet;
			this.trigger('alphabet:changed');
		}
	},

	updateAlphabet: function(model) {
		const name = model.get('name');
		const firstChar = name.charAt(0).toUpperCase();

		if (this.alphabet.letters.indexOf(firstChar) === -1) {
			this.alphabet.letters.push(firstChar);
			this.alphabet.letters.sort();
			this.trigger('alphabet:changed');
		}
	}
});

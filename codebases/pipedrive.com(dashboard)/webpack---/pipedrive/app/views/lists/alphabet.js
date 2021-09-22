'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const alphabetTemplate = require('templates/lists/alphabet.html');
const $ = require('jquery');
const alphabetAnalytics = require('utils/analytics/alphabet-analytics');
const componentLoader = require('webapp-component-loader');

module.exports = Pipedrive.View.extend(
	/** @lends views/lists/Alphabet.prototype */ {
		template: _.template(alphabetTemplate),
		lastDisplayedLetter: null,
		selectedLetter: 'all',
		/**
		 * This is alphabet view for organization and persons list view
		 *
		 * @class Alphabet view class
		 * @constructs
		 * @augments module:Pipedrive.View
		 *
		 * @param  {Object} options contains alphabet collection, to render alphabet
		 * @param {module:Pipedrive.Collection} options.alphabet required
		 * @void
		 */
		initialize: function(options) {
			this.options = options || {};
			this.listSettings = this.options.listSettings;
			this.summaryModel = this.listSettings.getSummary();
			this.alphabet = this.summaryModel.alphabet;

			this.summaryModel.on('alphabet:changed', this.render, this);
			this.listSettings.on('changed:first-letter', this.render, this);
			this.listSettings.on('reset:first-letter', this.resetFirstLetter, this);

			this.onWindow('resize.alphabetPopover', _.debounce(_.bind(this.render, this), 20));
		},

		selfRender: function() {
			this.$el.html(
				this.template({
					alphabet: this.alphabet.letters
				})
			);
			this.setActiveLetterClass();
			this.addPopoverClass();

			_.defer(_.bind(this.bindEvents, this));
		},

		bindEvents: function() {
			this.$('.letter')
				.off('click')
				.on('click', _.bind(this.setSelectedLetter, this));
			this.$('.alphabetPopover')
				.off('click')
				.on('click', _.bind(this.openPopover, this));
		},

		onAttachedToDOM: function() {
			this.addPopoverClass();

			this.bindEvents();
		},

		/**
		 * Find last shown element of alphabet
		 * @return {html} returns last letter of shown array
		 */
		getLastDisplayedLetter: function() {
			const letters = this.$('.letter');
			const containerWidth = this.$el.width();
			const MARGIN_LEFT = 2;

			let elementsWidth = 0;

			let lastElement = this.$('.letter:last');

			_.forEach(letters, (el) => {
				elementsWidth += $(el).outerWidth() + MARGIN_LEFT;

				if (elementsWidth > containerWidth) {
					return false;
				}

				lastElement = $(el);
			});

			return String(lastElement.data('letter'));
		},

		/**
		 * Adds popover class to last displayed letter in alphabet row
		 */
		addPopoverClass: function() {
			this.lastDisplayedLetter = this.getLastDisplayedLetter();

			const popoverLetters = this.getPopoverLetters();
			const popoverEl = this.$('.alphabetPopover');

			popoverEl
				.removeClass('alphabetPopover')
				.find('span')
				.text(popoverEl.data('letter'));

			if (!_.isEmpty(popoverLetters)) {
				this.$(`[data-letter="${_.escape(this.lastDisplayedLetter)}"]`).addClass(
					'alphabetPopover'
				);
				this.$('.alphabetPopover')
					.nextAll()
					.hide();
			}

			this.updateLastShownLetterText();
			this.setActiveLetterClass();
		},

		/**
		 * Will return letters that are hidden and shown in popover
		 * @return {array} letter models
		 */
		getPopoverLetters: function() {
			let popoverLetters = [];

			const lastDisplayedLetterPos = this.alphabet.letters.indexOf(this.lastDisplayedLetter);

			if (lastDisplayedLetterPos !== this.alphabet.letters.length - 1) {
				popoverLetters = _.slice(this.alphabet.letters, lastDisplayedLetterPos);
			}

			return popoverLetters;
		},

		openPopover: async function(ev) {
			const popover = await componentLoader.load('webapp:popover');

			popover.open({
				popover: 'alphabet',
				params: {
					position: 'bottom-end',
					target: ev.currentTarget,
					data: this.getPopoverLetters(),
					relatedView: this
				}
			});
		},

		/**
		 * Sets selected letter for alphabetic filtering
		 */
		setSelectedLetter: function(ev) {
			ev.preventDefault();

			if (!$(ev.delegateTarget).hasClass('alphabetPopover')) {
				const letter = _.unescape($(ev.delegateTarget).data('letter'));

				if (this.selectedLetter !== letter) {
					this.selectedLetter = letter;
					this.setActiveLetterClass();
					this.listSettings.setFirstLetter(this.selectedLetter);
				}

				alphabetAnalytics.trackAlphabetFilterApplied(letter, this.listSettings);
			}

			const popoverEl = this.$('.alphabetPopover');

			popoverEl.find('span').text(popoverEl.data('letter'));

			this.updateLastShownLetterText();
			app.global.fire('ui.popover.event.close');
		},

		updateLastShownLetterText: function() {
			if (
				_.indexOf(this.alphabet.letters, this.lastDisplayedLetter) <
				_.indexOf(this.alphabet.letters, this.selectedLetter)
			) {
				this.$('.alphabetPopover span').text(this.selectedLetter);
			}
		},

		resetFirstLetter: function() {
			this.selectedLetter = 'all';
			this.setActiveLetterClass();
			this.listSettings.setFirstLetter(this.selectedLetter);
		},

		/**
		 * Sets active class to selected letter. Does it in popover too, if letter exsists in popover.
		 */
		setActiveLetterClass: function() {
			const activeBtnClass = 'cui4-button--active';

			if (this.selectedLetter) {
				let escapedLetter;

				const popoverLetters = this.getPopoverLetters();

				this.$('.letter').removeClass(activeBtnClass);

				if (this.selectedLetter === '\\') {
					escapedLetter = `\\${this.selectedLetter}`;
				} else {
					escapedLetter = _.escape(this.selectedLetter);
				}

				const btnSelector = `button[data-letter="${escapedLetter}"]`;

				if (_.indexOf(popoverLetters, this.selectedLetter) === -1) {
					this.$(btnSelector).addClass(activeBtnClass);
				} else {
					if (this.selectedLetter === this.getLastDisplayedLetter()) {
						this.$(btnSelector).addClass(activeBtnClass);
					}

					this.$('.alphabetPopover').addClass(activeBtnClass);
					$(`.popoverAlphabet ${btnSelector}`).addClass(activeBtnClass);
				}
			}
		}
	}
);

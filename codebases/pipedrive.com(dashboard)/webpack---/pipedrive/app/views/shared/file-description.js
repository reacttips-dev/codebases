'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('templates/shared/file-description.html');

/**
 * @classdesc
 * Modal view to show file description edit view.
 *
 * @class views/shared/FileDescription
 * @augments module:Pipedrive.View
 */

module.exports = Pipedrive.View.extend(
	/** @lends views/shared/FileDescription.prototype */ {
		template: _.template(template),

		/**
		 * Default options.
		 * maxCharacterLimit defines how long the file description can be.
		 * @type {Object}
		 */
		defaultOptions: {
			maxCharacterLimit: 140
		},

		initialize: function(options) {
			this.options = _.assignIn({}, this.defaultOptions, options);
			this.model = options.model;

			if (!this.model) {
				throw new Pipedrive.ViewException('No model set');
			}
		},

		templateHelpers: function() {
			const templateHelpers = {
				model: this.model,
				maxCharacterLimit: this.options.maxCharacterLimit
			};

			return templateHelpers;
		},

		/**
		 * Saves the file description from view.
		 */
		save: function() {
			if (!this.canSave()) {
				return;
			}

			const $input = this.$('textarea[name="description"]');

			let description = $input.val();

			if (!description) {
				description = '';
			}

			this.model.save(
				{
					description
				},
				{
					silent: true,
					success: _.bind(function() {
						this.trigger('save');
					}, this)
				}
			);
		},

		/**
		 * Determines if the file description can be saved.
		 * Depends on description length and maxCharacterLimit
		 * @return {boolean}
		 */
		canSave: function() {
			const $input = this.$('textarea[name="description"]');
			const length = $input.length;

			return length <= this.options.maxCharacterLimit;
		},

		/**
		 * Resets the description in HTML
		 */
		resetDescription: function() {
			const $input = this.$('textarea[name="description"]');

			$input.val('').trigger('change');
		}
	}
);

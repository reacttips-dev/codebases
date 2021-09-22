const Field = require('../field');
const _ = require('lodash');
const $ = require('jquery');

module.exports = Field.extend({
	type: 'varcharMultipleOptions',

	getReadValue: function() {
		let values = [];

		if (this.hasValue()) {
			const sortedValues = this.getSortedValues();

			values = _.map(
				sortedValues,
				_.bind(function(participant) {
					const personId = participant.person_id;
					const model = this.contentModel.getRelatedModel('person', personId);
					const personName = model ? model.get('name') : '(hidden)';

					return {
						value: personName,
						link: model ? model.getLink() : ''
					};
				}, this)
			);
		}

		return {
			values
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		let values = [];

		if (this.hasValue()) {
			const sortedValues = this.getSortedValues();

			values = _.map(
				sortedValues,
				_.bind(function(participant) {
					const personId = participant.person_id;
					const model = this.contentModel.getCachedRelatedModel('person', personId);
					const personName = model ? model.get('name') : '(hidden)';

					return {
						id: personId,
						name: personName
					};
				}, this)
			);
		}

		return {
			values,
			wrapClassName: 'hasIcon person multipleOptions',
			iconClass: 'sm-person',
			defaultSize: 5,
			data: {
				type: 'person'
			}
		};
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const inputValues = [];
		const self = this;

		$el.find('input[type="hidden"]').each(function(i) {
			const $input = $(this);
			const value = $input.val();

			if (value) {
				const nameParts = $input.attr('name').split('_');
				const idPart = nameParts[2];
				const id = parseInt(idPart, 10);
				const isNew = isNaN(idPart);
				const participantInfo = {
					person_id: isNew ? idPart : id,
					primary_flag: i === 0
				};

				if (
					!isNaN(idPart) &&
					_.isNil(self.contentModel.getCachedRelatedModel('person', id))
				) {
					self.contentModel.setRelatedData('person', id, {
						id,
						name: value
					});
				}

				if (isNew) {
					participantInfo.person_id_helper = value;
					participantInfo.person_temp_id = idPart;
				}

				inputValues.push(participantInfo);
			}
		});

		value[this.key] = _.isEmpty(inputValues) ? null : inputValues;

		return value;
	},

	getSortedValues: function() {
		return _.orderBy(this.value, ['primary_flag'], ['desc']);
	}
});

'use strict';

const FieldView = require('views/shared/fields/field');
const _ = require('lodash');
const EmptyFieldTemplate = require('templates/shared/fields/empty-field.html');
const CustomNameFieldTemplate = require('templates/shared/table-custom-name-field.html');

module.exports = FieldView.extend({
	getTemplate: function(data) {
		let template;

		if (this.isEmptyField()) {
			template = _.template(EmptyFieldTemplate)(data);
		} else if (
			this.state === this.states.READ &&
			this.isNameField() &&
			this.model.isRecentlyCreated()
		) {
			template = _.template(CustomNameFieldTemplate)(data);
		} else {
			template = FieldView.prototype.getTemplate.call(this, data);
		}

		return template;
	},

	isNameField: function() {
		return _.includes(['name', 'title', 'subject'], this.key);
	},

	isEmptyField: function() {
		return !this.hasValue() && !this.settings.editable && !this.field.parent;
	}
});

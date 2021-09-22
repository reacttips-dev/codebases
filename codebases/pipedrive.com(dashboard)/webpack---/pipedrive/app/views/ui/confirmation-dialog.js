'use strict';

const Pipedrive = require('pipedrive');
const _ = require('lodash');
const template = require('templates/confirmation-dialog.html');

module.exports = Pipedrive.View.extend({
	template: _.template(template),

	events: {
		'click .confirmationDialog .cui4-dialog__backdrop': 'close',
		'click .confirmationDialog .primaryButton': 'onPrimaryButtonClick',
		'click .confirmationDialog .secondaryButton': 'onSecondaryButtonClick'
	},

	initialize: function(options) {
		this.options = options || {};
		this.primaryButtonAction = options.primaryButton.onClick;
		this.secondaryButtonAction = options.secondaryButton.onClick;
	},

	templateHelpers: function() {
		return {
			title: this.options.title,
			message: this.options.message,
			primaryButton: {
				title: this.options.primaryButton.title,
				color: this.options.primaryButton.color
			},
			secondaryButton: {
				title: this.options.secondaryButton.title,
				color: this.options.secondaryButton.color
			}
		};
	},

	render: function() {
		const templateHelpers = this.templateHelpers();

		if (_.isObject(templateHelpers)) {
			this.$el.append(this.template(templateHelpers));
			this.$el.find('.secondaryButton').focus();
		}
	},

	close: function() {
		this.$el.find('.confirmationDialog').remove();
		this.undelegateEvents();
	},

	onPrimaryButtonClick: function() {
		if (this.primaryButtonAction) {
			this.primaryButtonAction();
		}

		this.close();
	},

	onSecondaryButtonClick: function() {
		if (this.secondaryButtonAction) {
			this.secondaryButtonAction();
		}

		this.close();
	}
});

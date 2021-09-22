const Field = require('../field');
const _ = require('lodash');
const User = require('models/user');
const Company = require('collections/company');
const Template = require('../../templates/field.html');

module.exports = Field.extend({
	type: 'user',

	template: _.template(Template),

	/**
	 * Get value for read mode
	 * @return {Object} Value object
	 */
	getReadValue: function() {
		const showUserLink =
			User.settings.get('can_see_other_users') &&
			User.settings.get('can_see_other_users_statistics') &&
			this.value > 0;
		const name = this.getCompanyUserName(this.value);

		return {
			label: name,
			link: showUserLink ? `/users/details/${this.value}` : null
		};
	},

	/**
	 * Get value for edit or edit_bulk mode
	 * @return {Object} Value object
	 */
	getEditValue: function() {
		const value = {
			user: this.value
		};

		if (this.key !== 'owner_id' && !this.model.get('mandatory_flag')) {
			value.allowClear = true;
		}

		return value;
	},

	/**
	 * Get value(s) from editor in edit or edit_bulk mode
	 * @param {Object} $el jQuery element where data should be obtained
	 * @return {Object} Values from editor including subfields if there are any
	 */
	getValueFromEditor: function($el) {
		const value = {};
		const selectedValue = Number($el.find('select').val());

		value[this.key] = selectedValue > 0 ? selectedValue : null;

		return value;
	},

	/**
	 * Find user name from company list
	 * @param  {Integer} userId id of the user whose name we want
	 * @return {String}         name of the user
	 */
	getCompanyUserName: function(userId) {
		const userModel = Company.find(function(companyUser) {
			return companyUser.get('id') === userId;
		});

		return userModel ? userModel.get('name') : _.gettext('Hidden');
	}
});

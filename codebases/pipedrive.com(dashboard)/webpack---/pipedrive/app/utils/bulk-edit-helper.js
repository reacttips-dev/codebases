const CustomFieldHelper = require('models/customfieldhelper');
const _ = require('lodash');

/**
 * @classdesc
 * Bulk edit helper model.
 *
 * @description
 * Bulk edit helper to overwrite CustomFieldHelper's updateModelContact method
 *
 * @class utils/BulkEditHelper
 * @augments models/CustomFieldHelper
 */

module.exports = _.assignIn({}, CustomFieldHelper, {
	/**
	 * Sets new contact id to models data attribute and adds relataedData
	 * @param  {object} args
	 * @param  {string} key
	 * @param  {string} field_type
	 * @param  {object} contact
	 * @void
	 */
	updateModelContact: function(args, key, fieldType, contact) {
		this.changed.data[key] = contact.get('id');

		if (!_.isObject(this.changed.relatedData)) {
			this.changed.relatedData = {};
		}

		this.changed.relatedData[fieldType] = contact;
	}
});

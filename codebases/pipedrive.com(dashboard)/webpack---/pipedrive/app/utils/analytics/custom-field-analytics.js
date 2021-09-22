const PDMetrics = require('utils/pd-metrics');

module.exports = {
	trackCustomFieldCreated: (objectType, field) => {
		PDMetrics.trackUsage(null, 'custom_field', 'created', {
			object_type: objectType,
			field_type: field.field_type,
			options_count: field.options ? field.options.length : null
		});
	},

	trackCustomFieldEdited: (fieldBeforeUpdate, fieldAfterUpdate) => {
		PDMetrics.trackUsage(null, 'custom_field', 'edited', {
			object_type: fieldBeforeUpdate.item_type,
			field_type: fieldBeforeUpdate.field_type,
			name_edited: fieldBeforeUpdate.name !== fieldAfterUpdate.name
		});
	},

	trackCustomFieldDeleted: (field) => {
		PDMetrics.trackUsage(null, 'custom_field', 'deleted', {
			object_type: field.item_type,
			field_type: field.field_type,
			options_count: field.options ? field.options.length : null
		});
	}
};

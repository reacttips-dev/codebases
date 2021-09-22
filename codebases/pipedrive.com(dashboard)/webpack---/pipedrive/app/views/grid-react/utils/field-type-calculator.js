const CUSTOM_FIELD_TYPES = {
	// Activity due_date is treated as composite date-time field (due_date + due_time)
	'activity:due_date': 'compositeDateTime',
	// Activity subject is treated as composite type-subject field (type + subject)
	'activity:subject': 'compositeTypeSubject',
	'activity:duration': 'duration',
	'activity:done': 'activityDone',
	'activity:note': 'activityNote',
	'deal:next_activity_date': 'compositeDate',
	'deal:last_activity_date': 'compositeDate',
	'person:next_activity_date': 'compositeDate',
	'person:last_activity_date': 'compositeDate',
	'organization:next_activity_date': 'compositeDate',
	'organization:last_activity_date': 'compositeDate'
};
const ID_DEPENDENT_FIELDS = [
	'person',
	'organization',
	'deal',
	'varchar',
	'address',
	'phone',
	'lead'
];
const SUB_FIELDS_DEPENDENT_FIELDS = ['monetary', 'daterange', 'timerange'];

exports.isIdDependentField = (fieldType) => {
	return ID_DEPENDENT_FIELDS.indexOf(fieldType) !== -1;
};

exports.isSubFieldDependentField = (fieldType) => {
	return SUB_FIELDS_DEPENDENT_FIELDS.indexOf(fieldType) !== -1;
};

exports.detectFieldType = ({ model, field }) => {
	model = model || {};
	field = field || {};

	// Custom field 'phone' is set to 'varchar' in user-fields.js, which is not needed here
	if (field.phoneCustomField) {
		return 'phone';
	}

	const fieldType = field.field_type;
	const customFieldType = CUSTOM_FIELD_TYPES[`${model.type}:${field.key}`];

	return customFieldType || fieldType;
};

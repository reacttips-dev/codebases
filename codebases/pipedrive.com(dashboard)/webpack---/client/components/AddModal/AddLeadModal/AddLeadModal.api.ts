import moment from 'moment';
import { Field, FieldsByType, LeadCreate, LeadCustomFields } from 'Types/types';

import { getLeadSupportedFieldTypeInLeads, LeadCustomFieldType } from './AddLeadModal.utils';

// eslint-disable-next-line complexity
const generateLeadCustomFieldDataObject = (
	type: LeadCustomFieldType,
	field: Field,
	fieldValue: any,
	fieldsData: any,
) => {
	let data;

	// we are sending varchar as unknown on purpose as some fields like phone
	// are defined in a inconsistent way in leadbox-service when compared to deal fields
	if (type === LeadCustomFieldType.unknown || type === LeadCustomFieldType.varchar) {
		data = { value: fieldValue };
	} else if (type === LeadCustomFieldType.enum) {
		data = parseInt(fieldValue.toString(), 10);
	} else if (type === LeadCustomFieldType.double) {
		data = parseFloat(fieldValue.toString());
	} else if (type === LeadCustomFieldType.set) {
		data = fieldValue
			.toString()
			.split(',')
			.map((v) => parseInt(v, 10));
	} else if (type === LeadCustomFieldType.monetary) {
		data = {
			value: parseInt(fieldValue, 10),
			currency: fieldsData[`${field.key}_currency`],
		};
	} else if (type === LeadCustomFieldType.timerange) {
		const additionalField = fieldsData[`${field.key}_until`];

		data = {
			value: fieldValue ? moment(fieldValue, ['h:mm', 'h:mm A']).format('HH:mm:ss') : null,
			additionalValues: {
				until:
					additionalField !== null && additionalField !== undefined
						? moment(additionalField, ['h:mm', 'h:mm A']).format('HH:mm:ss')
						: null,
			},
		};
	} else if (type === LeadCustomFieldType.daterange) {
		const additionalField = fieldsData[`${field.key}_until`];

		data = {
			value: fieldValue,
			additionalValues: {
				until: additionalField !== null && additionalField !== undefined ? additionalField : null,
			},
		};
	} else if (type === LeadCustomFieldType.time) {
		data = {
			value: moment(fieldValue, ['h:mm', 'h:mm A']).format('HH:mm:ss'),
		};
	} else if (
		type === LeadCustomFieldType.user ||
		type === LeadCustomFieldType.person ||
		type === LeadCustomFieldType.organization
	) {
		data = {
			value: parseInt(fieldValue.toString(), 10),
		};
	} else {
		data = fieldValue;
	}

	return data;
};

const valueExists = (value: any) => value !== null && value !== undefined && !Number.isNaN(value);

export const transformLeadData = (data: any, fields?: FieldsByType): LeadCreate => {
	const {
		related_org_id,
		related_person_id,
		owner_id,
		deal_value,
		deal_value_currency,
		labels,
		title,
		source,
		source_reference_id,
		visible_to,
	} = data;
	const customFields: LeadCustomFields = {};
	const leadFields = fields?.lead.allFields;

	const transformedData: LeadCreate = {
		title,
		source: source || 'Manually created',
		sourceReferenceId: source_reference_id,
		relatedOrganizationId: related_org_id,
		relatedPersonId: related_person_id,
		ownerId: owner_id,
		labelIds: labels,
		visibleTo: String(visible_to),
	};

	Object.entries(data).forEach(([key, fieldValue]) => {
		const leadField = leadFields?.find((f) => f.key === key);

		if (!leadField) {
			return;
		}

		if (!leadField.edit_flag || leadField.is_subfield) {
			return;
		}

		const type: LeadCustomFieldType = Object.values(LeadCustomFieldType).includes(
			leadField.field_type as LeadCustomFieldType,
		)
			? (leadField.field_type as LeadCustomFieldType)
			: LeadCustomFieldType.unknown;
		const formattedData = generateLeadCustomFieldDataObject(type, leadField, fieldValue, data);

		if (valueExists(formattedData)) {
			customFields[key] = {
				type: getLeadSupportedFieldTypeInLeads(type),
				data: formattedData,
			};
		}
	});

	if (deal_value && deal_value_currency) {
		transformedData.dealValue = {
			value: parseInt(deal_value, 10),
			currency: deal_value_currency,
		};
	}

	if (Object.keys(customFields).length > 0) {
		transformedData.deal = customFields;
	}

	return transformedData;
};

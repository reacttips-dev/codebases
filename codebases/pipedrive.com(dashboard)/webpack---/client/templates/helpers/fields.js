import moment from 'moment';
import { get } from 'lodash';

import { getFirstRecipient } from './field-picker';
import { format } from '../../shared/helpers/formatter';

export const isCustomField = (key) => {
	return key && !!key.match(/^[a-zA-Z0-9]{40}$/);
};

// eslint-disable-next-line complexity
export const getForceUpdateTypes = (changedModel, person, organization, linkedDeal, linkedLead) => {
	const { linked_person_id: linkedPersonId } = getFirstRecipient(changedModel);
	const isDraft = changedModel.type === 'mailDraft';
	const forceUpdate = {};

	if (isDraft) {
		forceUpdate.person =
			(!linkedPersonId && person.data.id) ||
			(linkedPersonId && linkedPersonId !== person.data.id);

		// as we do person and org requests separately, we need to check if we show correct org data
		forceUpdate.organization =
			person.data?.org_id &&
			organization.data?.id &&
			person.data?.org_id !== organization.data?.id;
	} else {
		const changedModelDealId = changedModel.get('deal_id');
		const changedModelLeadId = changedModel.get('lead_id');

		forceUpdate.deal = !changedModelDealId || changedModelDealId !== linkedDeal.data.id;
		forceUpdate.lead = !changedModelLeadId || changedModelLeadId !== linkedLead.id;

		// if no linked entity nor recipient, then force update the person and org fields
		const isUpdatePersonOrgData = (forceUpdate.deal || forceUpdate.lead) && !linkedPersonId;

		forceUpdate.person = isUpdatePersonOrgData;
		forceUpdate.organization = isUpdatePersonOrgData;
	}

	return forceUpdate;
};

export const getFilteredFields = (fields, type, recents) => {
	const isRecents = type === 'recents';

	let filteredDefaultFields = [];

	if (type === 'search') {
		return {
			default: fields,
			custom: []
		};
	}

	if (isRecents) {
		recents.forEach((recent) => {
			const foundField = fields.find((field) => {
				const string = `${field.type}_${field.data_key}`;

				return string === recent;
			});

			foundField && filteredDefaultFields.push(foundField);
		});
	} else {
		filteredDefaultFields = fields.filter((field) => {
			const placeholderField = type === 'user' && field.type === 'placeholder';

			return (field.type === type || placeholderField) && !field.custom_field;
		});
	}

	const filteredCustomFields = fields.filter(
		(field) => field.type === type && field.custom_field
	);

	return {
		default: filteredDefaultFields,
		custom: filteredCustomFields
	};
};

export const getOptionFieldFormattedValue = (options, value) => {
	const ids = value.toString().split(',');

	const string = ids
		.reduce((labels, id) => {
			const option = options.find((opt) => opt.id === Number(id));

			if (option) {
				labels.push(option.label);
			}

			return labels;
		}, [])
		.join(', ');

	return string;
};

export const getRelatedObjectValue = (value, type, relatedObjects) => {
	const object = relatedObjects[type];

	return object[Number(value)].name;
};

export const getMonetaryValue = (data, key, userSelf) => {
	const currency = data[`${key}_currency`];

	return format(data[key], currency, userSelf);
};

export const getTimeValue = (data, field) => {
	const key = field.key;
	const from = data[key];
	const format = 'h:mm:ss';

	if (field.field_type === 'timerange') {
		const until = data[`${key}_until`];

		return `${moment(from, format).format('LT')} – ${moment(until, format).format('LT')}`;
	} else {
		return moment(from, format).format('LT');
	}
};

export const getDateValue = (data, field) => {
	const key = field.key;
	const from = data[key];
	const format = 'YYYY-MM-DD';

	if (field.field_type === 'daterange') {
		const until = data[`${key}_until`];

		return `${moment(from, format).format('ll')} – ${moment(until, format).format('ll')}`;
	} else {
		return moment(from, format).format('ll');
	}
};

export const getCustomFields = (fields) => {
	const fieldsData = [];

	fields.forEach((field) => {
		if (field.edit_flag && field.name) {
			fieldsData.push({
				title: field.name,
				data_key: field.key,
				type: field.item_type,
				custom_field: true,
				phoneCustomField: field.phoneCustomField
			});
		}
	});

	return fieldsData;
};

export const getFieldTitle = (fields, key) => {
	return get(
		fields.find((field) => field.key === key),
		'name',
		key
	);
};

export const getPersonFields = (translator, userSelf) => {
	const personFields = userSelf.fields.get('person');
	const customFields = getCustomFields(personFields);
	const defaultFields = [
		{
			title: translator.gettext('Full Name'),
			data_key: 'name',
			type: 'person'
		},
		{
			title: translator.gettext('First Name'),
			data_key: 'first_name',
			type: 'person'
		},
		{
			title: translator.gettext('Last Name'),
			data_key: 'last_name',
			type: 'person'
		},
		{
			title: getFieldTitle(personFields, 'owner_id'),
			data_key: 'owner_name',
			type: 'person'
		},
		{
			title: getFieldTitle(personFields, 'org_id'),
			data_key: 'org_name',
			type: 'person'
		},
		{
			title: getFieldTitle(personFields, 'email'),
			data_key: 'email',
			type: 'person'
		},
		{
			title: getFieldTitle(personFields, 'phone'),
			data_key: 'phone',
			type: 'person'
		}
	];

	return defaultFields.concat(customFields);
};

export const getOrgFields = (translator, userSelf) => {
	const organizationFields = userSelf.fields.get('organization');
	const customFields = getCustomFields(organizationFields);
	const defaultFields = [
		{
			title: getFieldTitle(organizationFields, 'name'),
			data_key: 'name',
			type: 'organization'
		},
		{
			title: getFieldTitle(organizationFields, 'owner_id'),
			data_key: 'owner_name',
			type: 'organization'
		},
		{
			title: getFieldTitle(organizationFields, 'address'),
			data_key: 'address',
			type: 'organization'
		}
	];

	return defaultFields.concat(customFields);
};

export const getDealFields = (translator, userSelf) => {
	const dealFields = userSelf.fields.get('deal');
	const customFields = getCustomFields(dealFields);
	const defaultFields = [
		{
			title: getFieldTitle(dealFields, 'title'),
			data_key: 'title',
			type: 'deal'
		},
		{
			title: getFieldTitle(dealFields, 'user_id'),
			data_key: 'owner_name',
			type: 'deal'
		},
		{
			title: getFieldTitle(dealFields, 'org_id'),
			data_key: 'org_name',
			type: 'deal'
		},
		{
			title: getFieldTitle(dealFields, 'value'),
			data_key: 'formatted_value',
			type: 'deal'
		},
		{
			title: getFieldTitle(dealFields, 'person_id'),
			data_key: 'person_name',
			type: 'deal'
		},
		{
			title: getFieldTitle(dealFields, 'pipeline_id'),
			data_key: 'pipeline',
			type: 'deal'
		},
		{
			title: getFieldTitle(dealFields, 'stage_id'),
			data_key: 'stage',
			type: 'deal'
		}
	];

	return defaultFields.concat(customFields);
};

export const getLeadFields = (userSelf) => {
	const leadFields = userSelf.fields.get('lead');
	const customFields = getCustomFields(leadFields);
	const defaultFields = [
		{
			title: getFieldTitle(leadFields, 'title'),
			data_key: 'title',
			type: 'lead'
		},
		{
			title: getFieldTitle(leadFields, 'owner_id'),
			data_key: 'owner_name',
			type: 'lead'
		},
		{
			title: getFieldTitle(leadFields, 'org_name'),
			data_key: 'org_name',
			type: 'lead'
		},
		{
			title: getFieldTitle(leadFields, 'deal_value'),
			data_key: 'formatted_value',
			type: 'lead'
		},
		{
			title: getFieldTitle(leadFields, 'person_name'),
			data_key: 'person_name',
			type: 'lead'
		}
	];

	return defaultFields.concat(customFields);
};

export const getOtherFields = (translator) => {
	return [
		{
			title: translator.gettext('Placeholder'),
			type: 'placeholder'
		},
		{
			title: translator.gettext('Sender name'),
			data_key: 'user_name',
			type: 'user',
			iconSize: 'l'
		},
		{
			title: translator.gettext('Sender email'),
			data_key: 'user_email',
			type: 'user',
			iconSize: 'l'
		},
		{
			title: translator.gettext('Company name'),
			data_key: 'company_name',
			type: 'user',
			iconSize: 'l'
		}
	];
};

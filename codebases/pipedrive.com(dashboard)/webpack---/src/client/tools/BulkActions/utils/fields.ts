import moment from 'moment';
import { useDataMapping } from '@pipedrive/form-fields';

function getLocaleDate(date, locale) {
	return moment(date).locale(locale).format('L');
}

// eslint-disable-next-line complexity
export function getFieldValue(key, value: any, extraData) {
	const field = extraData.fields.find((f) => f.key === key);

	if (field?.options?.length && field?.type !== 'set') {
		const selectedOption = field.options.find((opt, index) => {
			const selectedValue = value?.[index]?.id || value;

			return opt.id === selectedValue;
		});

		if (selectedOption) {
			return selectedOption.label;
		}
	}

	switch (field.type) {
		case 'user':
		case 'person':
		case 'organization':
		case 'participants':
			return value.name || value;

		case 'deal':
			return value.title;

		case 'set':
			return value.map((item) => item.label)?.join(', ');
		case 'address':
			return value.description;

		case 'stage': {
			const stageId = value.stage_id?.value;

			return extraData.stages.find((stage) => stage.id === stageId)?.name;
		}
		case 'monetary':
			return `${value.value} ${value.label}`;

		case 'enum':
			return value.label;

		case 'email':
		case 'phone':
			return value.map((item) => `${item.value} (${item.label})`).join(', ');

		case 'timerange':
			return `${value.startTime} - ${value.endTime}`;

		case 'date':
			return getLocaleDate(value, extraData.locale);

		case 'daterange': {
			const startDate = getLocaleDate(value.startDate, extraData.locale);
			const endDate = getLocaleDate(value.endDate, extraData.locale);

			return `${startDate} - ${endDate}`;
		}

		default:
			return value;
	}
}

export function getUserFieldsByType(fields, type) {
	return fields.attributes[type]
		.filter((field) => !!field.bulk_edit_allowed)
		.map((field) => ({
			id: field.id,
			key: field.key,
			isMandatory: field.mandatory_flag,
			type: field.field_type,
			isBoolean: field.options?.every((option) => typeof option.id === 'boolean'),
			options: (field.options || []).map(({ id, label, color }) => ({
				id,
				label,
				color,
			})),
			name: field.label || field.name || field.title || field.description,
			orderNr: field.ord,
		}));
}

function convertDateTimeToUTC(formData: any) {
	if (!formData?.due_time) {
		return formData;
	}

	const newFormData = { ...formData };
	const dateFormat = 'YYYY-MM-DD';
	const today = moment().format(dateFormat);
	const utcMoment = moment.utc(moment(`${formData?.due_date || today} ${formData.due_time}`, 'YYYY-MM-DD LT'));
	const utcDate = utcMoment.format(dateFormat);
	const utcTime = utcMoment.format('HH:mm');

	newFormData.due_time = utcTime;

	if (formData.due_date) {
		newFormData.due_date = utcDate;
	}

	return newFormData;
}

export function composePostData(formState: Record<string, any>, fields) {
	const mappedData = Object.entries(formState).reduce((postData, [key, value]) => {
		if (value === null) {
			postData[key] = null;

			return postData;
		}

		const field = fields.find((f) => f.key === key);

		if (field.type === 'stage') {
			postData[key] = value?.stage_id?.value;

			return postData;
		}

		const mappedFieldValue = useDataMapping(key, value, field.type);

		return Object.assign(postData, mappedFieldValue);
	}, {});

	return convertDateTimeToUTC(mappedData);
}

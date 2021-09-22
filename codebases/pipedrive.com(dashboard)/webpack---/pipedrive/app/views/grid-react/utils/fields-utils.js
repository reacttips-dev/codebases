const _ = require('lodash');
const moment = require('moment');
const FieldModel = require('models/field');
const DateTimeFormatHelper = require('utils/datetime-format-helpers');
const getDisplayLabel = require('../../ui/typeLabels').getDisplayLabel;
const RELATED_FIELD_ATTRIBUTE_BY_KEY = {
	org_id: 'name',
	person_id: 'name',
	deal_id: 'title',
	lead_id: 'title'
};
const BASIC_RELATED_FIELD_TYPES = {
	org_id: 'organization',
	person_id: 'person',
	deal_id: 'deal',
	lead_id: 'lead'
};
const RELATED_FIELD_ATTRIBUTE_BY_TYPE = {
	person: RELATED_FIELD_ATTRIBUTE_BY_KEY.person_id,
	organization: RELATED_FIELD_ATTRIBUTE_BY_KEY.org_id,
	deal: RELATED_FIELD_ATTRIBUTE_BY_KEY.deal_id,
	lead: RELATED_FIELD_ATTRIBUTE_BY_KEY.lead_id
};
const NAME_FIELD_MAP = {
	lead: 'title',
	deal: 'title',
	person: 'name',
	organization: 'name',
	activity: 'subject',
	product: 'name'
};
const FieldWrapperUtils = {
	getSubFieldKey(field) {
		return field && field.subfields && field.subfields[0] && field.subfields[0].key;
	},

	formatDate(fieldValue, fieldKey, hasTime) {
		let date;

		if (_.includes(FieldModel.dateTimeFields, fieldKey) || hasTime) {
			date = moment.utc(fieldValue, DateTimeFormatHelper.UTC_DATE_TIME_FORMAT).local();
		} else {
			date = moment(fieldValue, DateTimeFormatHelper.UTC_DATE_FORMAT);
		}

		const dateFormat = _.includes(FieldModel.timeFormattedDateTimeFields, fieldKey)
			? 'lll'
			: 'll';

		return date.isValid() ? date.format(dateFormat) : '';
	},

	formatTime(fieldValue, format = 'LT') {
		const time = moment(fieldValue, DateTimeFormatHelper.UTC_TIME_FORMAT);

		return time.isValid() ? time.format(format) : '';
	},

	formatDuration(fieldValue) {
		const duration = moment.duration(fieldValue);
		const hourValue = parseInt(duration.asHours(), 10);
		const minuteValue = duration.minutes();
		const hours = hourValue < 10 ? moment(hourValue, 'HH').format('HH') : hourValue;
		const minutes = moment(minuteValue, 'mm').format('mm');

		return hourValue || minuteValue ? `${hours}:${minutes}` : '';
	},

	getFormattedRangeValue(value, subValue) {
		if (value || subValue) {
			return `${value || '…'} - ${subValue || '…'}`;
		}

		return '';
	},

	formatValueLabel(field, label) {
		return _.isEmpty(label) ? '' : `(${getDisplayLabel(field, label)})`;
	},

	getRelatedModelDisplayAttribute(field) {
		const { key, field_type: fieldType } = field;

		return RELATED_FIELD_ATTRIBUTE_BY_KEY[key] || RELATED_FIELD_ATTRIBUTE_BY_TYPE[fieldType];
	},

	getRelatedIds(model, relatedModel) {
		const relatedIds = _.assignIn({}, model.getRelatedBy());

		if (relatedModel && _.isFunction(relatedModel.getRelatedBy)) {
			_.assignIn(relatedIds, relatedModel.getRelatedBy());
		}

		// Priority: current model primary attribute, if null then context model attribute, if null
		// then current model non-primary attribute
		_.forEach(['deal_id', 'person_id', 'org_id'], (attribute) => {
			if (!_.has(relatedIds, attribute)) {
				const valueInContextModel = relatedModel && relatedModel.get(attribute);
				const valueInModel = model.get(attribute);

				relatedIds[attribute] = valueInContextModel || valueInModel;
			}
		});

		return relatedIds;
	},

	BASIC_RELATED_FIELD_TYPES,
	RELATED_FIELD_ATTRIBUTE_BY_KEY,
	NAME_FIELD_MAP
};

module.exports = FieldWrapperUtils;

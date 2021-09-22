const fieldWrapperUtils = require('views/grid-react/utils/fields-utils');
const modelUtils = require('views/grid-react/utils/model-utils');
const Helpers = require('utils/helpers');
const fieldUsageTracking = require('utils/analytics/field-component-usage-tracking');
const $ = require('jquery');
const _ = require('lodash');
const salesPhone = require('utils/sales-phone');
const getModelsIds = (model, relatedModels) => {
	let dealId = _.get(relatedModels, 'deal.id');
	let personId = _.get(relatedModels, 'person.id');
	let orgId = _.get(relatedModels, 'organization.id');
	let activityId = null;

	function setIdsFromModel(model) {
		switch (model.type) {
			case 'deal':
				dealId = model.id;
				break;

			case 'person':
				personId = model.id;
				break;

			case 'organization':
				orgId = model.id;
				break;

			case 'activity':
				activityId = model.id;
				break;

			default:
				return;
		}
	}

	if (model) {
		setIdsFromModel(model);
	}

	if (model && model.parentModel) {
		setIdsFromModel(model.parentModel);
	}

	return { dealId, personId, orgId, activityId };
};
const formatValue = ({ fieldValue, model, relatedModelIds, relatedModels, trackingData }) => {
	const value = _.isObject(fieldValue) ? fieldValue.value : fieldValue;

	return {
		value: Helpers.formatPhoneNumber(value),
		label: fieldWrapperUtils.formatValueLabel('phone', fieldValue.label),
		linkAttributes: {
			href: Helpers.createPhoneLink(value, relatedModelIds),
			onClick: (ev, { quickCallMethod, source } = {}) => {
				const $phoneGroup = $(ev.target).closest('.gridCell__salesPhoneButton--caller12');
				const phoneFieldElement = salesPhone.isCaller12()
					? $phoneGroup.find('.gridCell__salesPhoneOptions--caller12')[0]
					: ev.currentTarget;
				const phoneNumbersArray = model.get('phone');
				const clickedOnNumber = !$(ev.target).hasClass('gridCell__salesPhoneOptions');
				const quickCallButtonElement =
					source === salesPhone.SOURCE_QUICK_CALL
						? $phoneGroup.find('.gridCell__salesPhoneCallButton')[0]
						: null;
				const quickCallNumberElement =
					source === salesPhone.SOURCE_QUICK_CALL_PHONE_NUMBER
						? $phoneGroup.find('.gridCell__salesPhoneNumber')[0]
						: null;

				fieldUsageTracking.phone.valueClicked(trackingData);

				if (salesPhone.isAvailable()) {
					ev.preventDefault();

					salesPhone.createView({
						phoneNumber: value,
						...getModelsIds(model, relatedModels),
						phoneFieldElement,
						relatedModel: model,
						phoneNumbersArray,
						createPhoneLink: Helpers.createPhoneLink,
						clickedOnNumber,
						quickCallMethod,
						quickCallButtonElement,
						quickCallNumberElement,
						source
					});
				}
			}
		}
	};
};

module.exports = (props) => {
	let relatedModelIds;

	const { model, field, relatedModels } = props;
	const fieldValues = modelUtils.getModelAttribute(model, field.key, []);
	const trackingData = {
		field_subtype: field.field_type === 'phone' ? 'phone' : 'custom',
		field_name: field.name,
		parent_object_id: _.get(model, 'parentModel.id'),
		parent_object_type: _.get(model, 'parentModel.type'),
		object_id: model && model.id,
		object_type: model && model.type
	};

	if (model) {
		relatedModelIds = fieldWrapperUtils.getRelatedIds(model, model.parentModel);
	}

	if (_.isArray(fieldValues)) {
		return _.map(fieldValues, (fieldValue) =>
			formatValue({
				fieldValue,
				model,
				relatedModelIds,
				relatedModels,
				trackingData
			})
		);
	}

	return [
		formatValue({
			fieldValue: fieldValues,
			model,
			relatedModelIds,
			relatedModels,
			trackingData
		})
	];
};

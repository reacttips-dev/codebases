/* eslint-disable max-lines */
import _ from 'lodash';
import { MergeFieldsPlugin } from '@pipedrive/pd-wysiwyg';

import { getLinkedDeal, getPerson, getOrganization } from '../actions/field-picker';
import { getLinkedLead } from '../../shared/actions/lead';
import { format } from '../../shared/helpers/formatter';
import { getOrganizationIdFromLinkedEntity } from '../../shared/helpers/organization';
import {
	getOptionFieldFormattedValue,
	getRelatedObjectValue,
	getMonetaryValue,
	isCustomField,
	getTimeValue,
	getDateValue
} from './fields';

const FIELD_TYPES = {
	person: 'person',
	deal: 'deal',
	lead: 'lead',
	organization: 'organization',
	user: 'user',
	placeholder: 'placeholder',
	other: 'other'
};

export const getCustomFieldsValues = (data, relatedObjects, type, userSelf) => {
	const customKeys = Object.keys(data).filter((key) => isCustomField(key));
	const fields = userSelf.fields.get(type);

	customKeys.forEach((key) => {
		const fieldMatch = fields.find((field) => field.key === key);
		const fieldValue = data[key];

		if (_.isNil(fieldValue) || !fieldMatch) {
			return;
		}

		if (fieldMatch.options) {
			data[key] = getOptionFieldFormattedValue(fieldMatch.options, fieldValue);
		}

		if (FIELD_TYPES[fieldMatch.field_type]) {
			data[key] = getRelatedObjectValue(fieldValue, fieldMatch.field_type, relatedObjects);
		}

		if (fieldMatch.field_type === 'monetary') {
			data[key] = getMonetaryValue(data, key, userSelf);
		}

		if (fieldMatch.field_type === 'time' || fieldMatch.field_type === 'timerange') {
			data[key] = getTimeValue(data, fieldMatch);
		}

		if (fieldMatch.field_type === 'date' || fieldMatch.field_type === 'daterange') {
			data[key] = getDateValue(data, fieldMatch);
		}
	});

	return data;
};
export const getStageName = (deal, userSelf) => {
	const stageId = deal.stage_id;
	const stages = userSelf.get('stages');
	const stage = stages.find((stage) => stage.id === stageId);

	return _.get(stage, 'name');
};
export const getPipelineName = (deal, userSelf) => {
	const pipelineId = deal.pipeline_id;
	const pipelines = userSelf.pipelines;
	const pipeline = pipelines.find({ id: pipelineId });
	// pipeline could be deactivated, so we can't fill pipeline name as it's not attached to userself
	const pipelineName = (pipeline && pipeline.get('name')) || null;

	return pipelineName;
};

export const getPrimaryPhoneOrEmailValue = (items) => {
	if (!_.isArray(items)) {
		return '';
	}

	const primaryItem = items.find(({ primary }) => primary);

	let primaryValue = _.get(primaryItem, 'value', '');

	// if there is no "primary: true" flag then fall back to the first value
	if (!primaryValue) {
		primaryValue = _.get(items, '[0].value', '');
	}

	return primaryValue;
};

export const getFirstRecipient = (draftModel) => {
	if (!draftModel || !_.isFunction(draftModel.getRecipients)) {
		return {};
	}

	const recipients = draftModel.getRecipients();

	return recipients.to[0] || recipients.cc[0] || recipients.bcc[0] || {};
};

export const getDealData = (draftModel, callback) => (dispatch, getState) => {
	const linkedDeal = getState().linkedDeal;
	const dealId = draftModel.threadModel?.get('deal_id');

	if (dealId) {
		const isSameDeal = dealId === linkedDeal.data.id;

		if (isSameDeal) {
			return callback(linkedDeal.data);
		}

		return dispatch(
			getLinkedDeal(dealId, (data) => {
				return callback(data);
			})
		);
	}

	return callback({});
};

export const getLeadData = (draftModel, callback) => (dispatch, getState) => {
	const linkedLead = getState().linkedLead.data || {};
	const leadId = draftModel.threadModel?.get('lead_id');
	const isFetchLead = !(leadId === linkedLead.id);

	if (!leadId) {
		return callback({});
	}

	if (!_.isEmpty(linkedLead) && !isFetchLead) {
		const data = {
			...linkedLead
		};

		// this func will update custom fields values in lead object
		// such fields as monetary or time and date and etc
		getCustomFieldsValues(data, {}, 'lead', getState().userSelf);

		return callback(data);
	}

	if (isFetchLead) {
		return dispatch(
			getLinkedLead({ leadId }, (data) => {
				// this func will update custom fields values in lead object
				// such fields as monetary or time and date and etc
				getCustomFieldsValues(data, {}, 'lead', getState().userSelf);

				return callback(data);
			})
		);
	}
};

export const getOrgData = (draftModel, callback) => (dispatch, getState) => {
	const { threadModel } = draftModel;
	const { linkedDeal, linkedLead, person, organization } = getState();
	const isLinkedDealOrLead = threadModel?.get('deal_id') || threadModel?.get('lead_id');
	const orgIdFromLinkedEntity = getOrganizationIdFromLinkedEntity(
		draftModel,
		linkedDeal,
		linkedLead,
		person
	);
	const orgId = threadModel?.get('org_id') || orgIdFromLinkedEntity;

	// if orgId is undefined, then we can try to take it from linked deal or lead
	if (!orgId && isLinkedDealOrLead) {
		const getLinkedEntityData = threadModel.get('lead_id') ? getLeadData : getDealData;

		return dispatch(
			getLinkedEntityData(draftModel, (linkedEntity) => {
				const orgId = linkedEntity.org_id || linkedEntity.organization?.id;

				if (orgId) {
					return dispatch(
						getOrganization(orgId, (orgData) => {
							return callback(orgData);
						})
					);
				}

				return callback({});
			})
		);
	}

	if (!orgId) {
		return callback({});
	}

	// is same organization
	if (orgId === organization.data.id) {
		return callback(organization.data);
	}

	return (
		!organization.fetching &&
		dispatch(
			getOrganization(orgId, (data) => {
				return callback(data);
			})
		)
	);
};

export const getPersonAndOrgDataFromLinkedPerson = (
	draftModel,
	linkedPersonId,
	includePersonData,
	includeOrgData,
	callback
) => (dispatch, getState) => {
	const person = getState().person;
	const isSamePerson = linkedPersonId === person.data.id;

	// if person is already in store
	if (isSamePerson) {
		if (includeOrgData) {
			return dispatch(
				getOrgData(draftModel, (orgData) => {
					callback({
						person: person.data,
						organization: orgData
					});
				})
			);
		}

		return callback({ person: person.data });
	}

	if (includePersonData) {
		dispatch(
			getPerson(linkedPersonId, (personData) => {
				return callback({ person: personData });
			})
		);
	}

	if (includeOrgData) {
		dispatch(
			getOrgData(draftModel, (orgData) => {
				return callback({
					organization: orgData
				});
			})
		);
	}
};

export const getPersonAndOrgDataFromLinkedEntity = (
	draftModel,
	includePersonData,
	includeOrgData,
	callback
) => async (dispatch) => {
	const getLinkedEntityData = draftModel.threadModel.get('lead_id') ? getLeadData : getDealData;

	return dispatch(
		getLinkedEntityData(draftModel, (data) => {
			const personIdFromLinkedEntity = data.person_id || data.person?.id;
			const orgIdFromLinkedEntity = data.org_id || data.organization?.id;

			// as we do person and org requests async, we need to check, if we need to return the default empty callback or not
			// otherwise we will get duplicated merge fields
			let returnCallback = true;

			if (personIdFromLinkedEntity && includePersonData) {
				returnCallback = false;

				dispatch(
					getPerson(personIdFromLinkedEntity, (personData) => {
						return callback({ person: personData });
					})
				);
			}

			if (orgIdFromLinkedEntity && includeOrgData) {
				returnCallback = false;

				dispatch(
					getOrgData(draftModel, (orgData) => {
						return callback({
							organization: orgData
						});
					})
				);
			}

			return returnCallback && callback({});
		})
	);
};

export const getPreparedDealData = (
	deal,
	relatedObjects,
	userSelf,
	{ skipCustomFields = false } = {}
) => {
	deal.pipeline = getPipelineName(deal, userSelf);
	deal.stage = getStageName(deal, userSelf);

	if (!skipCustomFields) {
		deal = getCustomFieldsValues(deal, relatedObjects, 'deal', userSelf);
	}

	return deal;
};

export const getPreparedLeadData = (fieldData, data, callback) => {
	if (fieldData.fieldKey === 'org_name' && !_.isEmpty(data.organization)) {
		return callback(data.organization.name);
	}

	if (fieldData.fieldKey === 'person_name' && !_.isEmpty(data.person)) {
		return callback(data.person.name);
	}

	if (fieldData.fieldKey === 'owner_name' && !_.isEmpty(data.owner)) {
		return callback(data.owner.name);
	}

	if (fieldData.fieldKey === 'formatted_value' && data.deal && !_.isEmpty(data.deal.value)) {
		const formattedValue = format(data.deal.value.amount, data.deal.value.currency.code);

		return callback(formattedValue);
	}

	return callback(data[fieldData.fieldKey]);
};

export const getPreparedPersonData = (
	person,
	relatedObjects,
	userSelf,
	{ skipCustomFields = false } = {}
) => {
	person.email = getPrimaryPhoneOrEmailValue(person.email);
	person.phone = getPrimaryPhoneOrEmailValue(person.phone);

	if (!skipCustomFields) {
		person = getCustomFieldsValues(person, relatedObjects, 'person', userSelf);
	}

	return person;
};

export const getPersonAndOrgData = (draftModel, includePersonData, includeOrgData, callback) => (
	dispatch
) => {
	const { threadModel } = draftModel;
	const firstRecipient = getFirstRecipient(draftModel) || {};
	const linkedPersonId = firstRecipient.linked_person_id || threadModel?.get('person_id');
	const linkedOrgId = threadModel?.get('org_id');
	const isLinkedDealOrLead = threadModel?.get('deal_id') || threadModel?.get('lead_id');

	if (linkedPersonId) {
		return dispatch(
			getPersonAndOrgDataFromLinkedPerson(
				draftModel,
				linkedPersonId,
				includePersonData,
				includeOrgData,
				({ person, organization }) => {
					return callback({
						person,
						organization
					});
				}
			)
		);
	} else if (isLinkedDealOrLead) {
		// try to get person and org data from linked deal or lead
		return dispatch(
			getPersonAndOrgDataFromLinkedEntity(
				draftModel,
				includePersonData,
				includeOrgData,
				({ person, organization }) => {
					return callback({
						person,
						organization
					});
				}
			)
		);
	} else if (includeOrgData && (linkedPersonId || linkedOrgId || isLinkedDealOrLead)) {
		return dispatch(
			getOrgData(draftModel, (orgData) => {
				callback({
					person: {},
					organization: orgData
				});
			})
		);
	}

	return callback({
		person: {},
		organization: {}
	});
};
export const fillPersonAndOrgFieldsWithData = (
	draftModel,
	contentEditable,
	fillableFieldTypes,
	callback,
	force
) => (dispatch, getState) => {
	dispatch(
		getPersonAndOrgData(
			draftModel,
			fillableFieldTypes.fillPersonFields,
			fillableFieldTypes.fillOrgFields,
			(data) => {
				const { userSelf } = getState();
				const userProps = {
					locale: userSelf.get('locale'),
					formatNumbersEnabled: userSelf.settings.get('format_phone_numbers_enabled')
				};

				let forceUpdate;

				if (fillableFieldTypes.fillPersonFields) {
					forceUpdate = force.forceUpdatePersonField;
				} else if (fillableFieldTypes.fillOrgFields) {
					forceUpdate = force.forceUpdateOrgField;
				}

				contentEditable.callPluginMethod(MergeFieldsPlugin.name, 'fillFieldsValues', [
					data,
					forceUpdate,
					userProps
				]);

				callback();
			}
		)
	);
};
export const getOtherData = () => (dispatch, getState) => {
	const { userSelf, userEmail } = getState();

	return {
		user_name: userSelf.get('name'),
		user_email: userEmail || userSelf.get('email'),
		company_name: userSelf.get('company_name')
	};
};

export const getFieldValue = (draftModel, contentEditable, fieldData, callback) => (
	dispatch,
	getState
) => {
	if (!draftModel || fieldData.type === FIELD_TYPES.placeholder) {
		return callback('');
	}

	const shouldGetOrgData = fieldData.type === FIELD_TYPES.organization;
	const shouldGetPersonData = fieldData.type === FIELD_TYPES.person;
	const shouldGetDealData = fieldData.type === FIELD_TYPES.deal;
	const shouldGetLeadData = fieldData.type === FIELD_TYPES.lead;
	const shouldGetOtherData = fieldData.type === FIELD_TYPES.user;

	if (shouldGetPersonData || shouldGetOrgData) {
		return dispatch(
			getPersonAndOrgData(draftModel, shouldGetPersonData, shouldGetOrgData, (data) => {
				const object = data[fieldData.type];
				const isPhone = fieldData.fieldKey === 'phone' || fieldData.phoneCustomField;

				if (isPhone && object) {
					const { userSelf } = getState();
					const userProps = {
						locale: userSelf.get('locale'),
						formatNumbersEnabled: userSelf.settings.get('format_phone_numbers_enabled')
					};
					const phone = contentEditable.callPluginMethod(
						MergeFieldsPlugin.name,
						'formatPhoneNumber',
						[object[fieldData.fieldKey], userProps]
					);

					return callback(phone);
				}

				callback(object ? object[fieldData.fieldKey] : '');
			})
		);
	}

	if (shouldGetDealData) {
		return dispatch(
			getDealData(draftModel, (data) => {
				callback(data[fieldData.fieldKey]);
			})
		);
	}

	if (shouldGetLeadData) {
		return dispatch(
			getLeadData(draftModel, (data) => {
				getPreparedLeadData(fieldData, data, callback);
			})
		);
	}

	if (shouldGetOtherData) {
		const otherFieldsData = dispatch(getOtherData());
		const otherFieldValue = otherFieldsData[fieldData.fieldKey];

		return callback(otherFieldValue);
	}
};
export const fillLeadFieldsWithData = (draftModel, contentEditable, callback, force) => (
	dispatch
) => {
	dispatch(
		getLeadData(draftModel, (linkedLead = {}) => {
			const { id, title, deal, owner, person, organization } = linkedLead;
			const hasValue = deal && deal.value;
			const lead = {
				id,
				title,
				formatted_value: hasValue && format(deal.value.amount, deal.value.currency.code),
				owner_name: owner && owner.name,
				person_name: person && person.name,
				org_name: organization && organization.name,
				...linkedLead
			};

			contentEditable.callPluginMethod(MergeFieldsPlugin.name, 'fillFieldsValues', [
				{ lead },
				force
			]);

			callback();
		})
	);
};
export const fillDealFieldsWithData = (draftModel, contentEditable, callback, force) => (
	dispatch
) => {
	dispatch(
		getDealData(draftModel, (data) => {
			contentEditable.callPluginMethod(MergeFieldsPlugin.name, 'fillFieldsValues', [
				{ deal: data },
				force
			]);

			callback();
		})
	);
};
export const fillOtherFieldsWithData = (contentEditable, force) => (dispatch) => {
	const data = dispatch(getOtherData());

	contentEditable.callPluginMethod(MergeFieldsPlugin.name, 'fillFieldsValues', [
		{ user: data },
		force
	]);
};
export const fillFieldsWithData = (draftModel, contentEditable, callback, forceFillTypes = {}) => (
	dispatch
) => {
	const fillableFieldTypes = contentEditable.callPluginMethod(
		MergeFieldsPlugin.name,
		'getInputTypesToFill'
	);
	const fillPersonFields = fillableFieldTypes.includes(FIELD_TYPES.person);
	const fillOrgFields = fillableFieldTypes.includes(FIELD_TYPES.organization);
	const fillDealFields = fillableFieldTypes.includes(FIELD_TYPES.deal);
	const fillLeadFields = fillableFieldTypes.includes(FIELD_TYPES.lead);
	const fillOtherFields = fillableFieldTypes.includes(FIELD_TYPES.user);

	if (fillPersonFields || fillOrgFields) {
		dispatch(
			fillPersonAndOrgFieldsWithData(
				draftModel,
				contentEditable,
				{ fillPersonFields, fillOrgFields },
				callback,
				{
					forceUpdatePersonField: forceFillTypes.person,
					forceUpdateOrgField: forceFillTypes.organization
				}
			)
		);
	}

	if (fillDealFields) {
		dispatch(
			fillDealFieldsWithData(draftModel, contentEditable, callback, forceFillTypes.deal)
		);
	}

	if (fillLeadFields) {
		dispatch(
			fillLeadFieldsWithData(draftModel, contentEditable, callback, forceFillTypes.lead)
		);
	}

	if (fillOtherFields) {
		dispatch(fillOtherFieldsWithData(contentEditable, forceFillTypes.other));
	}

	return callback();
};

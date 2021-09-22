import createModalErrors from 'utils/createModalErrors';
import { ErrorsReferenceFunc, ModalError, Stage } from 'Types/types';

import { checkRequiredFieldsInState } from '../AddModal.utils';
import { getMappedFields } from 'utils/utils';

export const getFirstStageId = (stages: Stage[], pipelineId: number): number | null => {
	const firstStage = stages.find((stage) => stage.pipeline_id === pipelineId) || { id: null };

	return firstStage.id;
};

// eslint-disable-next-line complexity
export const getLeadErrors: ErrorsReferenceFunc = ({
	state,
	relatedEntityState,
	requiredFields,
	fields,
	translator,
}) => {
	const { leadFieldKeyToNameMap, personFieldKeyToNameMap, organizationFieldKeyToNameMap } = getMappedFields(fields);

	let leadErrors = {} as ModalError;
	let personErrors = {} as ModalError;
	let organizationErrors = {} as ModalError;

	if (!state.title || state.title.value === '') {
		leadErrors.title = translator.gettext('Title is required');
	}

	if (!state.related_org_id && !state.related_person_id) {
		leadErrors.related_org_id = translator.gettext('A person or organization is required');
		leadErrors.related_person_id = translator.gettext('A person or organization is required');
	}

	leadErrors = checkRequiredFieldsInState({
		state,
		fieldKeyMap: leadFieldKeyToNameMap,
		entityRequiredFields: requiredFields.lead,
		errors: leadErrors,
		translator,
	});

	if (state.related_person_id && state.related_person_id.isNew) {
		personErrors = checkRequiredFieldsInState({
			state: relatedEntityState.person,
			fieldKeyMap: personFieldKeyToNameMap,
			entityRequiredFields: requiredFields.person,
			errors: personErrors,
			translator,
		});
	}

	if (state.related_org_id && state.related_org_id.isNew) {
		organizationErrors = checkRequiredFieldsInState({
			state: relatedEntityState.organization,
			fieldKeyMap: organizationFieldKeyToNameMap,
			entityRequiredFields: requiredFields.organization,
			errors: organizationErrors,
			translator,
		});
	}

	// If a person requires a related organization, then we have to check this on the "deal level" rather than on
	// the person level, as the organization is added in the left side of the modal with the rest of the deal fields.
	if (personErrors.org_id) {
		if (!state.org_id) {
			leadErrors.org_id = personErrors.org_id;
		}

		delete personErrors.org_id;
	}

	return createModalErrors({
		person: personErrors,
		organization: organizationErrors,
		lead: leadErrors,
	});
};

export enum LeadCustomFieldType {
	varchar = 'varchar',
	text = 'text',
	phone = 'phone',
	address = 'address',
	enum = 'enum',
	set = 'set',
	double = 'double',
	monetary = 'monetary',
	unknown = 'unknown',

	// translate to unknown
	time = 'time',
	timerange = 'timerange',
	daterange = 'daterange',
	date = 'date',
	person = 'person',
	organization = 'organization',
	user = 'user',
}

export const getLeadSupportedFieldTypeInLeads = (type: LeadCustomFieldType) => {
	if (
		type === LeadCustomFieldType.timerange ||
		type === LeadCustomFieldType.daterange ||
		type === LeadCustomFieldType.user ||
		type === LeadCustomFieldType.person ||
		type === LeadCustomFieldType.organization ||
		type === LeadCustomFieldType.varchar ||
		type === LeadCustomFieldType.time
	) {
		return LeadCustomFieldType.unknown;
	} else {
		return type;
	}
};

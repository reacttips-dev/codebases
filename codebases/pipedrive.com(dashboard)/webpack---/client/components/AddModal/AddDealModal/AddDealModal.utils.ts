import createModalErrors from 'utils/createModalErrors';
import { ErrorsReferenceFunc, ModalError, Stage } from 'Types/types';

import { checkRequiredFieldsInState } from '../AddModal.utils';
import { getMappedFields } from 'utils/utils';

export const getFirstStageId = (stages: Stage[], pipelineId: number): number | null => {
	const firstStage = stages.find((stage) => stage.pipeline_id === pipelineId) || { id: null };

	return firstStage.id;
};

// eslint-disable-next-line complexity
export const getDealErrors: ErrorsReferenceFunc = ({
	state,
	relatedEntityState,
	requiredFields,
	fields,
	translator,
}) => {
	const { dealFieldKeyToNameMap, personFieldKeyToNameMap, organizationFieldKeyToNameMap } = getMappedFields(fields);

	let dealErrors = {} as ModalError;
	let personErrors = {} as ModalError;
	let organizationErrors = {} as ModalError;

	if (!state.title || state.title.value === '') {
		dealErrors.title = translator.gettext('Title is required');
	}

	if (!state.org_id && !state.person_id) {
		dealErrors.org_id = translator.gettext('A person or organization is required');
		dealErrors.person_id = translator.gettext('A person or organization is required');
	}

	if (!state.stage_id || !state.stage_id.value || state.stage_id.value === 0) {
		dealErrors.pipeline_id = translator.gettext('A stage is required');
	}

	dealErrors = checkRequiredFieldsInState({
		state,
		fieldKeyMap: dealFieldKeyToNameMap,
		entityRequiredFields: requiredFields.deal,
		errors: dealErrors,
		translator,
	});

	if (state.person_id && state.person_id.isNew) {
		personErrors = checkRequiredFieldsInState({
			state: relatedEntityState.person,
			fieldKeyMap: personFieldKeyToNameMap,
			entityRequiredFields: requiredFields.person,
			errors: personErrors,
			translator,
		});
	}

	if (state.org_id && state.org_id.isNew) {
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
			dealErrors.org_id = personErrors.org_id;
		}

		delete personErrors.org_id;
	}

	return createModalErrors({
		deal: dealErrors,
		person: personErrors,
		organization: organizationErrors,
	});
};

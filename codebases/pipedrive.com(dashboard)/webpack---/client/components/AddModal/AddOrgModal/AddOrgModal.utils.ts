import createModalErrors from 'utils/createModalErrors';
import { ErrorsReferenceFunc, ModalError } from 'Types/types';

import { checkRequiredFieldsInState } from '../AddModal.utils';
import { getMappedFields } from 'utils/utils';

export const getOrgErrors: ErrorsReferenceFunc = ({ state, requiredFields, fields, translator }) => {
	const { organizationFieldKeyToNameMap } = getMappedFields(fields);

	let organizationErrors = {} as ModalError;

	if (!state.name || state.name.value === '') {
		organizationErrors.name = translator.gettext('Name is required');
	}

	organizationErrors = checkRequiredFieldsInState({
		state,
		fieldKeyMap: organizationFieldKeyToNameMap,
		entityRequiredFields: requiredFields.organization,
		errors: organizationErrors,
		translator,
	});

	return createModalErrors({
		organization: organizationErrors,
	});
};

import TranslatorClient from '@pipedrive/translator-client';
import { ModalError, ErrorsReferenceFunc, ModalState, ItemType } from 'Types/types';
import createModalErrors from 'utils/createModalErrors';
import { getMappedFields } from 'utils/utils';

import { checkRequiredFieldsInState } from '../AddModal.utils';

export const getPersonErrors: ErrorsReferenceFunc = ({
	state,
	relatedEntityState,
	requiredFields,
	fields,
	translator,
}) => {
	const { organizationFieldKeyToNameMap, personFieldKeyToNameMap } = getMappedFields(fields);

	let personErrors = {} as ModalError;
	let organizationErrors = {} as ModalError;

	if (!state.name || state.name.value === '') {
		personErrors.name = translator.gettext('Name is required');
	}

	const errorMessage = validateMarketingStatus(state, translator);

	if (errorMessage) {
		personErrors.email = errorMessage;
	}

	personErrors = checkRequiredFieldsInState({
		state,
		fieldKeyMap: personFieldKeyToNameMap,
		entityRequiredFields: requiredFields.person,
		errors: personErrors,
		translator,
	});

	if (state.org_id && state.org_id.isNew) {
		organizationErrors = checkRequiredFieldsInState({
			state: relatedEntityState.organization,
			fieldKeyMap: organizationFieldKeyToNameMap,
			entityRequiredFields: requiredFields.organization,
			errors: organizationErrors,
			translator,
		});
	}

	return createModalErrors({
		person: personErrors,
		organization: organizationErrors,
	});
};

export const validateMarketingStatus = (state: ModalState, translator: TranslatorClient) => {
	const { email, marketing_status } = state;
	const { value } = email || [];
	const emailValue = value as unknown as any[];

	if (marketing_status && marketing_status.value !== 'no_consent') {
		const primaryEmail = emailValue ? emailValue.find((email: ItemType) => email.primary) || {} : null;

		if (!primaryEmail || !primaryEmail.value) {
			return translator.gettext('Email required when using marketing status');
		}
	}

	return '';
};

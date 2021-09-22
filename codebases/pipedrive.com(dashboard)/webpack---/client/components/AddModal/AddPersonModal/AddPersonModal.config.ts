import TranslatorClient from '@pipedrive/translator-client';
import { ModalConfig } from 'Types/types';

import { getPersonErrors, validateMarketingStatus } from './AddPersonModal.utils';

export const getConfig = (translator: TranslatorClient): ModalConfig => {
	return {
		title: translator.gettext('Add person'),
		openDetailsSettingsKey: 'open_details_after_adding_person',
		defaultVisibilitySettingsKey: 'personDefaultVisibility',
		fixedOrderFields: ['name', 'org_id', 'label', 'phone', 'email', 'marketing_status'],
		customFieldsSettingsUrl: '/settings/fields?type=PERSON',
		customFieldsCoachmarkText: translator.gettext('Track additional data, and group your contacts.'),
		createSnackbarMessage: (person) => translator.gettext('New person "%s" created', person.name),
		createDetailsUrl: (id: string) => `/person/${id}`,
		getErrorsReference: getPersonErrors,
		validateMarketingStatus,
	};
};

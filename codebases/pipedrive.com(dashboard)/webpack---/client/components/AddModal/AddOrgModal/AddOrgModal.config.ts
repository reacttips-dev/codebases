import TranslatorClient from '@pipedrive/translator-client';
import { ModalConfig } from 'Types/types';

import { getOrgErrors } from './AddOrgModal.utils';

export const getConfig = (translator: TranslatorClient): ModalConfig => {
	return {
		title: translator.gettext('Add organization'),
		openDetailsSettingsKey: 'open_details_after_adding_organization',
		defaultVisibilitySettingsKey: 'orgDefaultVisibility',
		fixedOrderFields: ['name', 'label'],
		customFieldsSettingsUrl: '/settings/fields?type=ORGANIZATION',
		customFieldsCoachmarkText: translator.gettext('Track additional data, and group your contacts.'),
		createSnackbarMessage: (org) => translator.gettext('New organization "%s" created', org.name),
		createDetailsUrl: (id: string) => `/organization/${id}`,
		getErrorsReference: getOrgErrors,
	};
};

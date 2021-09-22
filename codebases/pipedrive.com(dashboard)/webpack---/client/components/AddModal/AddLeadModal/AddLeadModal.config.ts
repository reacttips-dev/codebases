import TranslatorClient from '@pipedrive/translator-client';
import { ModalConfig } from 'Types/types';
import { getLeadErrors } from './AddLeadModal.utils';

export const getConfig = (translator: TranslatorClient): ModalConfig => {
	return {
		title: translator.gettext('Add lead'),
		openDetailsSettingsKey: 'open_details_after_adding_deal',
		defaultVisibilitySettingsKey: 'leadDefaultVisibility',
		fixedOrderFields: ['related_person_id', 'related_org_id', 'title', 'deal_value', 'labels', 'owner_id'],
		customFieldsSettingsUrl: '/settings/fields?type=DEAL',
		customFieldsCoachmarkText: translator.gettext('Track additional data, and group your lead.'),
		createSnackbarMessage: (lead) => translator.gettext('New lead "%s" created', lead.title),
		createDetailsUrl: (id: string) => `/leads/inbox/${id}`,
		getErrorsReference: getLeadErrors,
	};
};

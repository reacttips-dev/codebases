import TranslatorClient from '@pipedrive/translator-client';
import { ModalConfig } from 'Types/types';

import { getDealErrors } from './AddDealModal.utils';

export const getConfig = (translator: TranslatorClient): ModalConfig => {
	return {
		title: translator.gettext('Add deal'),
		openDetailsSettingsKey: 'open_details_after_adding_deal',
		defaultVisibilitySettingsKey: 'dealDefaultVisibility',
		fixedOrderFields: [
			'person_id',
			'org_id',
			'title',
			'value',
			'renewal_type',
			'pipeline_id',
			'stage_id',
			'label',
			'probability',
			'expected_close_date',
			'user_id', // Owner
		],
		customFieldsSettingsUrl: '/settings/fields?type=DEAL',
		customFieldsCoachmarkText: translator.gettext('Track additional data, and group your deals.'),
		createSnackbarMessage: (deal) => translator.gettext('New deal "%s" created', deal.title),
		createDetailsUrl: (id: string) => `/deal/${id}`,
		getErrorsReference: getDealErrors,
	};
};

import TranslatorClient from '@pipedrive/translator-client';

import { LEADS_BULK_MAX_LIMIT } from './context/useSelectedRows';

export const getLeadsListLimitWarningConfig = (translator: TranslatorClient) => ({
	text: translator.gettext(
		'Only the first %d leads were selected because bulk actions do not allow more at once',
		LEADS_BULK_MAX_LIMIT,
	),
	color: 'yellow' as const,
	icon: 'warning' as const,
});

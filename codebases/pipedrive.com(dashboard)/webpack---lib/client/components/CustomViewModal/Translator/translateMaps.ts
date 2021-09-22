import TranslatorClient from '@pipedrive/translator-client';
import { Field } from 'Components/CustomViewModal/types';

export const translateItemType = (translator: TranslatorClient, itemType: Field['itemType']): string => {
	const itemTypeMap: Record<Field['itemType'], string> = {
		lead: translator.gettext('Lead'),
		deal: translator.gettext('Deal'),
		person: translator.gettext('Person'),
		organization: translator.gettext('Organization'),
		note: translator.gettext('Note'),
		filter: translator.gettext('Filter'),
	};

	return itemTypeMap[itemType];
};

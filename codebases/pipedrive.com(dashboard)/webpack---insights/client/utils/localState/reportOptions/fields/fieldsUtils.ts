import { Translator } from '@pipedrive/react-utils';

export const getMappedTeamField = (translator: Translator) => {
	return {
		uiName: 'teamId',
		translatedName: translator.gettext('Team'),
		isCustomField: false,
		fieldType: 'team',
	};
};

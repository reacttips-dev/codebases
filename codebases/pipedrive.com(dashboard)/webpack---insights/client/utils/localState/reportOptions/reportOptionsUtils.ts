import { snakeCase } from 'lodash';
import { Translator } from '@pipedrive/react-utils';

import { FilterType, ActivityFieldKey } from '../../../utils/constants';

export const getActivityFieldTranslatedName = (
	fieldFromWebappApi: Pipedrive.ActivityField,
	translator: Translator,
) => {
	if (fieldFromWebappApi.key === snakeCase(ActivityFieldKey.DONE)) {
		return translator.gettext('Status');
	}

	if (fieldFromWebappApi.key === snakeCase(ActivityFieldKey.DURATION)) {
		return translator.gettext('Duration (minutes)');
	}

	return fieldFromWebappApi.name;
};

export const getActivityFieldType = (
	activitiyFieldFromWebappApi: Pipedrive.ActivityField,
): FilterType => {
	if (
		activitiyFieldFromWebappApi.key === snakeCase(ActivityFieldKey.DURATION)
	) {
		return FilterType.INT;
	}

	return activitiyFieldFromWebappApi.field_type as FilterType;
};

export const getMailFieldLabel = (
	fieldKey: string,
	translator: Translator,
): string => {
	const translatedLabels = {
		id: translator.gettext('ID'),
		messageTime: translator.gettext('Sent/received time'),
		userId: translator.gettext('User'),
		type: translator.gettext('Email direction'),
		teamId: translator.gettext('Team'),
		openedTrackingStatus: translator.gettext('Open tracking'),
		openTime: translator.gettext('Opened time (tracking)'),
		linkTrackingStatus: translator.gettext('Link tracking'),
		linkClickedTime: translator.gettext('Link clicked time (tracking)'),
		subject: translator.gettext('Subject'),
	} as { [key: string]: string };

	return translatedLabels[fieldKey] || '';
};

export const getMailFieldType = (fieldKey: string): FilterType => {
	const translatedLabels = {
		messageTime: FilterType.DATE,
		userId: FilterType.USER,
		type: FilterType.ENUM,
		teamId: FilterType.TEAM,
		openedTrackingStatus: FilterType.ENUM,
		openTime: FilterType.DATE,
		linkTrackingStatus: FilterType.ENUM,
		linkClickedTime: FilterType.DATE,
	} as { [key: string]: FilterType };

	return translatedLabels[fieldKey];
};

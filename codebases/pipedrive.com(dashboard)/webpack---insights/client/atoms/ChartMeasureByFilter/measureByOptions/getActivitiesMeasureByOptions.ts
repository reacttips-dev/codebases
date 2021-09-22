import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { mapOptions, sortArrayByProperty } from '../../../utils/helpers';
import { MeasureByField } from '../../../types/apollo-query-types';
import { TranslatedField, MappedOption } from '../../../types/report-options';
import { getActivitiesMeasureByLabel } from '../../../utils/filterUtils';
import { ActivityFieldKey } from '../../../utils/constants';

const getActivitiesMeasureByOptions = (
	measureByOptions: MeasureByField[],
	fields: TranslatedField[],
	translator: Translator,
): MappedOption[] => {
	const additionalAlreadyMappedOptions = [
		{
			name: insightsTypes.Activities.MesaureByField.COUNT,
			fieldType: 'count',
			label: getActivitiesMeasureByLabel(
				insightsTypes.Activities.MesaureByField.COUNT,
				translator,
			),
		},
	];
	const fieldsWithAlteredDurationFieldName = fields.map((field) =>
		field.uiName === ActivityFieldKey.DURATION
			? {
					...field,
					translatedName: translator.gettext('Duration (hours)'),
			  }
			: field,
	);

	const mappedMeasureByOptions = [
		...additionalAlreadyMappedOptions,
		...mapOptions(measureByOptions, fieldsWithAlteredDurationFieldName),
	];

	return mappedMeasureByOptions.sort(sortArrayByProperty('label'));
};

export default getActivitiesMeasureByOptions;

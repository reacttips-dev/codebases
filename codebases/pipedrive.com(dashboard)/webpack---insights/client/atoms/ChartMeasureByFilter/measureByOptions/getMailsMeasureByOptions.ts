import { types as insightsTypes } from '@pipedrive/insights-core';
import { Translator } from '@pipedrive/react-utils';

import { sortArrayByProperty } from '../../../utils/helpers';
import { MappedOption } from '../../../types/report-options';
import { getMailsMeasureByLabel } from '../../../utils/filterUtils';

const getActivitiesMeasureByOptions = (
	translator: Translator,
): MappedOption[] => {
	const options = [
		{
			name: insightsTypes.Mails.MesaureByField.COUNT,
			fieldType: 'count',
			label: getMailsMeasureByLabel(
				insightsTypes.Activities.MesaureByField.COUNT,
				translator,
			),
		},
	];

	return options.sort(sortArrayByProperty('label'));
};

export default getActivitiesMeasureByOptions;

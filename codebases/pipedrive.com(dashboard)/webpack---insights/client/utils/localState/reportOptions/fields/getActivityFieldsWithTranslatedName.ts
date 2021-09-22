import memoize from 'memoizee';
import { Translator } from '@pipedrive/react-utils';

import { Field } from '../../../../types/apollo-query-types';
import { TranslatedActivityField } from '../../../../types/report-options';
import { ActivityFieldKey } from '../../../../utils/constants';
import { getActivityField } from '../../../../utils/filterUtils';
import {
	getActivityFieldTranslatedName,
	getActivityFieldType,
} from '../reportOptionsUtils';
import { getMappedTeamField } from './fieldsUtils';
import { getFields } from '../../../../api/webapp';

const getActivityFieldsWithTranslatedName = (
	fields: Field[],
	translator: Translator,
): TranslatedActivityField[] => {
	return fields.reduce((result, field) => {
		const fieldKey = field.name;

		if (fieldKey === 'teamId') {
			result.push(getMappedTeamField(translator));

			return result;
		}

		const webappApiActivityFields = getFields('activity');
		const fieldFromWebappApi = getActivityField(
			fieldKey as ActivityFieldKey,
			webappApiActivityFields,
		);

		if (!fieldFromWebappApi) {
			return result;
		}

		/*
		 mapping from 'name' to 'uiName' is necessary because deal fields have this mapping
		 and other components rely on this already
		*/
		const mappedField = {
			uiName: fieldKey,
			translatedName: getActivityFieldTranslatedName(
				fieldFromWebappApi,
				translator,
			),
			isCustomField: false,
			fieldType: getActivityFieldType(fieldFromWebappApi),
		};

		result.push(mappedField);

		return result;
	}, []);
};

export default memoize(getActivityFieldsWithTranslatedName);

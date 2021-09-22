import memoize from 'memoizee';
import { Translator } from '@pipedrive/react-utils';

import { Field } from '../../../../types/apollo-query-types';
import { TranslatedActivityField } from '../../../../types/report-options';
import { getMappedTeamField } from './fieldsUtils';
import { getMailFieldType, getMailFieldLabel } from '../reportOptionsUtils';

const LABEL_FIELDS = ['teamIdLabel'];

const getMailFieldsWithTranslatedName = (
	fields: Field[],
	translator: Translator,
): TranslatedActivityField[] => {
	return fields
		.filter((field) => !LABEL_FIELDS.includes(field.name))
		.reduce((result, field) => {
			const fieldKey = field.name;

			if (fieldKey === 'teamId') {
				result.push(getMappedTeamField(translator));

				return result;
			}

			/*
		 mapping from 'name' to 'uiName' is necessary because deal fields have this mapping
		 and other components rely on this already
		*/
			const mappedField = {
				uiName: fieldKey,
				translatedName: getMailFieldLabel(fieldKey, translator),
				isCustomField: false,
				fieldType: getMailFieldType(fieldKey),
			};

			result.push(mappedField);

			return result;
		}, []);
};

export default memoize(getMailFieldsWithTranslatedName);

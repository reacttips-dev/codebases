import memoize from 'memoizee';
import { Translator } from '@pipedrive/react-utils';

import { DealField } from '../../../../types/apollo-query-types';
import { TranslatedDealField } from '../../../../types/report-options';
import { getStaticFieldLabel } from '../../../labels';

const getFieldsWithTranslatedName = (
	fields: DealField[],
	translator: Translator,
): TranslatedDealField[] => {
	return fields.map((field: DealField) => ({
		...field,
		translatedName: field.isCustomField
			? field.originalName
			: getStaticFieldLabel(translator, field.dbName) ||
			  field.originalName,
	}));
};

export default memoize(getFieldsWithTranslatedName);

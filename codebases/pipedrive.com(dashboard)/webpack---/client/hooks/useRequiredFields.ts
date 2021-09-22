import { difference } from 'lodash';
import { useEffect, useMemo, useRef } from 'react';
import { Field, RelatedEntityFields, RequiredFields, RequiredFieldsByType } from 'Types/types';
import { InternalLogger } from 'utils/logger';

const removeRequiredFieldWhenNotAvailable = (availableFields: Field[], requiredFields: RequiredFields) => {
	const entries = Object.entries(requiredFields).filter(([key, requiredField]) =>
		availableFields.some((item) => item.key === key && item.item_type === requiredField.type),
	);

	return Object.fromEntries(entries);
};

const getRelatedEntityFields = (acc: Field[], cur: RelatedEntityFields[keyof RelatedEntityFields]): Field[] => {
	if (Array.isArray(cur)) {
		return [...acc, ...cur];
	}

	return acc;
};

/**
 * Remove required field when it has not been provided by
 * the `dialogRelatedEntityfields` endpoint.
 *
 * This prevents situation where fields are not available to
 * be filled by the user but saving is disabled
 * due to validation error.
 */
const removeNotAvailableRequiredFields = (
	visibleFields: Field[],
	relatedEntityFields?: RelatedEntityFields,
	requiredFieldsByType?: RequiredFieldsByType,
): RequiredFieldsByType => {
	if (!requiredFieldsByType || !relatedEntityFields) {
		return {};
	}

	const relatedEntityValues: RelatedEntityFields[keyof RelatedEntityFields][] = Object.values(relatedEntityFields);

	const availableFields = relatedEntityValues.reduce<Field[]>(getRelatedEntityFields, visibleFields);

	const requiredEntries: [string, RequiredFields][] = Object.entries(requiredFieldsByType);

	const byType: RequiredFieldsByType = requiredEntries.reduce((acc, [key, requiredFields]) => {
		acc[key] = removeRequiredFieldWhenNotAvailable(availableFields, requiredFields);

		return acc;
	}, {});

	return byType;
};

const getAllKeys = (requiredFields: RequiredFieldsByType) =>
	Object.values(requiredFields)
		.map((i) => Object.keys(i))
		.flat();

const getDiscrepancy = (original: RequiredFieldsByType, actual: RequiredFieldsByType) => {
	const discrepancy = difference(getAllKeys(actual), getAllKeys(original));

	return discrepancy;
};

export const useRequiredFields = (
	passedLogger: InternalLogger,
	visibleFields: Field[],
	relatedEntityFields?: RelatedEntityFields,
	requiredFieldsByType?: RequiredFieldsByType,
) => {
	const logger = useRef(passedLogger).current;

	const fields = useMemo(
		() => removeNotAvailableRequiredFields(visibleFields, relatedEntityFields, requiredFieldsByType),
		[visibleFields, relatedEntityFields, requiredFieldsByType],
	);

	useEffect(() => {
		const discrepancy = getDiscrepancy(fields, requiredFieldsByType || {});

		if (discrepancy.length > 0) {
			logger.warning('Missing related entity fields for required fields', {
				discrepancy: discrepancy.length,
				discrepancyKeys: discrepancy.join(','),
			});
		}
	}, [fields]);

	return fields;
};

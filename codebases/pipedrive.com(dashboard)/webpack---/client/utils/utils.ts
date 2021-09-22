import { Field, FieldsByType } from 'Types/types';

export const reduceFields = (acc: { [x: string]: string }, field: Field) => {
	// Exclude fields without speciifed options
	if (['set', 'enum'].includes(field.field_type) && !field.options?.length) {
		return acc;
	}

	acc[field.key] = field.name;

	return acc;
};

export const getMappedFields = (fields: FieldsByType): { [x: string]: { [key: string]: string } } => {
	const mapped = {};

	for (const key in fields) {
		if (Object.prototype.hasOwnProperty.call(fields, key) && fields[key].allFields) {
			mapped[`${key}FieldKeyToNameMap`] = fields[key].allFields.reduce(reduceFields, {});
		}
	}

	return mapped;
};

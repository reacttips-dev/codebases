import { useMemo, useState } from 'react';
import { CustomViewField, Field } from 'Components/CustomViewModal/types';

import { fieldEquals, fieldNotEquals } from './comparators';

type Props = {
	customViewFields: CustomViewField[];
	entityFields: Partial<Record<string, Field[]>>;
};

export type CustomViewHelper = ReturnType<typeof useCustomViewHelper>;

const updateFieldArray = (field: Field) => (fields: Field[]) => {
	const isFieldSelected = fields.some(fieldEquals(field));

	return isFieldSelected ? fields.filter(fieldNotEquals(field)) : [...fields, field];
};

export const useCustomViewHelper = ({ entityFields, customViewFields }: Props) => {
	const fields = useMemo(() => {
		const isFieldVisible = (field: Field): boolean => customViewFields.some(fieldEquals(field));
		const fieldTypes = Object.keys(entityFields);
		const allFields = Object.values(entityFields)
			.filter((e): e is Field[] => Boolean(e))
			.flat();

		const visibleFields = allFields.filter(isFieldVisible);
		const availableFields = allFields.filter((field) => !isFieldVisible(field));

		return {
			fieldTypes,
			visibleFields,
			allFields,
			availableFields,
		};
	}, [entityFields, customViewFields]);
	const [selectedFields, setSelectedFields] = useState(fields.visibleFields);

	const searchField = (searchParam: string) => {
		if (searchParam.length === 0) {
			return fields.allFields;
		}

		return fields.allFields.filter((field) => field.name?.toLowerCase().includes(searchParam.toLowerCase()));
	};

	const isFieldSelected = (field: Field): boolean => selectedFields.some(fieldEquals(field));
	const setField = (field: Field) => setSelectedFields(updateFieldArray(field));

	return {
		...fields,
		setField,
		selectedFields,
		isFieldSelected,
		searchField,
	};
};

import { CustomViewField, Field } from 'Components/CustomViewModal/types';

export const fieldEquals = (field1: Field | CustomViewField) => (field2: Field | CustomViewField) =>
	field1.itemType === field2.itemType && field1.key === field2.key;

export const fieldNotEquals = (field1: Field | CustomViewField) => (field2: Field | CustomViewField) =>
	!fieldEquals(field1)(field2);

export const fieldsEquals = (fields1: (Field | CustomViewField)[], fields2: (Field | CustomViewField)[]): boolean =>
	fields1.length === fields2.length && fields1.every((field1) => fields2.some(fieldEquals(field1)));

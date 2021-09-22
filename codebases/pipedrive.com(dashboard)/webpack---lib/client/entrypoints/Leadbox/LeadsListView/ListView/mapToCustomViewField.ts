import { Field as CustomViewModalField } from 'Components/CustomViewModal/types';
import { Field } from '@pipedrive/types';

export const mapToCustomViewField = (field: Field): CustomViewModalField => ({
	id: field.id,
	key: field.key,
	name: field.name,
	isSubfield: field.is_subfield ?? false,
	parent: field.parent ? mapToCustomViewField(field.parent) : undefined,
	itemType: field.item_type,
});

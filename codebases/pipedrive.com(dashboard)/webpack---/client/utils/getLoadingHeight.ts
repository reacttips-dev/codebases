import { Features } from 'Types/@pipedrive/webapp';
import { FieldsByType, ModalType } from 'Types/types';

export default function getLoadingHeight(fields: FieldsByType, modalType: ModalType, features: Features): number {
	const visibleFields = fields[modalType].visibleFields;

	// Maximum the full height (minus modal top and bottom),
	// Or guesstimate the number of fields (56px per field) + paddings. (+1 field for visible_to field)
	let loaderHeight = Math.min(window.innerHeight - 48 - 48, (visibleFields.length + 1) * 64 + 32);

	if (visibleFields.find((field) => field.key === 'value') && features.products) {
		loaderHeight += 24;
	}

	return loaderHeight;
}

import { TranslatedField } from '../../types/report-options';
import { sortArrayByProperty } from '../../utils/helpers';

export const BLACKLISTED_FIELDS = ['expectedCloseDateOrWonTime'];
export const BLACKLISTED_FIELDS_UINAME = ['threadId'];

export interface SourceTableCheckbox {
	label: string;
	value: string;
}

export interface GroupedColumns {
	selected: SourceTableCheckbox[];
	unselected: SourceTableCheckbox[];
}

export function getGroupedColumns(
	fields: TranslatedField[],
	columns: string[],
) {
	const filteredFields = fields
		.filter((field) => {
			if (
				BLACKLISTED_FIELDS.includes(field.originalName) ||
				BLACKLISTED_FIELDS_UINAME.includes(field.uiName)
			) {
				return false;
			}

			return !field.isNestedObjectField || field.fieldType === 'monetary';
		})
		.map(
			(field) =>
				({
					label: field.translatedName || field.uiName,
					value: field.uiName,
				} as SourceTableCheckbox),
		)
		.sort(sortArrayByProperty('label'));

	return filteredFields.reduce(
		(groups: GroupedColumns, field) => {
			if (columns?.includes(field.value)) {
				groups.selected.push(field);
			} else {
				groups.unselected.push(field);
			}

			return groups;
		},
		{ selected: [], unselected: [] },
	);
}

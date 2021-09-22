import React from 'react';
import { Button, Icon } from '@pipedrive/convention-ui-react';
import { periods } from '@pipedrive/insights-core';
import { useTranslator } from '@pipedrive/react-utils';

import { isCustomFieldsIndicesFlagEnabled } from '../../../api/webapp';
import useFilterState from '../useFilterState';
import {
	FilterType,
	FilterTypenameType,
	INITIAL_DATE_PERIOD,
} from '../../../utils/constants';
import { getAvailableFilters } from './addFilterUtils';
import { sortFilters } from '../../../utils/filterUtils';

import styles from './AddFilterButton.pcss';

interface AddFilterButtonProps {
	appliedFilters: any[];
	allFilters: any[];
	setLastAddedFilter: (param: string) => void;
}

const AddFilterButton = ({
	appliedFilters,
	allFilters,
	setLastAddedFilter,
}: AddFilterButtonProps) => {
	const translator = useTranslator();
	const { addReportFilter } = useFilterState(appliedFilters);

	const getInitialFilter = (availableFilters: any[]) => {
		if (!isCustomFieldsIndicesFlagEnabled()) {
			return (
				availableFilters.find((filter) => !filter.isCustomField) || {}
			);
		}

		return availableFilters[0] || {};
	};

	const availableFilters = sortFilters(
		getAvailableFilters(allFilters, appliedFilters),
	);
	const initialFilter = getInitialFilter(availableFilters);
	const initialOperand =
		(initialFilter.operands && initialFilter.operands[0]) || {};

	let defaultValue: any;

	switch (initialFilter.type) {
		case FilterType.INT:
			defaultValue = initialOperand.defaultValue;
			break;
		case FilterType.SET:
			defaultValue = [initialOperand.defaultValue.id];
			break;
		case FilterType.CURRENCY:
			defaultValue = initialOperand.defaultValue.code;
			break;

		default:
			defaultValue =
				(initialOperand.defaultValue &&
					initialOperand.defaultValue.id) ||
				null;
	}

	const initialDefaultOperand = [
		{
			name: initialOperand.name,
			defaultValue,
			__typename: FilterTypenameType.SELECTED_OPERAND,
		},
	];

	let initialFilterOperands: any;

	switch (initialFilter.type) {
		case FilterType.DATE:
			initialFilterOperands = {
				operands: periods
					.getTimePeriodDates(INITIAL_DATE_PERIOD)
					.map((period) => ({
						...period,
						__typename: FilterTypenameType.SELECTED_FILTER,
					})),
				period: INITIAL_DATE_PERIOD,
			};
			break;
		case FilterType.MONETARY:
			initialFilterOperands = {
				operands: initialFilter.subfields.map((subfield: any) => ({
					subfield: subfield.name,
					operand: subfield.operands[0],
				})),
			};
			break;
		default:
			initialFilterOperands = { operands: initialDefaultOperand };
	}

	const onAddConditionClicked = () => {
		addReportFilter({
			filter: initialFilter.filter,
			type: initialFilter.type,
			...initialFilterOperands,
			__typename: FilterTypenameType.SELECTED_OPERAND,
		});
		setLastAddedFilter(initialFilter.filter);
	};

	return (
		<div className={styles.filterActions}>
			<Button
				size="s"
				color="green"
				className={styles.addConditionBtn}
				disabled={!availableFilters.length}
				onClick={onAddConditionClicked}
				data-test="reports-add-condition-button"
			>
				<Icon icon="plus" size="s" color="white" />
				<span>{translator.gettext('Add condition')}</span>
			</Button>
		</div>
	);
};

export default AddFilterButton;

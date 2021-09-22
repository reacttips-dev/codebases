import React from 'react';
import classNames from 'classnames';
import { get } from 'lodash';
import { Icon, Button, Tooltip } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';

import {
	FilterTypeSelect,
	FilterOperandSelect,
} from '../../atoms/ReportFilterFields';
import {
	FilterTypenameType,
	FilterType,
	INITIAL_DATE_PERIOD,
	LOGGER_FACILITY,
} from '../../utils/constants';
import ReportFilterValue from './ReportFilterValue';
import { getLogger } from '../../api/webapp';

import styles from './ReportFilter.pcss';

interface ReportFilterProps {
	onFilterChange: (newFilter: any) => void;
	removeFilter: () => void;
	filter: insightsTypes.Filter;
	filters: any[];
	canSeeCurrentReport: boolean;
	chartType: insightsTypes.ChartType;
	reportType: insightsTypes.ReportType;
	isMandatory: boolean;
	unavailableOptions?: string[];
	lastAddedFilter?: string | undefined;
}

const ReportFilter: React.FC<ReportFilterProps> = ({
	onFilterChange,
	removeFilter,
	filter,
	filters = [],
	canSeeCurrentReport,
	chartType,
	reportType,
	isMandatory,
	unavailableOptions,
	lastAddedFilter,
}) => {
	const translator = useTranslator();
	const currentFilter =
		filters.find((listFilter) => listFilter.filter === filter.filter) || {};
	const operands = (currentFilter.operands || []).map(
		(operand: any) => operand.name,
	);
	const currentOperand = filter.operands[0];
	const filterType = currentFilter.type || '';
	const isFilterDisabled = !canSeeCurrentReport || isMandatory;

	const setOperandValues = (selectedField: any) => {
		const selectedFilter = filters.find(
			(f) => f.filter === selectedField.filter,
		);
		const initialOperands = selectedFilter.operands[0];

		if (!initialOperands) {
			getLogger().remote(
				'error',
				'Could not set operand values',
				{
					selectedFilter,
				},
				LOGGER_FACILITY,
			);

			return [
				{
					name: null,
					defaultValue: null,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			];
		}

		switch (selectedField.type) {
			case FilterType.DATE:
				return periods.getTimePeriodDates(INITIAL_DATE_PERIOD);
			case FilterType.CURRENCY:
				return [
					{
						name: initialOperands.name,
						defaultValue: initialOperands.defaultValue.code,
						__typename: FilterTypenameType.SELECTED_OPERAND,
					},
				];
			case FilterType.MONETARY:
				return selectedFilter.subfields.map((subfield: any) => ({
					subfield: subfield.name,
					operand: subfield.operands[0],
				}));
			case FilterType.INT:
				return [
					{
						name: initialOperands.name,
						defaultValue: initialOperands.defaultValue,
						__typename: FilterTypenameType.SELECTED_OPERAND,
					},
				];
			case FilterType.SET:
				return [
					{
						name: initialOperands.name,
						defaultValue: [initialOperands.defaultValue.id],
						__typename: FilterTypenameType.SELECTED_OPERAND,
					},
				];

			default:
				return [
					{
						name: initialOperands.name,
						defaultValue: (initialOperands.defaultValue || {}).id,
						__typename: FilterTypenameType.SELECTED_OPERAND,
					},
				];
		}
	};

	const filterChanged = (newValue: string) => {
		const selectedFilter = filters.find((f) => f.filter === newValue);

		const dateFilterDefaultPeriod =
			selectedFilter.type === FilterType.DATE
				? { period: INITIAL_DATE_PERIOD }
				: null;

		onFilterChange({
			filter: newValue,
			type: selectedFilter.type,
			operands: setOperandValues(selectedFilter),
			...{ ...dateFilterDefaultPeriod },
			__typename: FilterTypenameType.SELECTED_FILTER,
		});
	};

	const getOperandDefaultValue = (operandType: string) => {
		if (operandType === insightsTypes.OperandType.EQ) {
			if (currentFilter.type === FilterType.CURRENCY) {
				return get(currentFilter, 'operands[0].defaultValue.code');
			}

			return get(currentFilter, 'operands[0].defaultValue.id');
		}

		return null;
	};

	const operandChanged = (newValue: string) => {
		onFilterChange({
			operands: [
				{
					name: newValue,
					defaultValue: getOperandDefaultValue(newValue),
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			],
			__typename: FilterTypenameType.SELECTED_FILTER,
		});
	};

	const isFilterTypeSelectOpened = filter.filter === lastAddedFilter;

	return (
		<>
			<div
				className={classNames(styles.filters, {
					[styles.filtersDisabled]: !canSeeCurrentReport,
				})}
				data-test="reports-filters-row"
			>
				<div className={styles.value}>
					<FilterTypeSelect
						data={filter}
						filtersList={filters}
						filterChanged={filterChanged}
						isFilterDisabled={isFilterDisabled}
						isSelectOpened={isFilterTypeSelectOpened}
					/>

					{!currentFilter.subfields && (
						<FilterOperandSelect
							operands={operands}
							currentOperand={currentOperand}
							operandChanged={operandChanged}
							hasUnavailableOptions={!!unavailableOptions}
							filterType={filterType}
							canSeeCurrentReport={canSeeCurrentReport}
							reportType={reportType}
						/>
					)}
					<ReportFilterValue
						filterType={filterType}
						currentOperand={currentOperand}
						filter={filter}
						onFilterChange={onFilterChange}
						canSeeCurrentReport={canSeeCurrentReport}
						filtersList={filters}
						chartType={chartType}
						unavailableOptions={unavailableOptions}
					/>
				</div>
				<div className={styles.filterActions}>
					{isMandatory && (
						<Tooltip
							placement="left"
							content={translator.gettext(
								'This filter is required for current report type',
							)}
						>
							<Icon
								icon="locked"
								size="s"
								color="black-64"
								data-test="reports-locked-filter-button"
							/>
						</Tooltip>
					)}
					{!isFilterDisabled && (
						<Button
							size="s"
							onClick={() => removeFilter()}
							data-test="reports-remove-filter-button"
						>
							<Icon size="s" icon="trash" color="black-64" />
						</Button>
					)}
				</div>
			</div>
		</>
	);
};

export default React.memo(ReportFilter);

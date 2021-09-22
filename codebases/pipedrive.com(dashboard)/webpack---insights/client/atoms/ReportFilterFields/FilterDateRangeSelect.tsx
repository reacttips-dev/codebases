import React, { useMemo } from 'react';
import { Select, Separator } from '@pipedrive/convention-ui-react';
import { DateRange } from '@pipedrive/form-fields';
import { DateRangeProps } from '@pipedrive/form-fields/types/components';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes, periods } from '@pipedrive/insights-core';

import { FilterTypenameType, INITIAL_DATE_PERIOD } from '../../utils/constants';
import { getPeriodTranslations } from '../../utils/labels';

import styles from './ReportFilterFields.pcss';

interface FilterDateRangeSelectProps {
	data: insightsTypes.Filter;
	onFilterChange?: (
		filter: insightsTypes.Filter,
		changeFromDropdown?: boolean,
	) => void;
	canSeeCurrentReport: boolean;
}

const FilterDateRangeSelect: React.FC<FilterDateRangeSelectProps> = ({
	data,
	onFilterChange = () => {},
	canSeeCurrentReport,
}) => {
	const translator = useTranslator();
	const translatedPeriods = useMemo(
		() => getPeriodTranslations(translator),
		[],
	);
	const initFrom =
		data &&
		data.operands.find(
			(operand) => operand.name === insightsTypes.OperandType.FROM,
		);
	const initTo =
		data &&
		data.operands.find(
			(operand) => operand.name === insightsTypes.OperandType.TO,
		);

	const periodChange = (newValue: periods.FilterPeriod | 'custom') => {
		if (newValue === 'custom') {
			onFilterChange(
				{
					operands: periods
						.getTimePeriodDates(INITIAL_DATE_PERIOD)
						.map((period) => ({
							...period,
							__typename: FilterTypenameType.SELECTED_OPERAND,
						})) as insightsTypes.Operand[],
					period: newValue,
					__typename: FilterTypenameType.SELECTED_FILTER,
				},
				true,
			);

			return;
		}

		onFilterChange({
			operands: periods.getTimePeriodDates(newValue).map((period) => ({
				...period,
				__typename: FilterTypenameType.SELECTED_OPERAND,
			})),
			period: newValue,
			__typename: FilterTypenameType.SELECTED_FILTER,
		});
	};

	const dateRangeChange = (newValue: DateRangeProps['value']) => {
		const startDate = (newValue && newValue.startDate) || '';
		const endDate = (newValue && newValue.endDate) || '';

		onFilterChange({
			operands: [
				{
					name: insightsTypes.OperandType.FROM,
					defaultValue: startDate,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
				{
					name: insightsTypes.OperandType.TO,
					defaultValue: endDate,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
				{
					name: insightsTypes.OperandType.FORMAT,
					defaultValue: periods.gqlDateFormat,
					__typename: FilterTypenameType.SELECTED_OPERAND,
				},
			],
			period: 'custom',
			__typename: FilterTypenameType.SELECTED_FILTER,
		});
	};

	const renderOptionsBlock = (
		blockName: string,
		blockPeriods: {
			[period: string]: string;
		},
	) => (
		<>
			<Separator type="block">{blockName}</Separator>

			{Object.keys(blockPeriods).map((period) => (
				<Select.Option
					key={period}
					value={period}
					data-test={`period-select-option-${blockPeriods[period]}`}
				>
					{blockPeriods[period]}
				</Select.Option>
			))}
		</>
	);

	const renderSelect = () => {
		return (
			<Select
				className={styles.select}
				popupClassName={styles.options}
				onChange={periodChange}
				portalTo={document.body}
				value={data?.period}
				disabled={!canSeeCurrentReport}
				filter
				popperProps={{
					modifiers: {
						preventOverflow: { enabled: false },
					},
				}}
				data-test="filter-period-select"
			>
				{renderOptionsBlock(
					translator.gettext('Relative dates'),
					translatedPeriods.relativeDates,
				)}
				{renderOptionsBlock(
					translator.gettext('Relative periods'),
					translatedPeriods.relativePeriods,
				)}
				{renderOptionsBlock(
					translator.gettext('Rolling periods'),
					translatedPeriods.rollingPeriods,
				)}

				<Separator />
				<Select.Option
					value="custom"
					data-test="period-select-option-custom"
				>
					{translator.gettext('Custom period')}
				</Select.Option>
			</Select>
		);
	};

	const getDateValue = (date: any) =>
		date ? (date.defaultValue as string) : '';

	return (
		<>
			{renderSelect()}
			<div className={styles.dateRange} data-test="filter-date-range">
				<DateRange
					value={{
						startDate: getDateValue(initFrom),
						endDate: getDateValue(initTo),
					}}
					startOpen={false}
					onComponentChange={dateRangeChange}
					openNextAfterSelection
					disabled={!canSeeCurrentReport}
				/>
			</div>
		</>
	);
};

export default FilterDateRangeSelect;

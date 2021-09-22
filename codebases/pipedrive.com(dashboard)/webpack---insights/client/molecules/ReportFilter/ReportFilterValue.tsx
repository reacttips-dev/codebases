import React from 'react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import {
	FilterInput,
	FilterNumericInput,
	FilterDateRangeSelect,
	FilterSelect,
	FilterEntitySelect,
} from '../../atoms/ReportFilterFields';
import {
	FilterType,
	multiSelectWhitelist,
	singleSelectWhitelist,
	inputWhitelist,
	numericInputWhitelist,
} from '../../utils/constants';

interface ReportFilterValueProps {
	filterType: FilterType;
	currentOperand: insightsTypes.Operand;
	filter: insightsTypes.Filter;
	onFilterChange: (filter: insightsTypes.Filter) => void;
	canSeeCurrentReport: boolean;
	filtersList: any[];
	chartType: insightsTypes.ChartType;
	unavailableOptions?: string[];
}

const ReportFilterValue = ({
	filterType,
	currentOperand,
	filter,
	onFilterChange,
	canSeeCurrentReport,
	filtersList,
	chartType,
	unavailableOptions,
}: ReportFilterValueProps) => {
	const entitySelectionFilterTypes = [
		FilterType.DEAL,
		FilterType.PERSON,
		FilterType.ORGANIZATION,
		FilterType.PARTICIPANTS,
		FilterType.PRODUCT,
	];
	const isAllowed = {
		input: inputWhitelist.types.includes(filterType),
		numericInput: numericInputWhitelist.types.includes(filterType),
		multiSelect:
			multiSelectWhitelist.types.includes(filterType) &&
			[
				insightsTypes.OperandType.IN,
				insightsTypes.OperandType.NOT,
			].includes(currentOperand.name as insightsTypes.OperandType),
		singleSelect:
			singleSelectWhitelist.types.includes(filterType) &&
			currentOperand.name === insightsTypes.OperandType.EQ,
		dateRange: filterType === FilterType.DATE,
		monetarySelect: filterType === FilterType.MONETARY,
		entitySelect: entitySelectionFilterTypes.includes(filterType),
	};
	const isFilterSelectDisabled = filter.isFilterSelectDisabled;

	return (
		<>
			{isAllowed.input && (
				<FilterInput
					data={filter}
					operand={currentOperand}
					onFilterChange={onFilterChange}
					canSeeCurrentReport={canSeeCurrentReport}
				/>
			)}

			{isAllowed.numericInput && (
				<FilterNumericInput
					data={filter}
					operand={currentOperand}
					onFilterChange={onFilterChange}
					canSeeCurrentReport={canSeeCurrentReport}
					dontAllowNegativeValues={['duration'].includes(
						filter.filter,
					)}
				/>
			)}
			{isAllowed.dateRange && (
				<FilterDateRangeSelect
					data={filter}
					onFilterChange={onFilterChange}
					canSeeCurrentReport={canSeeCurrentReport}
				/>
			)}
			{(isAllowed.singleSelect || isAllowed.multiSelect) && (
				<FilterSelect
					data={filter}
					operand={currentOperand}
					filtersList={filtersList}
					onFilterChange={onFilterChange}
					isMultiSelect={isAllowed.multiSelect}
					canSeeCurrentReport={canSeeCurrentReport}
					chartType={chartType}
					isFilterSelectDisabled={isFilterSelectDisabled}
					unavailableOptions={unavailableOptions}
				/>
			)}
			{isAllowed.entitySelect && (
				<FilterEntitySelect
					operand={currentOperand}
					onFilterChange={onFilterChange}
					canSeeCurrentReport={canSeeCurrentReport}
					filterType={filterType}
				/>
			)}
		</>
	);
};

export default ReportFilterValue;

import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { Panel, Spacing } from '@pipedrive/convention-ui-react';
import { types as insightsTypes } from '@pipedrive/insights-core';

import ReportFilter from '../ReportFilter';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import getFilterOptions from './FiltersAppliedUtils';
import useFilterState from './useFilterState';
import AddFilterButton from './AddFilterButton';
import { sortFilters } from '../../utils/filterUtils';
import useReportOptions from '../../hooks/useReportOptions';
import localState from '../../utils/localState';
import { getCurrentReportParentType } from '../../utils/reportTypeUtils';

import styles from './FiltersApplied.pcss';

interface FiltersAppliedProps {
	canSeeCurrentReport: boolean;
	report: any;
	isFiltersBlockExpanded: boolean;
}

const FiltersApplied: React.FC<FiltersAppliedProps> = ({
	canSeeCurrentReport,
	report,
	isFiltersBlockExpanded,
}) => {
	const reportDataType = report.data_type;
	const { filters } = useReportOptions(reportDataType);
	const { getDefaultReportFilters } = localState();
	const [lastAddedFilter, setLastAddedFilter] = useState<string | undefined>(
		undefined,
	);

	const appliedFilters = get(report, 'unsavedReport.parameters.filter_by');

	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const reportFilters = getFilterOptions(filters, reportType);
	const defaultReportFilters = getDefaultReportFilters(
		getCurrentReportParentType(reportType),
		reportType,
	);
	const { deleteReportFilter, editReportFilter } =
		useFilterState(appliedFilters);

	const getAvailableFilters = (currentFilter: any) => {
		const usedFilters = appliedFilters
			.map((item: any) => item.filter)
			.filter((f: any) => f !== currentFilter);

		return sortFilters(
			reportFilters.filter(
				(item: any) => !usedFilters?.includes(item.filter),
			),
		);
	};

	const getDefaultFilterSettings = (filterName: string) => {
		const parsedDefaultFilters = JSON.parse(defaultReportFilters || '[]');

		return parsedDefaultFilters.find(
			(defaultFilter: insightsTypes.Filter) =>
				defaultFilter.filter === filterName,
		);
	};
	const isFilterMandatory = (filterName: string) => {
		return getDefaultFilterSettings(filterName)?.isMandatory;
	};
	const getUnavailableOptions = (filterName: string) => {
		return getDefaultFilterSettings(filterName)?.unavailableOptions;
	};

	useEffect(() => {
		setLastAddedFilter(undefined);
	}, [appliedFilters]);

	const renderFilters = () => {
		return (
			<>
				<div className={styles.filterWrapper}>
					{appliedFilters.map((filter: any, index: number) => {
						return (
							<ReportFilter
								key={String(index)}
								filters={getAvailableFilters(filter.filter)}
								filter={filter}
								lastAddedFilter={lastAddedFilter}
								isMandatory={isFilterMandatory(filter.filter)}
								unavailableOptions={getUnavailableOptions(
									filter.filter,
								)}
								removeFilter={() => {
									deleteReportFilter(index);
								}}
								onFilterChange={(filterObj) => {
									editReportFilter(index, filterObj);
								}}
								canSeeCurrentReport={canSeeCurrentReport}
								chartType={chartType}
								reportType={reportType}
							/>
						);
					})}
					{canSeeCurrentReport && (
						<Spacing horizontal="m" vertical="s">
							<AddFilterButton
								allFilters={reportFilters}
								appliedFilters={appliedFilters}
								setLastAddedFilter={setLastAddedFilter}
							/>
						</Spacing>
					)}
				</div>
			</>
		);
	};

	return (
		<Panel noBorder elevation="01" className={styles.panel} spacing="none">
			{isFiltersBlockExpanded && renderFilters()}
		</Panel>
	);
};

export default React.memo(FiltersApplied);

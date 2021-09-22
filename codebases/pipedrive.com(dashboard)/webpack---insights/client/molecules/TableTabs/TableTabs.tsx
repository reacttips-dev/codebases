import React, { useMemo } from 'react';
import { types } from '@pipedrive/insights-core';
import { ButtonGroup, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { dataTabTypes } from '../../utils/constants';
import { trackReportTableViewTypeChanged } from '../../utils/metrics/report-analytics';
import { getAvailableReportTableTypeNames } from '../../utils/reportTypeUtils';

interface TableTabsProps {
	selectedDataTab: any;
	setSelectedDataTab: any;
	setExpanded: any;
	reportId: string;
	dataType: types.DataType;
	chartType: types.ChartType;
}

const TableTabs = ({
	selectedDataTab,
	setSelectedDataTab,
	setExpanded,
	reportId,
	dataType,
	chartType,
}: TableTabsProps) => {
	const translator = useTranslator();

	const handleDataTabClick = (tab: any) => {
		setExpanded(true);
		setSelectedDataTab(tab);

		trackReportTableViewTypeChanged(reportId, tab);
	};

	const availableTableTypes = useMemo(
		() =>
			getAvailableReportTableTypeNames({
				translator,
				chartType,
				dataType,
			}),
		[chartType, dataType],
	);
	return (
		<>
			<ButtonGroup color="ghost">
				{availableTableTypes?.sourceTableTabName && (
					<Button
						onClick={() =>
							handleDataTabClick(dataTabTypes.SOURCE_DATA)
						}
						active={selectedDataTab === dataTabTypes.SOURCE_DATA}
					>
						{availableTableTypes.sourceTableTabName}
					</Button>
				)}
				{availableTableTypes?.summaryTableTabName && (
					<Button
						onClick={() => handleDataTabClick(dataTabTypes.SUMMARY)}
						active={selectedDataTab === dataTabTypes.SUMMARY}
						data-test="summary-table-tab"
					>
						{availableTableTypes.summaryTableTabName}
					</Button>
				)}
			</ButtonGroup>
		</>
	);
};

export default React.memo(TableTabs);

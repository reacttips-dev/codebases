import React, { useMemo } from 'react';
import {
	Button,
	Icon,
	Spacing,
	Tooltip,
	Spinner,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';
import { DataType } from '@pipedrive/insights-core/lib/types';

import { STATS_DEFAULT_MEASURE_BY_FILTER } from '../../utils/constants';
import ExportDialog from '../../shared/export/ExportDialog';
import ExportDialogButton from '../../shared/export/exportDialogButton/ExportDialogButton';
import localState from '../../utils/localState';
import useListViewOptions from '../../shared/listView/useListViewOptions';
import {
	ChartSummaryDataObject,
	MapDataReturnType,
} from '../../types/data-layer';
import { hasPermission, PERMISSIONS } from '../../api/webapp';
import { Report } from '../../types/apollo-query-types';
import { getTotalItems } from '../../utils/exportUtils';
import { getAvailableReportChartTypes } from '../../utils/reportTypeUtils';

import styles from './VisualBuilderMenu.pcss';

interface VisualBuilderMenuProps {
	chartType: insightsTypes.ChartType;
	reportType: insightsTypes.ReportType;
	expanded: boolean;
	setExpanded: any;
	loading: boolean;
	measureByFilter: string;
	report: Report;
	reportData: MapDataReturnType;
}

interface ChartTypeObject {
	name: insightsTypes.ChartType;
	icon: string;
	label: string;
	availableInReportTypes: insightsTypes.ReportType[];
	disabledInReportTypes?: insightsTypes.ReportType[];
}

const VisualBuilderMenu: React.FC<VisualBuilderMenuProps> = ({
	chartType,
	reportType,
	expanded,
	setExpanded,
	loading,
	measureByFilter,
	report,
	reportData,
}) => {
	const translator = useTranslator();
	const { setUnsavedReport } = localState();
	const { isExportListViewDialogVisible, setIsExportListViewDialogVisible } =
		useListViewOptions();

	const handleClick = (type: ChartTypeObject) => {
		const shouldResetMeasureByFilter =
			measureByFilter === insightsTypes.Deals.MeasureByType.AVERAGE_VALUE;

		setUnsavedReport({
			chart_type: type.name,
			...(shouldResetMeasureByFilter
				? {
						parameters: {
							measure_by: STATS_DEFAULT_MEASURE_BY_FILTER,
						},
				  }
				: {}),
		});

		if (!expanded) {
			setExpanded(!expanded);
		}
	};

	const getChartTypeButton = (type: ChartTypeObject) => {
		return (
			<Tooltip
				key={type.name}
				placement="top"
				content={<span>{type.label}</span>}
			>
				<Button
					active={chartType === type.name}
					onClick={() => handleClick(type)}
					color="ghost-alternative"
					disabled={
						type.disabledInReportTypes &&
						type.disabledInReportTypes.includes(reportType)
					}
					data-test={`chart-type-button-${type.name}`}
				>
					<Icon icon={type.icon} />
				</Button>
			</Tooltip>
		);
	};

	const renderExportButton = () => {
		if (report?.data_type === DataType.MAILS) {
			return null;
		}

		return (
			<ExportDialogButton
				onClick={() => {
					setIsExportListViewDialogVisible(true);
				}}
				buttonText={translator.gettext('Export')}
				hasPermission={hasPermission(PERMISSIONS.exportDataFromLists)}
			/>
		);
	};

	const availableChartTypes = useMemo(
		() =>
			getAvailableReportChartTypes({
				translator,
				reportType,
			}),
		[reportType],
	);

	return (
		<>
			<div className={styles.menu}>
				<Spacing horizontal="m" vertical="s" className={styles.buttons}>
					{availableChartTypes.map((chartType) =>
						getChartTypeButton(chartType),
					)}
					{loading && <Spinner size="s" />}
				</Spacing>

				<div className={styles.actions}>
					{chartType === insightsTypes.ChartType.TABLE &&
						renderExportButton()}
					{isExportListViewDialogVisible && (
						<ExportDialog
							itemsCount={getTotalItems<
								ChartSummaryDataObject,
								any
							>(
								reportData.chartSummaryData,
								reportData.groupedAndSegmentedFlatData,
							)}
							setIsExportListViewDialogVisible={
								setIsExportListViewDialogVisible
							}
							reportId={report.id}
							reportData={reportData}
						/>
					)}
					<Spacing left="s" right="m" vertical="s">
						<div>
							<Button onClick={() => setExpanded(!expanded)}>
								<Icon
									icon={expanded ? 'collapse' : 'expand'}
									size="s"
									className={styles.icon}
								/>
							</Button>
						</div>
					</Spacing>
				</div>
			</div>
		</>
	);
};

export default React.memo(VisualBuilderMenu);

import React, { useState } from 'react';
import { Spacing, Button, Icon } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import {
	ChartType,
	DataType,
	Filter,
} from '@pipedrive/insights-core/lib/types';

import { dataTabTypes, PERMISSION_TYPES } from '../../utils/constants';
import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { isPublicPage } from '../../utils/helpers';
import useRouter from '../../hooks/useRouter';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import WidgetNoData from '../../atoms/WidgetNoData';
import LockedMessage, {
	LockedMessageType,
} from '../../atoms/NotAvailableMessage/LockedMessage';
import WidgetWrapper from '../../dashboard/widget/widgetWrapper/WidgetWrapper';
import TableTabs from '../../molecules/TableTabs';
import SourceTable from '../../molecules/SourceTable';
import {
	ChartSummaryDataObject,
	MapDataReturnType,
} from '../../types/data-layer';
import { Goal } from '../../types/goals';
import { PERMISSIONS, hasPermission, getCurrentUserId } from '../../api/webapp';
import ExportDialog from '../export/ExportDialog';
import ExportDialogButton from '../export/exportDialogButton/ExportDialogButton';
import { getTotalItems } from '../../utils/exportUtils';
import { findDashboardById } from '../../api/commands/dashboards';
import { canEditItem } from '../../utils/sharingUtils';
import SummaryTableWrapper from './summaryTable/SummaryTableWrapper';
import useListViewOptions from '../listView/useListViewOptions';

import styles from './TableWrapper.pcss';

interface TableWrapperProps {
	hasNoData?: boolean;
	report: any;
	reportData: MapDataReturnType;
	filterByFilter: Filter[];
	groupByFilter: string;
	measureByFilter: string;
	segmentByFilter: string;
	multiSelectFilter?: number[];
	dashboardId?: string;
	widget?: boolean;
	isExpandable?: boolean;
	hasSegment?: boolean;
	goal?: Goal;
}

const TableWrapper: React.FC<TableWrapperProps> = ({
	hasNoData,
	report,
	widget,
	reportData,
	filterByFilter,
	groupByFilter,
	measureByFilter,
	segmentByFilter,
	isExpandable,
	hasSegment,
	dashboardId,
	goal,
	multiSelectFilter,
}) => {
	const translator = useTranslator();

	const reportDataType = report.data_type;
	const reportName = getValueFromUnsavedOrOriginalReport(report, 'name');
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);

	const selectedStages = report.unsavedReport?.parameters?.selectedStages;
	const chartType = getValueFromUnsavedOrOriginalReport(report, 'chart_type');

	const [goTo] = useRouter();
	const [expanded, setExpanded] = useState(true);
	const { hasPermission: hasPlanPermissions, isAdmin } = usePlanPermissions();
	const reportId = report.id;
	const handleNavigationToReportDetails = () => {
		goTo({
			id: reportId,
			type: 'reports',
		});
	};

	const currentUserId = getCurrentUserId();
	const isViewingPublicPage = isPublicPage();
	const dashboard = findDashboardById(dashboardId, isViewingPublicPage);
	const canEditDashboard = canEditItem(dashboard, currentUserId);

	const getSelectedDataTabForMails = () =>
		[ChartType.SCORECARD, ChartType.TABLE].includes(chartType)
			? dataTabTypes.SOURCE_DATA
			: dataTabTypes.SUMMARY;

	const selectedDataTabInit =
		reportDataType === DataType.MAILS
			? getSelectedDataTabForMails()
			: dataTabTypes.SOURCE_DATA;
	const [selectedDataTab, setSelectedDataTab] = useState(selectedDataTabInit);
	const isChartTypeTable = chartType === ChartType.TABLE;
	const { is_goals_report: isGoalsReport } = report;

	const { isExportListViewDialogVisible, setIsExportListViewDialogVisible } =
		useListViewOptions();

	const renderTableByType = () => {
		if (selectedDataTab === dataTabTypes.SOURCE_DATA) {
			return (
				<SourceTable
					widget={widget}
					reportDataType={reportDataType}
					reportType={reportType}
					selectedStages={selectedStages}
					reportData={reportData}
					filterByFilter={filterByFilter}
					reportId={reportId}
					groupByFilter={groupByFilter}
					isGoalsReport={isGoalsReport}
				/>
			);
		}

		if (selectedDataTab === dataTabTypes.SUMMARY) {
			return (
				<SummaryTableWrapper
					report={report}
					reportData={reportData}
					groupByFilter={groupByFilter}
					measureByFilter={measureByFilter}
					segmentByFilter={segmentByFilter}
					goal={goal}
				/>
			);
		}

		return null;
	};

	if (widget) {
		const renderWidgetContent = () => {
			if (
				!hasPlanPermissions(
					PERMISSION_TYPES.dynamic.seeThisReport,
					report.contains_custom_fields,
				)
			) {
				return isViewingPublicPage ? (
					<WidgetNoData
						onEditReportClick={handleNavigationToReportDetails}
						chartType={ChartType.TABLE}
						isPublic={isViewingPublicPage}
						message={translator.gettext(
							'This report is not available',
						)}
						buttonText={null}
					/>
				) : (
					<LockedMessage
						type={LockedMessageType.REPORT}
						size="small"
						title={false}
						hasMargin
						message={translator.pgettext(
							'This report contains custom fields that are for Professional plan only.',
							'This report contains custom fields that are for %s%s%s plan only.',
							[
								`<strong class="${styles.textStrong}">`,
								`${translator.gettext('Professional')}`,
								`</strong>`,
							],
						)}
						buttonText={
							isAdmin
								? translator.gettext('Remove')
								: translator.gettext('Remove from dashboard')
						}
						buttonAction="REMOVE_FROM_DASHBOARD"
						showUpgrade={isAdmin}
						reportId={reportId}
						reportName={reportName}
					/>
				);
			}

			if (hasNoData) {
				return (
					<WidgetNoData
						onEditReportClick={handleNavigationToReportDetails}
						chartType={ChartType.TABLE}
						isPublic={isViewingPublicPage}
						message={translator.gettext(
							'No data to show with current filters or grouping',
						)}
						buttonText={
							canEditDashboard
								? translator.gettext('Edit report')
								: null
						}
					/>
				);
			}

			return renderTableByType();
		};

		return (
			<WidgetWrapper
				hasNoData={hasNoData}
				navigateToReportDetails={handleNavigationToReportDetails}
				report={report}
				hasSegment={hasSegment}
				showFooterOnHover
				reportData={reportData}
				dashboardId={dashboardId}
			>
				{renderWidgetContent()}
			</WidgetWrapper>
		);
	}

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

	return (
		<>
			<div className={styles.TableTabsWrapper}>
				{!isChartTypeTable && (
					<>
						<Spacing horizontal="m" vertical="s">
							<div className={styles.tableTabs}>
								<TableTabs
									setExpanded={setExpanded}
									selectedDataTab={selectedDataTab}
									setSelectedDataTab={setSelectedDataTab}
									reportId={reportId}
									dataType={reportDataType}
									chartType={chartType}
								/>
							</div>
						</Spacing>
						<div className={styles.TableTabsWrapperActions}>
							{selectedDataTab === dataTabTypes.SOURCE_DATA &&
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
									reportId={reportId}
									reportData={reportData}
									multiSelectFilter={multiSelectFilter}
								/>
							)}
							{isExpandable && (
								<Spacing left="s" right="m" vertical="s">
									<Button
										onClick={() => setExpanded(!expanded)}
									>
										<Icon
											icon={
												expanded ? 'collapse' : 'expand'
											}
											size="s"
										/>
									</Button>
								</Spacing>
							)}
						</div>
					</>
				)}
			</div>
			{expanded && renderTableByType()}
		</>
	);
};

export default TableWrapper;

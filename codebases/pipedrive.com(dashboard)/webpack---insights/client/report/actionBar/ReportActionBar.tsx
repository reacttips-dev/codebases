import React, { useState, useCallback } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { types } from '@pipedrive/insights-core';

import { getValueFromUnsavedOrOriginalReport } from '../../utils/reportObjectHelpers';
import { ModalType, DialogType, PERMISSION_TYPES } from '../../utils/constants';
import useSettingsApi from '../../hooks/useSettingsApi';
import useReportModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';
import usePlanPermissions from '../../hooks/usePlanPermissions';
import useActionBarTitle from '../../hooks/useActionBarTitle';
import ReportSaveModal from './saveModal/ReportSaveModal';
import SimpleModal from '../../atoms/SimpleModal';
import Dialog from '../../atoms/Dialog';
import ReportButtons from '../../atoms/ReportButtons';
import ReportSubtypeNavigation from '../../atoms/ReportSubtypeNavigation';
import ReportNavigationDropdown from '../../atoms/ReportNavigationDropdown';
import {
	ActionBar,
	ActionBarFirstRow,
	ActionButtons,
	ActionBarTitle,
	DashboardLockedDialog,
} from '../../shared';
import {
	isItemSharedWithOthers,
	doesItemHaveAnotherOwner,
} from '../../utils/sharingUtils';
import { getCurrentUserId } from '../../api/webapp';
import { getCachedReportById } from '../../utils/localState/insightsApiState';
import { ReportsLimitReturnData } from '../../shared/featureCapping/cappingUtils';
import { trackReportRenamed } from '../../utils/metrics/report-analytics';

import styles from './ReportActionBar.pcss';

interface ReportActionBarProps {
	report: any;
	isNew: boolean;
	isEditing: boolean;
	canSeeCurrentReport: boolean;
	visibleModal: ModalType;
	visibleDialog: DialogType;
	setVisibleDialog: React.Dispatch<React.SetStateAction<DialogType>>;
	setVisibleModal: React.Dispatch<React.SetStateAction<ModalType>>;
	reportLimits: ReportsLimitReturnData;
}

const ReportActionBar: React.FC<ReportActionBarProps> = ({
	report,
	isNew,
	isEditing,
	canSeeCurrentReport,
	visibleModal,
	setVisibleModal,
	visibleDialog,
	setVisibleDialog,
	reportLimits,
}) => {
	const translator = useTranslator();
	const { actionBarTitle, actionBarTitleKey, changeActionBarTitle } =
		useActionBarTitle(report);
	const [callback, setCallback] = useState(null);
	const reportId = report.id;
	const reportName = getValueFromUnsavedOrOriginalReport(report, 'name');
	const reportType = getValueFromUnsavedOrOriginalReport(
		report,
		'report_type',
	);
	const { saveUnsavedReport, updateReport } = useSettingsApi();
	const reportOptions = useReportModalAndDialogOptions();
	const { hasPermission, isAdmin } = usePlanPermissions();
	const canHaveMultipleDashboards = hasPermission(
		PERMISSION_TYPES.static.haveMultipleDashboards,
	);
	const currentUserId = getCurrentUserId();
	const isSharedReport = isItemSharedWithOthers(report, currentUserId);
	const isPeerItem = doesItemHaveAnotherOwner(report, currentUserId);

	const isNavigationSectionVisible = () => {
		const dataTypesWhereNavigationIsHidden = [
			types.DataType.ACTIVITIES,
			types.DataType.MAILS,
		];

		return !dataTypesWhereNavigationIsHidden.includes(report.data_type);
	};

	const modalAndDialogOptions = reportOptions({
		setVisibleModal,
		setVisibleDialog,
		reportId,
		reportName,
	});

	const saveReport = useCallback(async () => {
		await saveUnsavedReport(reportId);
	}, [reportId]);

	const handleReportTypeChange = (callback: Function) => {
		setCallback(() => callback);
		setVisibleDialog(DialogType.REPORT_CHANGE_TYPE);
	};

	const renderModals = () => {
		if (!visibleModal) {
			return null;
		}

		const {
			REPORT_SAVE_AS_NEW,
			REPORT_SAVE,
			DASHBOARD_CREATE_AND_ADD_REPORT,
		} = ModalType;

		if ([REPORT_SAVE_AS_NEW, REPORT_SAVE].includes(visibleModal)) {
			const cachedReport = getCachedReportById(reportId);

			return (
				<ReportSaveModal
					{...(modalAndDialogOptions.modal() as any)[visibleModal]()}
					report={cachedReport}
					currentUserId={currentUserId}
				/>
			);
		}

		if (
			[DASHBOARD_CREATE_AND_ADD_REPORT].includes(visibleModal) &&
			!canHaveMultipleDashboards
		) {
			return (
				<DashboardLockedDialog
					isAdmin={isAdmin}
					setVisibleModal={setVisibleModal}
					translator={translator}
				/>
			);
		}

		return (
			<SimpleModal
				{...(modalAndDialogOptions.modal() as any)[visibleModal]()}
			/>
		);
	};

	const renderDialogs = () => {
		if (!visibleDialog) {
			return null;
		}

		return (
			<Dialog
				{...(modalAndDialogOptions.dialog() as any)[visibleDialog](
					callback,
					setCallback,
				)}
			/>
		);
	};

	return (
		<ActionBar>
			<ActionBarFirstRow>
				<ActionBarTitle
					key={actionBarTitleKey}
					title={actionBarTitle}
					isSharedReport={isSharedReport}
					onChange={(title: string) =>
						changeActionBarTitle(title, async () => {
							await updateReport(reportId, { name: title });
							trackReportRenamed(reportId);
						})
					}
					readOnly={isPeerItem}
				/>
				<ActionButtons>
					<ReportButtons
						reportId={reportId}
						isNew={isNew}
						isEditing={isEditing}
						toggleModal={setVisibleModal}
						toggleDialog={setVisibleDialog}
						saveReport={saveReport}
						canSeeCurrentReport={canSeeCurrentReport}
						isPeerItem={isPeerItem}
						itemOwnerId={report.user_id}
						reportLimits={reportLimits}
					/>
				</ActionButtons>
			</ActionBarFirstRow>
			{isNavigationSectionVisible() && (
				<div className={styles.actionBarSecondRow}>
					<ReportNavigationDropdown
						currentReportType={reportType}
						reportOriginalType={report.report_type}
						isEditing={isEditing}
						isNew={isNew}
						reportId={reportId}
						toggleDialog={handleReportTypeChange}
						canSeeCurrentReport={canSeeCurrentReport}
					/>
					<ReportSubtypeNavigation
						currentReportType={reportType}
						reportOriginalType={report.report_type}
						isEditing={isEditing}
						isNew={isNew}
						reportId={reportId}
						toggleDialog={handleReportTypeChange}
					/>
				</div>
			)}
			{renderModals()}
			{renderDialogs()}
		</ActionBar>
	);
};

export default React.memo(ReportActionBar);

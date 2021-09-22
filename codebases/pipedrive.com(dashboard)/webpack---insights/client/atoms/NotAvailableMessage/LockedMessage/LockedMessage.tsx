import React, { useState } from 'react';
import escape from 'escape-html';
import { useTranslator } from '@pipedrive/react-utils';

import Dialog from '../../../atoms/Dialog';
import { trackReportRemovedFromDashboard } from '../../../utils/metrics/report-analytics';
import { Report, Dashboard } from '../../../types/apollo-query-types';
import { removeTypenames } from '../../../utils/responseUtils';
import { DialogType } from '../../../utils/constants';
import localState from '../../../utils/localState';
import useDashboardModalAndDialogOptions from '../../../hooks/modalAndDialogOptions/useDashboardModalAndDialogOptions';
import useReportModalAndDialogOptions from '../../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';
import LockedMessagePanel from './LockedMessagePanel';
import { updateDashboardReports } from '../../../api/commands/dashboards';
import { snackbarMessageVar } from '../../../api/vars/settingsApi';

export enum LockedMessageType {
	REPORT = 'report',
	DASHBOARD = 'dashboard',
}

interface LockedMessageProps {
	type: LockedMessageType;
	size?: 'small';
	title?: string | false;
	message: string;
	showUpgrade?: boolean;
	buttonText?: string;
	buttonAction?: string | DialogType;
	hasMargin?: boolean;
	reportId?: string;
	reportName?: string;
}

const LockedMessage: React.FC<LockedMessageProps> = ({
	type,
	size,
	title,
	message,
	showUpgrade,
	buttonText,
	buttonAction,
	hasMargin,
	reportId,
	reportName,
}) => {
	const translator = useTranslator();
	const [visibleDialog, setVisibleDialog] = useState<DialogType>(null);
	const { getCurrentDashboard, getCurrentUserSettings, getCurrentReport } =
		localState();
	const { dashboards } = getCurrentUserSettings();
	const isSmall = size === 'small';
	const isDashboard = type === 'dashboard';
	const isReport = type === 'report';

	const currentObject = (() => {
		const isWidgetOnDashboard = isSmall && isReport;

		if (isWidgetOnDashboard) {
			return getCurrentDashboard();
		}

		if (isDashboard) {
			return getCurrentDashboard();
		}

		if (isReport) {
			return getCurrentReport();
		}

		return null;
	})();

	const dashboardOptions = useDashboardModalAndDialogOptions();
	const reportOptions = useReportModalAndDialogOptions();

	const getDashboardModalAndDialogOptions = () =>
		dashboardOptions({
			setVisibleDialog,
			dashboard: currentObject,
		} as any);

	const getReportModalAndDialogOptions = () =>
		reportOptions({
			setVisibleDialog,
			reportId: (currentObject as Report)?.id,
			reportName: (currentObject as Report)?.name,
		} as any);

	const removeFromDashboard = async () => {
		const dashboard = currentObject as Dashboard;

		const updatedReports = dashboard?.reports?.filter(
			(i) => i.id !== reportId,
		);

		await updateDashboardReports(
			dashboard?.id,
			removeTypenames(updatedReports),
		);

		snackbarMessageVar(
			translator.pgettext(
				'[Report name] report has been removed from this dashboard.',
				'%s report has been removed from this dashboard.',
				escape(reportName),
			),
		);

		trackReportRemovedFromDashboard({
			dashboard,
			dashboards,
			reportId,
		});
	};

	const handleClick = () => {
		if (
			[DialogType.DASHBOARD_DELETE, DialogType.REPORT_DELETE].includes(
				buttonAction as DialogType,
			)
		) {
			setVisibleDialog(buttonAction as DialogType);
		}

		if (buttonAction === 'REMOVE_FROM_DASHBOARD') {
			removeFromDashboard();
		}
	};

	return (
		<>
			<LockedMessagePanel
				type={type}
				size={size}
				title={title}
				message={message}
				showUpgrade={showUpgrade}
				buttonText={buttonText}
				hasMargin={hasMargin}
				onButtonClick={handleClick}
			/>
			{visibleDialog && (
				<Dialog
					{...(isDashboard &&
						(getDashboardModalAndDialogOptions().dialog() as any)[
							visibleDialog
						]())}
					{...(isReport &&
						(getReportModalAndDialogOptions().dialog() as any)[
							visibleDialog
						]())}
				/>
			)}
		</>
	);
};

export default LockedMessage;

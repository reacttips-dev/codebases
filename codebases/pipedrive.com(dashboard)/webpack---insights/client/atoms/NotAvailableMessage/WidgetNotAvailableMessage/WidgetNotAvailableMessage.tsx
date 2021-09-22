import React, { useState } from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button } from '@pipedrive/convention-ui-react';

import TrafficCone from '../../../utils/svg/TrafficCone.svg';
import Dialog from '../../../atoms/Dialog';
import { DialogType } from '../../../utils/constants';
import useReportModalAndDialogOptions from '../../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';

import styles from './WidgetNotAvailableMessage.pcss';

interface WidgetNotAvailableMessageProps {
	informativeText?: string;
	includesDeleteReportButton?: boolean;
	reportId?: string;
	reportName?: string;
}

const WidgetNotAvailableMessage: React.FC<WidgetNotAvailableMessageProps> = ({
	informativeText,
	includesDeleteReportButton = false,
	reportId,
	reportName,
}) => {
	const t = useTranslator();
	const [isConfirmationDialogVisible, setConfirmationDialogVisibility] =
		useState(false);
	const reportOptions = useReportModalAndDialogOptions();
	const reportModalAndDialogOptions = reportOptions({
		setVisibleDialog: setConfirmationDialogVisibility as any,
		reportName,
		reportId,
	});

	const onDeleteReportClicked = () => {
		setConfirmationDialogVisibility(true);
	};

	const ConfirmationDialog = () => (
		<Dialog
			{...reportModalAndDialogOptions
				.dialog()
				[DialogType.REPORT_DELETE]()}
		/>
	);

	return (
		<>
			<div className={styles.reportNotAvailableContainer}>
				<TrafficCone />
				{informativeText && (
					<p className={styles.informativeText}>{informativeText}</p>
				)}
				{includesDeleteReportButton && (
					<Button onClick={onDeleteReportClicked}>
						{t.gettext('Remove and delete')}
					</Button>
				)}
			</div>
			{isConfirmationDialogVisible && <ConfirmationDialog />}
		</>
	);
};

export default WidgetNotAvailableMessage;

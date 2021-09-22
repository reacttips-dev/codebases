import React, { useState } from 'react';
import { Panel, Button } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import UnderConstruction from '../../../utils/svg/UnderConstruction.svg';
import { DialogType } from '../../../utils/constants';
import Dialog from '../../Dialog';
import localState from '../../../utils/localState';
import useReportModalAndDialogOptions from '../../../hooks/modalAndDialogOptions/useReportModalAndDialogOptions';

import styles from './ReportNotAvailableMessage.pcss';

interface ReportNotAvailableMessageProps {
	title?: string;
	informativeText?: string;
}

const ReportNotAvailableMessage: React.FC<ReportNotAvailableMessageProps> = ({
	title,
	informativeText,
}) => {
	const t = useTranslator();
	const [isConfirmationDialogVisible, setConfirmationDialogVisibility] =
		useState(false);
	const { getCurrentReport } = localState();
	const reportOptions = useReportModalAndDialogOptions();
	const reportModalAndDialogOptions = reportOptions({
		setVisibleDialog: setConfirmationDialogVisibility as any,
		reportName: getCurrentReport().name,
		reportId: getCurrentReport().id,
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
			<Panel radius="s" elevation="01" noBorder className={styles.panel}>
				<UnderConstruction />
				{title && <h1 className={styles.title}>{title}</h1>}
				{informativeText && (
					<p className={styles.informativeText}>{informativeText}</p>
				)}
				<Button onClick={onDeleteReportClicked}>
					{t.gettext('Delete report')}
				</Button>
			</Panel>
			{isConfirmationDialogVisible && <ConfirmationDialog />}
		</>
	);
};

export default ReportNotAvailableMessage;

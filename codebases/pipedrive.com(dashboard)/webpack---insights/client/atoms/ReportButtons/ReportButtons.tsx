import React from 'react';
import {
	Icon,
	Button,
	Dropmenu,
	Option,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { ModalType, DialogType } from '../../utils/constants';
import SendToDashboardDropmenu from '../../molecules/SendToDashboardDropmenu';
import ViewOnlyButton from '../../shared/viewOnlyButton/ViewOnlyButton';
import ActionBarButtonSeparator from '../../shared/actionBar/ActionBarButtonSeparator';
import {
	ReportsLimitReturnData,
	showCappingFeatures,
} from '../../shared/featureCapping/cappingUtils';

import styles from './ReportButtons.pcss';

interface ReportButtonsProps {
	reportId: string;
	isNew: boolean;
	isEditing: boolean;
	saveReport: () => void;
	canSeeCurrentReport: boolean;
	toggleDialog: React.Dispatch<React.SetStateAction<DialogType>>;
	toggleModal: React.Dispatch<React.SetStateAction<ModalType>>;
	isPeerItem: boolean;
	itemOwnerId: number;
	reportLimits: ReportsLimitReturnData;
}

const ReportButtons: React.FC<ReportButtonsProps> = ({
	reportId,
	isNew,
	isEditing,
	toggleDialog,
	toggleModal,
	saveReport,
	canSeeCurrentReport,
	isPeerItem,
	itemOwnerId,
	reportLimits,
}) => {
	const translator = useTranslator();

	const { numberOfReports, hasReachedReportsLimit, limit } = reportLimits;

	const discardChangesButton = (
		<Button
			onClick={() => {
				toggleDialog(DialogType.REPORT_DISCARD_CHANGES);
			}}
			data-test="report-discard-changes-button"
		>
			{translator.gettext('Discard changes')}
		</Button>
	);
	const saveAsNewButton = (
		<Button
			onClick={() => toggleModal(ModalType.REPORT_SAVE_AS_NEW)}
			data-test="report-save-as-new-button"
		>
			{translator.gettext('Save as new')}
		</Button>
	);

	const saveAsNewButtonDisabled = (
		<Tooltip
			content={translator.pgettext(
				'10/10 user reports used',
				' %s/%s user reports used',
				[numberOfReports, limit],
			)}
		>
			<div className={styles.saveAsNewDisabled}>
				<Button
					disabled
					className={styles.disabledButtonTooltip}
					data-test="report-save-as-new-button"
				>
					{translator.gettext('Save as new')}
				</Button>
			</div>
		</Tooltip>
	);

	if (isNew) {
		return (
			<>
				<Button
					onClick={() => {
						toggleDialog(DialogType.REPORT_DISCARD);
					}}
					data-test="new-report-cancel-button"
				>
					{translator.gettext('Cancel')}
				</Button>
				<Button
					color="green"
					onClick={() => toggleModal(ModalType.REPORT_SAVE)}
					data-test="new-report-save-button"
				>
					{translator.gettext('Save')}
				</Button>
			</>
		);
	}

	if (isEditing) {
		if (isPeerItem) {
			return (
				<>
					<ViewOnlyButton itemOwnerId={itemOwnerId} />
					<ActionBarButtonSeparator />
					{discardChangesButton}
					{saveAsNewButton}
				</>
			);
		}

		return (
			<>
				{discardChangesButton}
				<ActionBarButtonSeparator />
				{showCappingFeatures(hasReachedReportsLimit) &&
				hasReachedReportsLimit
					? saveAsNewButtonDisabled
					: saveAsNewButton}
				<Button
					color="green"
					onClick={saveReport}
					data-test="report-save-button"
				>
					{translator.gettext('Save')}
				</Button>
			</>
		);
	}

	if (isPeerItem) {
		return <ViewOnlyButton itemOwnerId={itemOwnerId} />;
	}

	return (
		<>
			<SendToDashboardDropmenu
				toggleModal={toggleModal}
				reportId={reportId}
				canSeeCurrentReport={canSeeCurrentReport}
			/>
			<Dropmenu
				data-test="ellipsis-menu-popover"
				content={
					<>
						<Option
							className={styles.dropmenuOption}
							onClick={() =>
								toggleDialog(DialogType.REPORT_DELETE)
							}
							data-test="delete-button"
						>
							<Icon
								icon="trash"
								size="s"
								className={styles.dropdownOptionIcon}
							/>
							{translator.gettext('Delete')}
						</Option>
					</>
				}
				popoverProps={{ placement: 'bottom-end' }}
				closeOnClick
			>
				<Button data-test="ellipsis-menu">
					<Icon icon="ellipsis" size="s" />
				</Button>
			</Dropmenu>
		</>
	);
};

export default React.memo(ReportButtons);

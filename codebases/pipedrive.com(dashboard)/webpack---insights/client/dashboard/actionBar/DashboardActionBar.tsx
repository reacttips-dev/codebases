import React, { useState } from 'react';

import { renameDashboard } from '../../api/commands/dashboards';
import { trackDashboardRenamed } from '../../utils/metrics/dashboard-analytics';
import { DialogType, ModalType } from '../../utils/constants';
import useActionBarTitle from '../../hooks/useActionBarTitle';
import useDashboardModalAndDialogOptions from '../../hooks/modalAndDialogOptions/useDashboardModalAndDialogOptions';
import DashboardButtons from './buttons/DashboardButtons';
import Dialog from '../../atoms/Dialog';
import SimpleModal from '../../atoms/SimpleModal';
import { Dashboard } from '../../types/apollo-query-types';
import {
	ActionBar,
	ActionBarFirstRow,
	ActionButtons,
	ActionBarTitle,
} from '../../shared';

import styles from './DashboardActionBar.pcss';

interface DashboardActionBarProps {
	dashboard: Dashboard;
	ownDashboardsCount: number;
	canSeeCurrentDashboard: boolean;
	isPeerItem: boolean;
}

const DashboardActionBar: React.FC<DashboardActionBarProps> = ({
	dashboard,
	ownDashboardsCount,
	canSeeCurrentDashboard,
	isPeerItem,
}) => {
	const { actionBarTitle, actionBarTitleKey, changeActionBarTitle } =
		useActionBarTitle(dashboard);
	const [visibleModal, setVisibleModal] = useState<ModalType>(null);
	const [visibleDialog, setVisibleDialog] = useState<DialogType>(null);

	const dashboardOptions = useDashboardModalAndDialogOptions();

	const modalAndDialogOptions = dashboardOptions({
		setVisibleModal,
		setVisibleDialog,
		dashboard,
	} as any);

	return (
		<div className={styles.actionBarWrapper}>
			<ActionBar className={styles.actionBarDashboard}>
				<ActionBarFirstRow>
					<ActionBarTitle
						key={actionBarTitleKey}
						title={actionBarTitle}
						onChange={(title: string) =>
							changeActionBarTitle(title, async () => {
								await renameDashboard(dashboard?.id, title);
								trackDashboardRenamed(dashboard?.id);
							})
						}
						readOnly={isPeerItem}
					/>
					<ActionButtons>
						<DashboardButtons
							dashboard={dashboard}
							toggleDialog={setVisibleDialog}
							ownDashboardsCount={ownDashboardsCount}
							canSeeCurrentDashboard={canSeeCurrentDashboard}
							isPeerItem={isPeerItem}
						/>
					</ActionButtons>
				</ActionBarFirstRow>
				{visibleDialog && (
					<Dialog
						{...(modalAndDialogOptions.dialog() as any)[
							visibleDialog
						]()}
					/>
				)}
				{visibleModal && (
					<SimpleModal
						{...(modalAndDialogOptions.modal() as any)[
							visibleModal
						]()}
					/>
				)}
			</ActionBar>
		</div>
	);
};

export default DashboardActionBar;

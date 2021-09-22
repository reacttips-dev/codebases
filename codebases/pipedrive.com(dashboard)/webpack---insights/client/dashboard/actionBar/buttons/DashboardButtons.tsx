import React, { useState } from 'react';
import {
	Button,
	Dropmenu,
	Icon,
	Option,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { DialogType } from '../../../utils/constants';
import {
	trackDashboardLinksClosed,
	trackDashboardLinksOpened,
} from '../../../utils/metrics/share-dashboard-analytics';
import SharePublicLinksButton from '../../../atoms/SharePublicLinksButton';
import ShareLinkModal from '../../../molecules/ShareLinkModal';
import ShareModal from './shareModal/ShareModal';
import QuickFilters from '../../../molecules/QuickFilters';
import ErrorBoundary from '../../../atoms/ErrorBoundary';
import ViewOnlyButton from '../../../shared/viewOnlyButton/ViewOnlyButton';
import ActionBarButtonSeparator from '../../../shared/actionBar/ActionBarButtonSeparator';
import { Dashboard } from '../../../types/apollo-query-types';
import ShareDashboardButton from './ShareDashboardButton';

import styles from './DashboardButtons.pcss';

interface DashboardButtonsProps {
	dashboard: Dashboard;
	ownDashboardsCount: number;
	canSeeCurrentDashboard: boolean;
	toggleDialog: Function;
	isPeerItem: boolean;
}

const DashboardButtons: React.FC<DashboardButtonsProps> = ({
	dashboard,
	ownDashboardsCount,
	canSeeCurrentDashboard,
	toggleDialog,
	isPeerItem,
}) => {
	const translator = useTranslator();
	const isLastOwnDashboard = ownDashboardsCount === 1;
	const [isShareModalVisible, setShareModalVisible] = useState(false);
	const [isShareLinkModalVisible, setShareLinkModalVisible] = useState(false);

	const onShareDashboardButtonClicked = () => {
		setShareLinkModalVisible(true);
		trackDashboardLinksOpened();
	};

	const deleteDashboardButton = (
		<Option
			className={styles.dropmenuOption}
			onClick={() => toggleDialog(DialogType.DASHBOARD_DELETE)}
			disabled={isLastOwnDashboard}
			data-test="delete-button"
		>
			<Icon icon="trash" size="s" className={styles.dropdownOptionIcon} />
			{translator.gettext('Delete')}
		</Option>
	);

	return (
		<>
			<div className={styles.dashboardButtons}>
				{isPeerItem && (
					<>
						<ViewOnlyButton
							isDashboard
							itemOwnerId={dashboard.user_id}
						/>

						<ActionBarButtonSeparator />
					</>
				)}

				<ErrorBoundary>
					<QuickFilters dashboardId={dashboard.id} />
				</ErrorBoundary>

				{!isPeerItem && (
					<>
						<ActionBarButtonSeparator />

						<ShareDashboardButton
							dashboard={dashboard}
							setShareModalVisible={setShareModalVisible}
						/>

						<SharePublicLinksButton
							onButtonClick={onShareDashboardButtonClicked}
							disabled={!canSeeCurrentDashboard}
						/>

						<Dropmenu
							content={
								<>
									{isLastOwnDashboard ? (
										<Tooltip
											placement="left"
											content={
												<span>
													{translator.gettext(
														'You cannot delete your only dashboard.',
													)}
												</span>
											}
										>
											{deleteDashboardButton}
										</Tooltip>
									) : (
										deleteDashboardButton
									)}
								</>
							}
							popoverProps={{
								placement: 'bottom-end',
								portalTo: document.body,
							}}
							closeOnClick
						>
							<Button data-test="ellipsis-menu">
								<Icon icon="ellipsis" size="s" />
							</Button>
						</Dropmenu>
					</>
				)}
			</div>
			{isShareLinkModalVisible && (
				<ShareLinkModal
					isVisible={isShareLinkModalVisible}
					onCancel={() => {
						setShareLinkModalVisible(false);
						trackDashboardLinksClosed();
					}}
					dashboardName={dashboard.name}
				/>
			)}
			{isShareModalVisible && (
				<ShareModal
					isVisible={isShareModalVisible}
					onClose={() => {
						setShareModalVisible(false);
					}}
					dashboard={dashboard}
				/>
			)}
		</>
	);
};

export default DashboardButtons;

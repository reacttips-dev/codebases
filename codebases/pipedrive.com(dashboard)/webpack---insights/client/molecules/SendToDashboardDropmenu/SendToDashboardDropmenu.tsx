import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import {
	Icon,
	Button,
	Dropmenu,
	Option,
	Tooltip,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';

import { SelectedItemType } from '../../types/apollo-query-types';
import { ReportAddedToDashboardSource } from '../../utils/metrics/report-analytics';
import {
	getReportById,
	hasMaximumAmountOfReportsInDashboard,
} from '../../utils/helpers';
import { ModalType } from '../../utils/constants';
import useSettingsApi from '../../hooks/useSettingsApi';
import localState from '../../utils/localState/index';
import { getCurrentUserId } from '../../api/webapp';
import { getMoveItemToDashboardWarningMessage } from '../../utils/messagesUtils';
import { getEditableItems } from '../../utils/sharingUtils';

import styles from './SendToDashboardDropmenu.pcss';

interface SendToDashboardDropmenuProps {
	toggleModal: Function;
	reportId: string;
	reportType?: SelectedItemType;
	canSeeCurrentReport: boolean;
}

const SendToDashboardDropmenu: React.FC<SendToDashboardDropmenuProps> = ({
	toggleModal,
	reportId,
	reportType,
	canSeeCurrentReport,
}) => {
	const translator = useTranslator();
	const { addReportToDashboard } = useSettingsApi();
	const { getCurrentUserSettings } = localState();
	const currentUserId = getCurrentUserId();
	const { dashboards } = getCurrentUserSettings();
	const editableDashboards = getEditableItems(dashboards, currentUserId);

	const [, updateState] = useState<{}>();
	const forceUpdate = useCallback(() => updateState({}), []);

	return (
		<Dropmenu
			content={
				<>
					{editableDashboards.map((dashboard: any) => {
						const isInDashboard = !!getReportById(
							reportId,
							dashboard.reports,
						);

						const isMaximumReportsReached =
							hasMaximumAmountOfReportsInDashboard(dashboard);

						const isDashboardDisabled =
							isInDashboard || isMaximumReportsReached;

						const option = (
							<Option
								className={classNames(styles.dropmenuOption, {
									[styles.dropmenuOptionDisabled]:
										isDashboardDisabled,
								})}
								onClick={async () => {
									await addReportToDashboard(
										dashboard.id,
										reportId,
										ReportAddedToDashboardSource.FROM_REPORT,
									);

									forceUpdate();
								}}
								disabled={isDashboardDisabled}
								key={dashboard.id}
								data-test={`add-to-dashboard-dropmenu-item-${dashboard.name}`}
							>
								<Icon
									icon={dashboard.type}
									size="s"
									className={styles.dropdownOptionIcon}
								/>
								{dashboard.name}
							</Option>
						);

						return isDashboardDisabled ? (
							<Tooltip
								placement="left"
								content={
									<span>
										{getMoveItemToDashboardWarningMessage({
											isMaximumReportsReached,
											isGoalTypeReport:
												reportType ===
												SelectedItemType.GOALS,
											isAlreadyInDashboard: isInDashboard,
											translator,
										})}
									</span>
								}
								key={dashboard.id}
							>
								{option}
							</Tooltip>
						) : (
							option
						);
					})}
				</>
			}
			footer={({ closePopover }) => (
				<div className={styles.dropmenuFooter}>
					<Option
						className={classNames(
							styles.dropmenuOption,
							styles.dropmenuOptionHighlighted,
						)}
						onClick={() => {
							toggleModal(
								ModalType.DASHBOARD_CREATE_AND_ADD_REPORT,
							);
							closePopover();
						}}
						key="open-modal"
					>
						<Icon
							icon="plus"
							size="s"
							className={styles.dropdownOptionIcon}
						/>
						{translator.gettext('New dashboard')}
					</Option>
				</div>
			)}
			popoverProps={{
				placement: 'bottom-end',
			}}
			className={styles.dropmenuWrapper}
		>
			<Button
				disabled={!canSeeCurrentReport}
				data-test="add-to-dashboard-button"
			>
				{translator.gettext('Add to dashboard')}
				<Icon icon="triangle-down" />
			</Button>
		</Dropmenu>
	);
};

export default SendToDashboardDropmenu;

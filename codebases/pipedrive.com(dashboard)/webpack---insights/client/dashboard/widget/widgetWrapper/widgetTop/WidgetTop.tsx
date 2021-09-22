import React from 'react';
import classnames from 'classnames';
import { useReactiveVar } from '@apollo/client';
import {
	Button,
	Separator,
	Spacing,
	Icon,
} from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { types as insightsTypes } from '@pipedrive/insights-core';

import { getUrl, isPublicPage } from '../../../../utils/helpers';
import { getWidgetFilterLabels } from '../../../../utils/labels';
import { CoachmarkTags, SideMenuItemGroup } from '../../../../utils/constants';
import useReportOptions from '../../../../hooks/useReportOptions';
import TruncatedText from '../../../../atoms/TruncatedText';
import { getReportIcon } from '../../../../utils/styleUtils';
import Coachmark from '../../../../atoms/Coachmark';
import useOnboardingCoachmarks from '../../../../utils/onboardingCoachmarkUtils';
import { Goal } from '../../../../types/goals';
import WidgetSummary from '../../../../atoms/WidgetSummary/WidgetSummary';
import ConditionalWrapper from '../../../../utils/ConditionalWrapper';
import { canEditItem } from '../../../../utils/sharingUtils';
import { getWidgetTitle } from '../widgetWrapperUtils';
import { findDashboardById } from '../../../../api/commands/dashboards';
import { isViewInFocusVar } from '../../../../api/vars/settingsApi';
import { getCurrentUserId, getActivityTypeById } from '../../../../api/webapp';

import styles from './WidgetTop.pcss';

export interface WidgetTopProps {
	reportId: string;
	reportName: string;
	reportType: insightsTypes.ReportType;
	reportDataType: insightsTypes.DataType;
	isGoalsReport: boolean;
	handleNavigation?: (event: React.MouseEvent) => void;
	appliedFiltersForReport?: any[];
	dashboardId?: string;
	isFirstWidget?: boolean;
	goal?: Goal;
}

const WidgetTop: React.FC<WidgetTopProps> = ({
	reportId,
	reportName,
	reportType,
	reportDataType,
	isGoalsReport,
	handleNavigation,
	appliedFiltersForReport,
	dashboardId,
	isFirstWidget,
	goal,
}) => {
	const translator = useTranslator();

	const isViewingPublicPage = isPublicPage();
	const currentUserId = getCurrentUserId();
	const dashboard = findDashboardById(dashboardId, isViewingPublicPage);
	const canEditDashboard = canEditItem(dashboard, currentUserId);
	const { filters } = useReportOptions(reportDataType);
	const widgetTitle = getWidgetTitle(goal, reportName);
	const isRestrictedGoal = isGoalsReport && !goal;
	const isWidgetClickable =
		handleNavigation && !isViewingPublicPage && !isRestrictedGoal;

	const { INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK } = CoachmarkTags;

	const isViewInFocus = useReactiveVar(isViewInFocusVar);

	const { visible: coachMarkIsVisible, close: closeCoachmark } =
		useOnboardingCoachmarks()[
			INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK
		];

	const filterData = appliedFiltersForReport?.reduce(
		(acc: any, filter: any) => {
			acc.push(getWidgetFilterLabels(filters, filter, translator));

			return acc;
		},
		[],
	);

	const widgetUrl = goal
		? getUrl(SideMenuItemGroup.GOALS, goal.id)
		: getUrl(SideMenuItemGroup.REPORTS, reportId);

	return (
		<div className={styles.widgetTop}>
			<Spacing all="m" bottom="none">
				<div className={styles.titleWrapper}>
					<div className={styles.titleContent}>
						<Icon
							icon={getReportIcon({
								reportType,
								getActivityTypeById,
								item: goal,
							})}
						/>
						<TruncatedText tooltipText={widgetTitle}>
							{isWidgetClickable ? (
								<a
									href={widgetUrl}
									className={classnames(
										'widget-link-to-report',
										styles.titleLink,
									)}
									onClick={(event) => handleNavigation(event)}
									data-test="widget-link"
								>
									{widgetTitle}
								</a>
							) : (
								<div
									className={classnames(
										'widget-link-to-report',
										styles.titleLink,
									)}
									data-test="widget-title"
								>
									{widgetTitle}
								</div>
							)}
						</TruncatedText>
					</div>
					{!isViewingPublicPage && canEditDashboard && (
						<div
							className={classnames(styles.widgetActions, {
								[styles.widgetActionsVisible]:
									isFirstWidget && coachMarkIsVisible,
							})}
						>
							{!isRestrictedGoal && (
								<Button
									color="ghost"
									className={classnames(
										'widget-edit-handle',
										styles.widgetButton,
										styles.editButton,
									)}
									onClick={(event) => {
										coachMarkIsVisible && closeCoachmark();

										handleNavigation(event);
									}}
								>
									<ConditionalWrapper
										condition={
											isFirstWidget && isViewInFocus
										}
										wrapper={(children) => (
											<Coachmark
												coachmark={
													INSIGHTS_ONBOARDING_CUSTOMIZE_REPORT_COACHMARK
												}
											>
												{children}
											</Coachmark>
										)}
									>
										<Icon
											icon="pencil"
											color="black-32"
											data-test="widget-edit-button"
										/>
									</ConditionalWrapper>
								</Button>
							)}
							<Button
								onClick={(e) => e.stopPropagation()}
								color="ghost"
								className={classnames(
									'widget-drag-handle',
									styles.widgetButton,
									styles.dragHandle,
								)}
							>
								<Icon icon="move" color="black-32" />
							</Button>
						</div>
					)}
				</div>
			</Spacing>
			<Spacing vertical="s" horizontal="m">
				{filterData && <WidgetSummary filterData={filterData} />}
			</Spacing>
			<Separator />
		</div>
	);
};

export default WidgetTop;

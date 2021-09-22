import React, { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { useCoachmark } from '@pipedrive/use-coachmark';
import { CoachmarkTags } from '../../utils/constants';
import { refreshDeal } from '../../actions/deals';
import { trackActivityMarkedAsDone, getPdMetrics } from '../../shared/api/webapp';
import { addSnackbarMessage } from '../SnackbarMessage/actions';
import { SnackbarMessages } from '../SnackbarMessage/getMessage';
import getDealActivityStatus from '../../utils/getDealActivityStatus';
import { OnActivityPopoverOpenedParam } from '../../shared/DealTile/ActivityPopover/ActivityContent';
import DealTile from '../../shared/DealTile';

const EmptyActivitiesOnboardingLazy = React.lazy(
	() => import(/* webpackChunkName: "EmptyActivitiesOnboarding" */ './EmptyActivitiesOnboarding'),
);
interface DealTileWrapperProps {
	key?: number;
	index?: number;
	deal?: Pipedrive.Deal;
	user?: Pipedrive.User | any;
	isClickable?: boolean;
	isLast?: boolean;
	isDragging?: boolean;
	size?: DealTileSizes;
}

const DealTileWrapper: React.FunctionComponent<DealTileWrapperProps> = (props) => {
	const dispatch = useDispatch();
	const { deal } = props;
	const pipelineNoActivitiesCoachmark = useCoachmark(CoachmarkTags.PIPELINE_NO_ACTIVITIES);

	return (
		<DealTile
			{...props}
			includeDescription
			popoverBoundariesElement={document.getElementById('pipeline-view-board-container')}
			onActivityPopoverOpened={({
				activities,
				overdueActivities,
				futureActivities,
				todayActivities,
			}: OnActivityPopoverOpenedParam) => {
				const context = {
					deal_id: deal.id,
					activity_total_count: activities.length,
					activity_overdue_count: overdueActivities.length,
					activity_planned_count: futureActivities.length,
					activity_today_count: todayActivities.length,
					marker_type: getDealActivityStatus(deal).toLowerCase(),
				};

				getPdMetrics().trackUsage(null, 'deal_popover', 'opened', context);
			}}
			onActivitySaved={() => {
				dispatch(refreshDeal(deal.id));

				pipelineNoActivitiesCoachmark.close();
			}}
			onActivityMarkedAsDone={(activity: Pipedrive.Activity) => {
				refreshDeal(deal.id);
				trackActivityMarkedAsDone({ model: activity, action: 'marked_done' });
			}}
			onActivityIconClick={(activityType: string) => {
				getPdMetrics().trackUsage(null, 'activity_icon', 'clicked', {
					activity_type: activityType,
				});
			}}
			onError={() => {
				dispatch(addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE }));
			}}
			renderCustomEmptyActivities={() => {
				if (pipelineNoActivitiesCoachmark && pipelineNoActivitiesCoachmark.visible) {
					return (
						<Suspense fallback={<div />}>
							<EmptyActivitiesOnboardingLazy />
						</Suspense>
					);
				}

				return null;
			}}
		/>
	);
};

export default DealTileWrapper;

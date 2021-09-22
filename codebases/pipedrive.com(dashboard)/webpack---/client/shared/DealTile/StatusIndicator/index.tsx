import React from 'react';
import NoneSVG from './svg/None.svg';
import OverdueSVG from './svg/Overdue.svg';
import TodaySVG from './svg/Today.svg';
import UpcomingSVG from './svg/Upcoming.svg';
import ActivityPopover from '../ActivityPopover';
import getDealActivityStatus from '../../../utils/getDealActivityStatus';
import { StatusIndicatorContainer } from './StyledComponents';
import { ActivityStatusTypes } from '../../../utils/constants';
import { OnActivityPopoverOpenedParam } from '../ActivityPopover/ActivityContent';

export interface StatusIndicatorProps {
	deal: Pipedrive.Deal;
	dealTileSize: DealTileSizes;
	isClickable: boolean;
	popoverBoundariesElement?: HTMLElement;
	renderCustomEmptyActivities: () => React.ReactElement | null;
	onActivitySaved: () => void;
	onActivityPopoverOpened: (param: OnActivityPopoverOpenedParam) => void;
	onActivityMarkedAsDone: (activity: Pipedrive.Activity) => void;
	onActivityIconClick: (activityType: string) => void;
	onError: (error: Error) => void;
	isViewer?: boolean;
}

const StatusIndicator: React.FunctionComponent<StatusIndicatorProps> = (props) => {
	const {
		deal,
		dealTileSize,
		isClickable,
		popoverBoundariesElement,
		renderCustomEmptyActivities,
		onActivityPopoverOpened,
		onActivitySaved,
		onActivityMarkedAsDone,
		onActivityIconClick,
		onError,
		isViewer = false,
	} = props;
	const status = getDealActivityStatus(deal);

	return (
		<ActivityPopover
			deal={deal}
			disabled={!isClickable || isViewer}
			popoverBoundariesElement={popoverBoundariesElement}
			renderCustomEmptyActivities={renderCustomEmptyActivities}
			onActivityPopoverOpened={onActivityPopoverOpened}
			onActivitySaved={onActivitySaved}
			onActivityMarkedAsDone={onActivityMarkedAsDone}
			onActivityIconClick={onActivityIconClick}
			onError={onError}
		>
			{({ toggleActivitiesPopover, isVisible }) => (
				<StatusIndicatorContainer
					isClickable={isClickable}
					isActive={isVisible}
					onClick={() => {
						if (!isViewer) {
							toggleActivitiesPopover(deal);
						}
					}}
					dealTileSize={dealTileSize}
					data-test={`activity-status-indicator-${deal.id}`}
					data-status={status}
				>
					{status === ActivityStatusTypes.NONE && <NoneSVG />}
					{status === ActivityStatusTypes.OVERDUE && <OverdueSVG />}
					{status === ActivityStatusTypes.PLANNED && <UpcomingSVG />}
					{status === ActivityStatusTypes.TODAY && <TodaySVG />}
				</StatusIndicatorContainer>
			)}
		</ActivityPopover>
	);
};

export default StatusIndicator;

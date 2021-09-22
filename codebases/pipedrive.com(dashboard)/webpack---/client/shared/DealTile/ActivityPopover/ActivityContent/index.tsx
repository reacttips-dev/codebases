import React, { useEffect } from 'react';
import { ActivityStatusTypes } from '../../../../utils/constants';
import { isToday, isFuture, isOverdue } from '../../../../utils/dates';
import ActivityOption from '../ActivityOption';
import { Container, Activities, PopoverSeparator, ActivityCountPill } from './StyledComponents';
import { useTranslator } from '@pipedrive/react-utils';
import EmptyActivities from '../EmptyActivities';

export interface OnActivityPopoverOpenedParam {
	activities: Pipedrive.Activity[];
	overdueActivities: Pipedrive.Activity[];
	futureActivities: Pipedrive.Activity[];
	todayActivities: Pipedrive.Activity[];
}

export interface ActivityContentProps {
	activities: Pipedrive.Activity[];
	deal: Pipedrive.Deal;
	closePopover: () => void;
	renderCustomEmptyActivities: () => React.ReactElement | null;
	onActivityPopoverOpened: (param: OnActivityPopoverOpenedParam) => void;
	onActivitySaved: () => void;
	onActivityMarkedAsDone: (activity: Pipedrive.Activity) => void;
	onActivityIconClick: (activityType: string) => void;
	onError: (error: Error) => void;
}

const ActivityContent: React.FunctionComponent<ActivityContentProps> = (props) => {
	const {
		deal,
		activities,
		closePopover,
		renderCustomEmptyActivities,
		onActivityPopoverOpened,
		onActivitySaved,
		onActivityMarkedAsDone,
		onActivityIconClick,
		onError,
	} = props;
	const translator = useTranslator();

	const getFilteredActivities = () => {
		return activities.reduce(
			({ overdueActivities, todayActivities, futureActivities }, activity) => {
				const { due_date, due_time } = activity;

				if (isOverdue(due_date, due_time)) {
					overdueActivities.push(activity);
				} else if (isToday(due_date, due_time)) {
					todayActivities.push(activity);
				} else if (isFuture(due_date, due_time)) {
					futureActivities.push(activity);
				}

				return { overdueActivities, todayActivities, futureActivities };
			},
			{
				overdueActivities: [],
				todayActivities: [],
				futureActivities: [],
			},
		);
	};

	const { overdueActivities, todayActivities, futureActivities } = getFilteredActivities();

	useEffect(() => {
		onActivityPopoverOpened({
			activities,
			overdueActivities,
			todayActivities,
			futureActivities,
		});
	}, []);

	const renderActivitiesList = (activities: Pipedrive.Activity[], activityStatusType: ActivityStatusTypes) => {
		const ACTIVITY_STATUS_TYPE_TO_TITLE = {
			[ActivityStatusTypes.OVERDUE]: translator.gettext('overdue'),
			[ActivityStatusTypes.PLANNED]: translator.gettext('planned'),
			[ActivityStatusTypes.TODAY]: translator.gettext('today'),
		};

		return (
			<>
				{activities.length > 0 && (
					<PopoverSeparator type="block" sticky>
						{ACTIVITY_STATUS_TYPE_TO_TITLE[activityStatusType]}
						<ActivityCountPill color="white" size="s">
							{activities.length.toString()}
						</ActivityCountPill>
					</PopoverSeparator>
				)}
				{activities.length > 0 &&
					activities.map((activity: Pipedrive.Activity) => {
						return (
							<ActivityOption
								key={activity.id}
								deal={deal}
								activity={activity}
								activityStatusType={activityStatusType}
								closePopover={closePopover}
								onActivitySaved={onActivitySaved}
								onActivityMarkedAsDone={onActivityMarkedAsDone}
								onActivityIconClick={onActivityIconClick}
								onError={onError}
							/>
						);
					})}
			</>
		);
	};

	if (!activities.length) {
		return <EmptyActivities renderCustomEmptyActivities={renderCustomEmptyActivities} />;
	}

	return (
		<Container>
			<Activities>
				{renderActivitiesList(overdueActivities, ActivityStatusTypes.OVERDUE)}
				{renderActivitiesList(todayActivities, ActivityStatusTypes.TODAY)}
				{renderActivitiesList(futureActivities, ActivityStatusTypes.PLANNED)}
			</Activities>
		</Container>
	);
};

export default ActivityContent;

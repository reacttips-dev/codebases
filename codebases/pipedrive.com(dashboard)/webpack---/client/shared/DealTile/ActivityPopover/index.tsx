import { Dropmenu } from '@pipedrive/convention-ui-react';
import React, { useState } from 'react';
import { getActivitiesForDeal } from '../../api/index';
import ActivityContent, { OnActivityPopoverOpenedParam } from './ActivityContent';
import ActivityFooter from './ActivityFooter';
import ActivitiesLoader from './ActivitiesLoader';
import ErrorMessage from '../../ErrorMessage';

export interface OwnProps {
	disabled?: boolean;
	deal: Pipedrive.Deal;
	popoverBoundariesElement?: HTMLElement;
	renderCustomEmptyActivities: () => React.ReactElement | null;
	onActivityPopoverOpened: (param: OnActivityPopoverOpenedParam) => void;
	onActivitySaved: () => void;
	onActivityMarkedAsDone: (activity: Pipedrive.Activity) => void;
	onActivityIconClick: (activityType: string) => void;
	onError: (error: Error) => void;
	children: ({ toggleActivitiesPopover, isVisible }) => React.ReactNode;
}

export type ActivityPopoverProps = OwnProps;

const ActivityPopover: React.FunctionComponent<ActivityPopoverProps> = (props) => {
	const {
		deal,
		disabled,
		popoverBoundariesElement,
		renderCustomEmptyActivities,
		onActivityPopoverOpened,
		onActivitySaved,
		onActivityMarkedAsDone,
		onActivityIconClick,
		onError,
		children,
	} = props;
	const [activities, setActivities] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const [hasError, setHasError] = useState(false);

	const toggleActivitiesPopover = async (deal: Pipedrive.Deal) => {
		if (disabled) {
			return;
		}

		if (isVisible) {
			setActivities(null);
			setIsVisible(false);

			return;
		}

		setIsVisible(true);

		if (deal.activities_count === 0) {
			setActivities([]);

			return;
		}

		try {
			const activities = await getActivitiesForDeal(deal.id);

			setActivities(activities);
			setHasError(false);
		} catch (error) {
			setHasError(true);
		}
	};

	const closePopover = () => {
		setActivities(null);
		setIsVisible(false);
		setHasError(false);
	};

	const getDropMenuContent = () => {
		if (activities) {
			return (
				<ActivityContent
					activities={activities}
					deal={deal}
					closePopover={closePopover}
					renderCustomEmptyActivities={renderCustomEmptyActivities}
					onActivityPopoverOpened={onActivityPopoverOpened}
					onActivitySaved={onActivitySaved}
					onActivityMarkedAsDone={onActivityMarkedAsDone}
					onActivityIconClick={onActivityIconClick}
					onError={onError}
				/>
			);
		}

		if (hasError) {
			return <ErrorMessage hasFixedWidth />;
		}

		return <ActivitiesLoader />;
	};

	const popoverModifiers = popoverBoundariesElement
		? {
				preventOverflow: {
					enabled: true,
					padding: 20,
					boundariesElement: popoverBoundariesElement,
				},
		  }
		: {};

	return (
		<Dropmenu
			data-test="activity-dropmenu"
			content={getDropMenuContent()}
			popoverProps={{
				visible: isVisible,
				popperProps: {
					modifiers: popoverModifiers,
				},
				placement: 'right',
				arrow: false,
				spacing: 'none',
				innerRefProp: 'ref',
				onPopupVisibleChange: (visible: boolean) => {
					if (disabled) {
						return;
					}

					if (!visible) {
						setActivities(null);
						setHasError(false);
					}

					setIsVisible(visible);
				},
			}}
			footer={activities ? <ActivityFooter deal={deal} onActivitySaved={onActivitySaved} /> : false}
		>
			{children({ toggleActivitiesPopover, isVisible })}
		</Dropmenu>
	);
};

export default ActivityPopover;

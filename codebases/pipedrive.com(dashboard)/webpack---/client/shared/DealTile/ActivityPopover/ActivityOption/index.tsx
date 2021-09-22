import { Checkbox, Icon, Option } from '@pipedrive/convention-ui-react';
import React, { useState } from 'react';
import { updateActivity } from '../../../api/index';
import { getActivityIconKey } from '../../../../shared/api/webapp';
import { addNewActivityModal, editActivityModal } from '../../../../shared/api/webapp/modals';
import { useTranslator } from '@pipedrive/react-utils';
import { ActivityStatusTypes } from '../../../../utils/constants';
import { getFormattedDueDate } from '../../../../utils/getFormattedDueDate';
import {
	Container,
	ActivityWrapper,
	ActivityTooltip,
	ActivityDetails,
	ActivitySubject,
	ActivityMeta,
	ActivityNote,
	ActivityMetaContent,
} from './StyledComponents';

interface OwnProps {
	className?: string;
	deal: Pipedrive.Deal;
	activity: Pipedrive.Activity;
	activityStatusType: ActivityStatusTypes;
	closePopover: () => void;
	onActivitySaved: () => void;
	onActivityMarkedAsDone: (activity: Pipedrive.Activity) => void;
	onActivityIconClick: (activityType: string) => void;
	onError: (error: Error) => void;
}

export type ActivityOptionProps = OwnProps;

const ActivityOption: React.FunctionComponent<ActivityOptionProps> = (props) => {
	const [checked, setChecked] = useState(false);

	const {
		deal,
		activity,
		activityStatusType,
		className,
		closePopover,
		onActivitySaved,
		onActivityMarkedAsDone,
		onActivityIconClick,
		onError,
	} = props;

	const translator = useTranslator();
	const periodString = getFormattedDueDate(activity.due_date, activity.due_time, translator);

	const ACTIVITY_STATUS_TYPE = {
		[ActivityStatusTypes.OVERDUE]: 'overdue',
		[ActivityStatusTypes.PLANNED]: '',
		[ActivityStatusTypes.TODAY]: 'today',
	};

	const markActivityAsDone = async (evt: React.SyntheticEvent<HTMLInputElement>) => {
		evt.preventDefault();
		evt.stopPropagation();

		setChecked(true);

		try {
			const scheduleNextActivity = await updateActivity(activity.id, { done: true });

			if (scheduleNextActivity) {
				addNewActivityModal({
					dealId: deal.id,
					personId: deal.person_id,
					orgId: deal.org_id,
					// Changes the title to "Schedule follow-up activity"
					next: true,
				});

				onActivityMarkedAsDone(activity);
			}
		} catch (error) {
			onError(error);
		}
	};

	const trackIconClick = () => {
		onActivityIconClick(activity.type);
	};

	return (
		<Container>
			<Option
				className={className}
				onClick={(evt) => {
					// Ignore clicks on the checkbox as it has it's own onChange handler.
					// onClick is handled before onChange.

					// @ts-expect-error TODO: Would be more prudent to also check if `evt.target instanceof HTMLButtonElement`
					if (evt.target.tagName === 'svg' || evt.target.tagName === 'INPUT') {
						return;
					}

					closePopover();
					editActivityModal({ activity, onsave: onActivitySaved });
				}}
			>
				<ActivityWrapper
					data-test={`activity-option-${activity.id}`}
					data-status={activityStatusType}
					style={{ overflow: 'visible' }}
				>
					<ActivityTooltip
						placement="left"
						content={<div>{translator.gettext('Mark as done')}</div>}
						portalTo={document.body}
					>
						<Checkbox
							checked={checked}
							disabled={checked}
							data-test="mark-as-done"
							type="round"
							onChange={markActivityAsDone}
						/>
					</ActivityTooltip>
					<ActivityDetails>
						<ActivitySubject isChecked={checked}>{activity.subject}</ActivitySubject>
						<ActivityMeta>
							{
								<ActivityMetaContent status={ACTIVITY_STATUS_TYPE[activityStatusType]}>
									{periodString}
								</ActivityMetaContent>
							}
							{activity.owner_name && <span> &middot; {activity.owner_name}</span>}
						</ActivityMeta>
					</ActivityDetails>
					<Icon icon={`ac-${getActivityIconKey(activity.type)}`} onClick={trackIconClick} />
				</ActivityWrapper>

				{activity.note_clean && (
					<ActivityNote color="note-yellow" spacing="s" noMargin>
						{activity.note_clean}
					</ActivityNote>
				)}
			</Option>
		</Container>
	);
};

export default ActivityOption;

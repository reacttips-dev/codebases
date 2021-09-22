import { Activity } from 'Utils/graphql/activityRelayHelpers/types';
import { UpcomingActivity } from 'Types/types';

export const activityRecordToUpcoming = (activity: Activity): UpcomingActivity => {
	const dueTime = activity.getValue('dueTime');

	return {
		type: `${activity.getValue('type')}`,
		dueDate: `${activity.getValue('dueDate')}`,
		dueTime: dueTime ? `${dueTime}` : null,
	};
};

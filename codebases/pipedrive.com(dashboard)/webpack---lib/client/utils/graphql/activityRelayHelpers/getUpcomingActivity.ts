import { Activities, Activity } from './types';
import { sortActivities } from './sortActivities';

export const getUpcomingActivity = (activities: Activities): Activity | null => {
	const activityRecord = sortActivities(activities)[0];

	if (!activityRecord) {
		return null;
	}

	return activityRecord;
};

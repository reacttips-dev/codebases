import {
	injectActivityToLead,
	getPlannedActivities,
	setPlannedActivities,
	injectUpcomingActivity,
} from './injectActivityToLead';
import { getUpcomingActivity } from './getUpcomingActivity';
import { activityRecordToUpcoming } from './activityRecordToUpcoming';

export const activityRelayHelpers = {
	injectToLead: injectActivityToLead,
	getPlanned: getPlannedActivities,
	setPlanned: setPlannedActivities,
	getUpcoming: getUpcomingActivity,
	recordToUpcoming: activityRecordToUpcoming,
	injectUpcoming: injectUpcomingActivity,
};

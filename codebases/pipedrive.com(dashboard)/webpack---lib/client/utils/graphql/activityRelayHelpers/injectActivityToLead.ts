import { Lead, ActivitiesFilter, ActivitiesEnvelope, Activity, Activities } from './types';
import { mutate } from './mutate';

const getActivities = (lead: Lead, filters: ActivitiesFilter): ActivitiesEnvelope => {
	const list = (lead.getLinkedRecords('activities', filters) || []).filter((activity) => activity);

	return { list, filters };
};

const inject = (activities: ActivitiesEnvelope, { to }: { to: Lead }) =>
	to.setLinkedRecords(activities.list, 'activities', activities.filters);

type Props = {
	lead: Lead;
	activity: Activity;
};

const filters = {
	planned: {
		activityStatus: 'PLANNED',
	},
	done: {
		activityStatus: 'DONE',
	},
};

export const injectUpcomingActivity = (activity: Activity | undefined | null, { to }: { to: Lead }) =>
	activity ? to.setLinkedRecord(activity, 'upcomingActivity') : to.setValue(null, 'upcomingActivity');

export const getPlannedActivities = (lead: Lead) => getActivities(lead, filters.planned);

export const setPlannedActivities = (lead: Lead, activities: Activities) =>
	lead.setLinkedRecords(activities, 'activities', filters.planned);

export const injectActivityToLead = ({ lead, activity }: Props) => {
	const planned = getActivities(lead, filters.planned);
	const done = getActivities(lead, filters.done);

	mutate({ activity, planned, done });

	inject(planned, { to: lead });
	inject(done, { to: lead });

	injectUpcomingActivity(planned.list[0], { to: lead });

	return { lead, planned, done };
};

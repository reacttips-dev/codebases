import { Position, Status, Activity, Activities, ActivitiesEnvelope } from './types';
import { sortActivities } from './sortActivities';

const removeFromList = (activity: Activity, list: Activities) => {
	const activityIdx = list.indexOf(activity);

	if (activityIdx === -1) {
		return list;
	}

	list.splice(activityIdx, 1);
};

const addToList = (activity: Activity, list: Activities) => {
	if (list.indexOf(activity) > -1) {
		return;
	}

	list.push(activity);
};

const resort = (activities: ActivitiesEnvelope) => {
	sortActivities(activities.list);
};

type MoveOptions = {
	from: ActivitiesEnvelope;
	to: ActivitiesEnvelope;
};

const move = (activity: Activity, { from, to }: MoveOptions) => {
	removeFromList(activity, from.list);

	addToList(activity, to.list);

	sortActivities(to.list);
};

const add = (activity: Activity, { to }: { to: ActivitiesEnvelope }) => {
	addToList(activity, to.list);
	sortActivities(to.list);
};

type Options = {
	activity: Activity;
	planned: ActivitiesEnvelope;
	done: ActivitiesEnvelope;
};

type Mutators = { [P in Position]: { [S in Status]: (options: Options) => void } };

const mutators: Mutators = {
	// If incoming activity is already in PLANNED list
	[Position.Planned]: {
		// And is marked as PLANNED -> just resort list of PLANNED activities
		[Status.Planned]: ({ planned }) => resort(planned),

		// And IS marked as DONE -> move activity to DONE list and resort it
		[Status.Done]: ({ activity, planned, done }) => move(activity, { from: planned, to: done }),
	},

	// If incoming activity is already in DONE list
	[Position.Done]: {
		// And is marked as PLANNED -> move activity to PLANNED list and resort it
		[Status.Planned]: ({ activity, planned, done }) => move(activity, { from: done, to: planned }),

		// And IS marked as DONE -> just resort list of DONE activities
		[Status.Done]: ({ done }) => resort(done),
	},

	// If incoming activity is NEW - not in any list
	[Position.Nowhere]: {
		// And is marked as PLANNED -> add to PLANNED list and resort it
		[Status.Planned]: ({ activity, planned }) => add(activity, { to: planned }),

		// And IS marked as DONE -> add to DONE list and resort it
		[Status.Done]: ({ activity, done }) => add(activity, { to: done }),
	},
};

const getStatus = ({ activity }: Options) => {
	if (activity.getValue('isDone')) {
		return Status.Done;
	}

	return Status.Planned;
};

const getPosition = ({ activity, planned, done }: Options) => {
	const isInList = (activity: Activity, list: Activities) => list.indexOf(activity) > -1;

	const isInPlanned = isInList(activity, planned.list);
	const isInDone = isInList(activity, done.list);

	if (isInPlanned) {
		return Position.Planned;
	}

	if (isInDone) {
		return Position.Done;
	}

	return Position.Nowhere;
};

export const mutate = (options: Options) => {
	const position = getPosition(options);
	const status = getStatus(options);

	mutators[position][status](options);
};

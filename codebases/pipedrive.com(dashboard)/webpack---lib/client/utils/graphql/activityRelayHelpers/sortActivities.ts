import getUnixTime from 'date-fns/getUnixTime';

import { Activities } from './types';
import { getActivityTimestamp } from './getActivityTimestamp';

export const sortActivities = (activities: Activities) =>
	activities.sort((a, b) => {
		const timestampA = getUnixTime(getActivityTimestamp(a));
		const timestampB = getUnixTime(getActivityTimestamp(b));

		return timestampA - timestampB;
	});

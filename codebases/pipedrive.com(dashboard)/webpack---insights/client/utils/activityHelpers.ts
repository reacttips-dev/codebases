import { getAllActivityTypes } from '../api/webapp';

export const getActivityTypeIconKey = (activityTypeKey: string) => {
	const activityType = getAllActivityTypes().find(
		(activityType: any) => activityType.key_string === activityTypeKey,
	);

	return activityType?.icon_key;
};

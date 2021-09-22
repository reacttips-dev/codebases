import { GroupByField } from '../../../types/apollo-query-types';

const GROUP_BY_BLACKLIST = [
	'activeFlag',
	'startDatetime',
	'endDatetime',
	'referenceType',
	'dueTime',
	'duration',
];

const getActivitiesGroupByFields = (
	groupByFields: GroupByField[] = [],
): GroupByField[] => {
	return groupByFields.filter(
		(field) => !GROUP_BY_BLACKLIST.includes(field.name),
	);
};

export default getActivitiesGroupByFields;

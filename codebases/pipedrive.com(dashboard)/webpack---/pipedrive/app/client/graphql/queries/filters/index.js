export { getFilters, getFilter } from './query.gql';

export const availableTypes = {
	lead: 'leads',
	deal: 'deals',
	person: 'people',
	organization: 'org',
	activity: 'activity',
	product: 'products'
};

const toOld = ({ user, type = '', ...filter }) => {
	return {
		...filter,
		type: availableTypes[type.toLowerCase()],
		user_id: parseInt(user.id, 10)
	};
};

export const parseToOldFilter = (filter) => filter && toOld(filter);

export const parseToOldFilters = (filters) => filters && filters.map(toOld);

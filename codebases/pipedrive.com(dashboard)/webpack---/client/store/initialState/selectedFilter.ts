import { isTeamExists, isUserExists, getUserSetting } from '../../shared/api/webapp/index';
import { isNaN, find } from 'lodash';

export default function getSelectedFilter(
	pipelineId: number,
	filters: Pipedrive.Filter[],
	pathName: string = document.location.pathname,
) {
	const userFilter = parseFilterFromUrl(pathName) || getUserSetting(`filter_pipeline_${pipelineId}`);

	if (!userFilter || userFilter === 'all_users') {
		return getDefaultFilter();
	}

	const splittedUserFilter = userFilter.split('_');
	const type = splittedUserFilter[0];
	const value = parseInt(splittedUserFilter[1], 10);

	if (isInvalidFilter(type, value, filters)) {
		return getDefaultFilter();
	}

	return {
		type,
		value,
	};
}

function getDefaultFilter() {
	return {
		type: 'user',
		value: 'everyone',
	};
}

function parseFilterFromUrl(pathName: string): string | null {
	const filterParts = pathName.match(/\/(user|filter|team)\/(everyone|\d+)/);

	if (!filterParts || filterParts.length !== 3) {
		return null;
	}

	const type = filterParts[1];
	const value = filterParts[2];

	if (type === 'user' && value === 'everyone') {
		return 'all_users';
	}

	return `${type}_${value}`;
}

function isInvalidFilter(type: string, value: number, filters: Pipedrive.Filter[]) {
	const incorrectFilter = type === 'filter' && !isFilterExists(value, filters);
	const incorrectTeam = type === 'team' && !isTeamExists(value);
	const incorrectUser = type === 'user' && !isUserExists(value);
	const nonExistingFilter = incorrectFilter || incorrectTeam || incorrectUser;

	return !type || !value || isNaN(value) || nonExistingFilter;
}

function isFilterExists(filterId: number, filters: Pipedrive.Filter[]) {
	return !!find(filters, (filter) => filter.id === filterId);
}

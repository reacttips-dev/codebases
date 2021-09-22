import { includes } from 'lodash';
import { getCurrentUserId, getTeams } from '../shared/api/webapp';

type MatchingFiltersType = number[];

export default (
	matchingFilters: MatchingFiltersType = [],
	selectedFilter: Pipedrive.SelectedFilter,
	dealObj: Pipedrive.Deal,
) => {
	const currentFilterId = Number(selectedFilter.value);
	const currentFilterType = selectedFilter.type;
	const currentUserId = getCurrentUserId();

	if (currentFilterType === 'filter') {
		return includes(matchingFilters, currentFilterId);
	}

	if (currentFilterType === 'team' && dealObj.status === 'open') {
		const teamsArray = getTeams().toJSON();
		const currentTeam = teamsArray.find((team: Pipedrive.Team) => team.id === Number(selectedFilter.value));
		const currentTeamUsers = currentTeam.users;

		return includes(currentTeamUsers, currentUserId);
	}

	if (currentFilterType === 'user' && dealObj.status === 'open' && selectedFilter.value === 'everyone') {
		return true;
	}

	if (currentFilterType === 'user' && dealObj.status === 'open' && dealObj.user_id === currentFilterId) {
		return true;
	}

	return false;
};

export default function parseFilterToGetParameters(selectedFilter: Pipedrive.SelectedFilter): string {
	if (selectedFilter.value === 'everyone') {
		return '&everyone=1&status=open';
	}

	if (selectedFilter.type === 'user') {
		return `&user_id=${selectedFilter.value}&status=open`;
	}

	if (selectedFilter.type === 'team') {
		return `&team_id=${selectedFilter.value}&status=open`;
	}

	return `&filter_id=${selectedFilter.value}`;
}

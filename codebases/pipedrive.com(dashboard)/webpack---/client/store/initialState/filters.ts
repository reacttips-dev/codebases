import * as api from '../../api';

export default function extractFilters() {
	return api.getFilters().then(({ data: filters }) => (filters || []).map(pluckRelevantFilterFields));
}

function pluckRelevantFilterFields(filter: Pipedrive.Filter): Pipedrive.Filter {
	return {
		id: filter.id,
		value: filter.id,
		name: filter.name,
		visible_to: filter.visible_to,
		user_id: filter.user_id,
	};
}

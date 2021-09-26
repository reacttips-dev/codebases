export function getFilterFromUrl() {
	const path = document.location.pathname;
	const filterParts = path.match(/\/(user|filter|team)\/(everyone|\d+)/);

	if (filterParts && filterParts.length === 3) {
		return {
			type: filterParts[1],
			value: Number(filterParts[2]) || filterParts[2],
		};
	}

	return null;
}

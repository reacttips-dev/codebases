export const prioritizeDeal = (searchResult) => {
	if (!searchResult) {
		return [];
	}

	return searchResult.sort(
		(a, b) => b.result_score - a.result_score || (a.item.type === 'deal' ? -1 : 1),
	);
};

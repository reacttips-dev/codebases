export const getAvailableFilters = (
	allFilters: any[],
	appliedFilters: any[],
): any[] => {
	return allFilters.filter(
		(filter: any) =>
			!appliedFilters.find(
				(usedFilter) => usedFilter.filter === filter.filter,
			),
	);
};

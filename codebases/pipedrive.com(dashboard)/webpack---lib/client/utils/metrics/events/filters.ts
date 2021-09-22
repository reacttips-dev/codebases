type Filter = { id: string | undefined; name: string | undefined };

type FilterType = 'source' | 'labels';
type FilterName = 'source' | 'label';

const getValueCount = (numOfSelectedItems: number, numOfAllItems: number, filterName: FilterName) => {
	if (numOfSelectedItems === numOfAllItems) {
		return `all_${filterName}s`;
	}

	if (numOfSelectedItems === 1) {
		return `one_${filterName}`;
	}

	return `multiple_${filterName}s`;
};

const getFilterUsedData = (filterType: FilterType, valueCount: string, selectedItems: Filter[]) => ({
	component: 'filter',
	eventAction: 'used',
	eventData: {
		filter_type: filterType,
		filter_value_count: valueCount,
		filter_value_desc: selectedItems.map((item) => item.name),
		resolution: 'filter_selected',
	},
});

export const sourceFilterApplied = (selectedItems: Filter[], numOfAllItems: number) => {
	const valueCount = getValueCount(selectedItems.length, numOfAllItems, 'source');

	return getFilterUsedData('source', valueCount, selectedItems);
};

export const labelsFilterApplied = (selectedItems: Filter[], numOfAllItems: number) => {
	const valueCount = getValueCount(selectedItems.length, numOfAllItems, 'label');

	return getFilterUsedData('labels', valueCount, selectedItems);
};

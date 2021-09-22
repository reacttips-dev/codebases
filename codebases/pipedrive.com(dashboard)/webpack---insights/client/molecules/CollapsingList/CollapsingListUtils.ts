export const getVisibleListItemsCount = (
	listElementWidths: number[],
	listOuterWidth: number,
) => {
	let sumOfListElementWidths = 0;
	let itemCount: any;

	const MINIMUM_NUMBER_OF_LIST_ITEMS = 1;

	for (let index = 0; index < listElementWidths.length; index += 1) {
		const isExeedingWrapperWidth =
			sumOfListElementWidths + Math.floor(listElementWidths[index]) >
			Math.ceil(listOuterWidth);

		if (isExeedingWrapperWidth) {
			itemCount =
				index < MINIMUM_NUMBER_OF_LIST_ITEMS
					? MINIMUM_NUMBER_OF_LIST_ITEMS
					: index;

			break;
		}

		sumOfListElementWidths += Math.floor(listElementWidths[index]);
	}

	return itemCount;
};

export const getHiddenItems = (
	initialListItems: any[],
	visibleListItemsCount: number,
) => {
	return initialListItems.slice(
		visibleListItemsCount,
		initialListItems.length,
	);
};

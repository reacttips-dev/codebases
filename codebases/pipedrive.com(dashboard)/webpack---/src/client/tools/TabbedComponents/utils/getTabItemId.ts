function getTabItemId(itemData) {
	const itemOptions = itemData?.content?.componentOptions;

	return itemOptions?.id || itemOptions?.leadUuid || itemOptions?.activityId || null;
}

export default getTabItemId;

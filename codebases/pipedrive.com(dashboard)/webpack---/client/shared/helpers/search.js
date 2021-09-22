export function mapSearchResult(result) {
	const items = [...(result.items || []), ...(result.related_items || [])];

	return items.map((obj) => obj.item);
}

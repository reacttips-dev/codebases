export function getSortedMailTemplates(templates, templatesOrder) {
	return templates
		.map((t) => {
			const orderNumber = templatesOrder.indexOf(t.id);

			return {
				...t,
				order: orderNumber > -1 ? orderNumber : Infinity
			};
		})
		.sort((a, b) => a.order - b.order);
}

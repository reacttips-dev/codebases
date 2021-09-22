const parseGlobalMenuLink = (item) => {
    const { altCtaText, ctaText, eventType, eventId, seoText, url, query } = item;
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (ctaText && { ctaText })), (altCtaText && { altCtaText })), (eventType && { eventType })), (eventId && { eventId })), (seoText && { seoText })), (query && { query })), (url && { url }));
};
const parseMenuData = (data) => {
    if (!data) {
        return null;
    }
    const items = data.items &&
        data.items.map((item) => {
            return {
                event: parseGlobalMenuLink(item),
            };
        });
    return items ? {
        event: parseGlobalMenuLink(data),
        categories: items,
    } : null;
};
export default parseMenuData;
//# sourceMappingURL=menuDataParser.js.map
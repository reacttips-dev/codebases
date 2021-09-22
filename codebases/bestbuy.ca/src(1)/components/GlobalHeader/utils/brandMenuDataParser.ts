import getParsedEvent from "./getParsedEvent";
/**
 * parseBrandMenuData() will be depricated once the Brand Menu is connected
 * to the Global Menu API
 */
const parseBrandMenuData = (brandMenuContent) => {
    if (!brandMenuContent || !brandMenuContent.brandMenu) {
        return null;
    }
    const shopCategories = brandMenuContent.brandMenu.map((item) => {
        const event = Object.assign(Object.assign({}, getParsedEvent({
            ctaText: item.groupTitle,
            seoText: item.groupTitle,
        })), { eventId: null });
        let categories = [];
        (item.groupedElements || []).forEach((groupedElement) => {
            categories = [
                ...categories,
                ...(groupedElement.brands || []).map((brandEvent) => {
                    return {
                        event: getParsedEvent({
                            ctaText: brandEvent.ctaText,
                            seoText: brandEvent.ctaText,
                        }),
                    };
                }),
            ];
        });
        return {
            event,
            categories,
        };
    });
    return { categories: shopCategories };
};
export default parseBrandMenuData;
//# sourceMappingURL=brandMenuDataParser.js.map
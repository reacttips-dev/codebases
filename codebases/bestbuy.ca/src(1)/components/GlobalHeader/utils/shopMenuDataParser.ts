/**
 * parseShopMenuData() will be depricated once the Shop Menu is connected
 * to the Global Menu API
 */
const parseShopMenuData = (data) => {
    if (!data) {
        return null;
    }
    return {
        categories: data.shopCategories,
    };
};
export default parseShopMenuData;
//# sourceMappingURL=shopMenuDataParser.js.map
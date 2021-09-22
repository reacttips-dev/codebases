export default class CartPriceFormatter {
    constructor() {
        this.getPriceToDisplay = (showEhf, price, ehfAmount) => {
            return (showEhf && ehfAmount) ? price + ehfAmount : price;
        };
        this.needToDisplayEhf = (regionCode, displayEhfRegions) => {
            if (regionCode && displayEhfRegions) {
                return displayEhfRegions.indexOf(regionCode.toLocaleLowerCase()) >= 0 ||
                    displayEhfRegions.indexOf(regionCode.toLocaleUpperCase()) >= 0;
            }
            return false;
        };
    }
}
//# sourceMappingURL=CartPriceFormatter.js.map
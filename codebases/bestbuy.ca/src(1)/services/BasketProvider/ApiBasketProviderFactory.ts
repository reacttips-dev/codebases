import { cieUtilities } from "@bbyca/cie-webapp-utilities";
import ApiBasketProvider from "./ApiBasketProvider";
export default class ApiBasketProviderFactory {
    constructor(baseUrl) {
        this.isValidPostalCode = (postalCode) => {
            const re = new RegExp("^[A-Za-z][0-9][A-Za-z].*");
            return re.test(String(postalCode));
        };
        this.isValidRegionCode = (regionCode) => {
            const re = new RegExp("^[A-Za-z][A-Za-z]$");
            return re.test(String(regionCode));
        };
        this.baseUrl = baseUrl;
    }
    make(regionCode = "", postalCode = "", locale = "") {
        if (!this.isValidPostalCode(postalCode) || !this.isValidRegionCode(regionCode)) {
            postalCode = "M5G 2C3";
            regionCode = "ON";
        }
        return new ApiBasketProvider(this.baseUrl, postalCode, this.getAccessToken(), regionCode, locale);
    }
    getAccessToken() {
        const accessToken = cieUtilities.getAccessToken();
        if (accessToken) {
            return accessToken;
        }
        return null;
    }
}
//# sourceMappingURL=ApiBasketProviderFactory.js.map
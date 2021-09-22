import {HttpRequestType} from "errors";
import {DynamicContentModel, RegionCode} from "models";
import fetch from "utils/fetch";
import {BrandProvider} from "./";

export default class ApiBrandProvider implements BrandProvider {
    public langParam = "brand";

    constructor(private baseUrl: string, private locale: Locale, private regionCode: RegionCode) {
        if (this.locale === "fr-CA") {
            this.langParam = "marque";
        }
    }

    public async getBrandsContent(brandPath: string[]): Promise<DynamicContentModel> {
        const brandContentPath = brandPath.filter((brand) => brand !== undefined);
        const url =
            this.baseUrl +
            `path/${this.locale}/${this.langParam}/${brandContentPath.join("/")}?regioncode=${this.regionCode}`;
        const response = await fetch(url.toLowerCase(), HttpRequestType.BrandContentApi);
        const json = await response.json();
        return json;
    }
}

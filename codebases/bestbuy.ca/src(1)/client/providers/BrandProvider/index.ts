import {DynamicContentModel, RegionCode} from "models";
import ApiBrandProvider from "./ApiBrandProvider";

export interface BrandProvider {
    getBrandsContent(brandPath: Array<string | undefined>): Promise<DynamicContentModel>;
}

export function getBrandProvider(baseUrl: string, locale: Locale, regionCode: RegionCode): BrandProvider {
    return new ApiBrandProvider(baseUrl, locale, regionCode);
}

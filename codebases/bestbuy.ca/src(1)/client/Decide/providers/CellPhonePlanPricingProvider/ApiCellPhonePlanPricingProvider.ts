import {CellPhonePlanPricing, CellPhonePlanPricingApiResponse} from "models/CellPhonePlan";
import {HttpRequestType} from "errors";
import fetch from "utils/fetch";

import {CellPhonePlanPricingProvider} from ".";

export class ApiCellPhonePlanPricingProvider implements CellPhonePlanPricingProvider {
    constructor(private url: string) {}

    public async fetchCellPhonePlan(sku: string): Promise<CellPhonePlanPricing> {
        try {
            const plansUrl = this.url.replace("{skuId}", sku);
            const response = await fetch(plansUrl, HttpRequestType.CellPhonePlanApi);
            const cellPhonePlan: CellPhonePlanPricingApiResponse = await response.json();

            if (cellPhonePlan && Array.isArray(cellPhonePlan) && cellPhonePlan.length > 0) {
                return cellPhonePlan[0];
            }

            return Promise.reject("Malformed Mobile Pricing API response.");
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

import {format as urlFormat, parse as urlParse} from "url";

import fetch from "utils/fetch";
import {HttpRequestType} from "errors";
import {MediaApiResponse} from "models";

import {GetProductMediaParams, IApiMediaProvider} from ".";
import mediaCache from "./mediaCache";

export class ApiMediaProvider implements IApiMediaProvider {
    constructor(private apiGatewayEndpoint: string, private apiGatewayEndpointToken: string) {}

    public async getProductMedia<T>({
        sku,
        locale,
        normalizer,
    }: GetProductMediaParams<T>): Promise<T | MediaApiResponse> {
        if (!sku) {
            throw new Error("Sku is required");
        }

        if (!locale) {
            throw new Error("Locale is required");
        }

        const mediaApiUrl = this.apiGatewayEndpoint.concat(`products/${sku}/media`);
        const parsedMediaApiUrl = urlParse(mediaApiUrl, true);
        parsedMediaApiUrl.query = {
            lang: locale,
        };

        const headers = {
            headers: {
                Connection: "keep-alive",
                "BestBuy-Access-Token": this.apiGatewayEndpointToken,
            },
        };

        const formattedMediaApiUrl = urlFormat(parsedMediaApiUrl);
        const cacheKey = formattedMediaApiUrl;

        let json: MediaApiResponse;

        if (typeof window === "undefined") {
            const mediaData = mediaCache.get(cacheKey);
            if (mediaData) {
                json = mediaData;
            }
        }

        if (!json) {
            const response = await fetch(formattedMediaApiUrl, HttpRequestType.ProductMediaApi, headers);
            json = await response.json();
            if (typeof window === "undefined") {
                mediaCache.set(cacheKey, json);
            }
        }

        if (normalizer && typeof normalizer === "function") {
            return normalizer(json);
        }

        return json;
    }
}

export default ApiMediaProvider;

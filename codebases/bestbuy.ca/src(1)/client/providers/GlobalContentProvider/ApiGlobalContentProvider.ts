import * as url from "url";
import { HttpRequestType } from "errors";
import { GlobalContent } from "models";
import fetch from "utils/fetch";
import { GlobalContentProvider } from ".";
import globalContentCache from "./globalContentCache";
import getLogger from "../../../common/logging/getLogger";

export class ApiGlobalContentProvider implements GlobalContentProvider {
    public url: string;

    constructor(
        private baseUrl: string,
        private locale: Locale,
    ) {
        const notificationUrl = url.parse(url.resolve( this.baseUrl + "global", "" ), true);
        notificationUrl.query = {
            lang: this.locale,
        };

        this.url = url.format(notificationUrl).toLowerCase();
    }

    public async getGlobalContent(): Promise<GlobalContent> {
        try {
            const cacheKey = this.url;
            if (typeof window === "undefined") {
                const content: GlobalContent = globalContentCache.get(cacheKey);
                if (content) {
                    getLogger().info(`Cache HIT: ${cacheKey}`);
                    return content;
                }  else {
                    getLogger().info(`Cache MISS: ${cacheKey}`);
                }
            }

            const formattedUrl = url.format(this.url);
            const response = await fetch(formattedUrl, HttpRequestType.GlobalContentApi);
            const globalContent = await response.json();
            if (typeof window === "undefined") {
                globalContentCache.set(cacheKey, globalContent && globalContent.contexts);
            }
            return globalContent && globalContent.contexts;
        } catch {
            // do nothing
        }
    }
}

export default ApiGlobalContentProvider;

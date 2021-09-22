import {ShowcaseBannerType, SectionItemTypes, EventTypes} from "models";
import {MarketingContentProvider} from "./MarketingContentProvider";
import * as url from "url";
import {HttpRequestType} from "../../errors";
import fetch from "../../utils/fetch";

export class ApiShowcaseContentProvider implements MarketingContentProvider<ShowcaseBannerType> {
    constructor(private baseUrl: string, private locale: Locale, private regionCode: string, private sku: string) {}

    public async getContent() {
        const searchContentUrl = url.parse(`${this.baseUrl}/content`, true);
        searchContentUrl.query = {
            lang: this.locale,
            regionCode: this.regionCode,
            query: `skuLabels:${this.sku}`,
        };

        const formattedUrl = url.format(searchContentUrl);
        const response = await fetch(formattedUrl, HttpRequestType.SearchApi);
        const searchResult = await response.json();

        return this.mapSearchResultToShowcaseBannerContent(searchResult);
    }

    private mapSearchResultToShowcaseBannerContent(searchResult: any): ShowcaseBannerType {
        if (!searchResult.contents || !searchResult.contents.length) {
            return null;
        }
        const showcaseContentItems = (searchResult.contents as any[]).filter(
            (x) =>
                !!x.categories &&
                (x.categories.includes(showcaseCategory.en) || x.categories.includes(showcaseCategory.fr)),
        );

        if (!showcaseContentItems.length) {
            return null;
        }

        const showcaseContentItem = showcaseContentItems.reduce((prev, current) => {
            return prev.modifiedDate > current.modifiedDate ? prev : current;
        });

        return {
            title: showcaseContentItem.title,
            type: SectionItemTypes.showcaseBanner,
            event: {
                url: this.appendTrackingParameter(showcaseContentItem.url),
                eventType: EventTypes.externalUrl,
            },
            backgroundImage: {
                small: {
                    x1: showcaseContentItem.imageUrl,
                    x2: showcaseContentItem.imageUrl,
                    x3: showcaseContentItem.imageUrl,
                },
            },
        };
    }

    private appendTrackingParameter(blogLink: string) {
        if (!blogLink) {
            return null;
        }
        const queryParams = [`icmp=${trackingParameter}`];
        const blogUrl = url.parse(blogLink);
        if (blogUrl.query) {
            queryParams.unshift(blogUrl.query);
        }
        const urlWithoutQuery = blogLink.split("?")[0];
        return `${urlWithoutQuery}?${queryParams.join("&")}`;
    }
}

export const trackingParameter = "mdot_pdp_showcase_link";
export const showcaseCategory = {
    en: "bestbuy-showcase",
    fr: "en-vedette-chez-bestbuy",
};

export default ApiShowcaseContentProvider;

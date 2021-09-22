import {HttpRequestType} from "errors";
import fetch from "utils/fetch/";
import * as url from "url";
import {SectionImage, Theme} from "models";
import {LinkEventProps} from "@bbyca/apex-components";

export type PersonalizedItemTypes = "pencil-banner";

export interface ContentEntry {
    type: PersonalizedItemTypes;
    headline: string;
    subHeadline?: string;
    image?: SectionImage;
    event?: LinkEventProps;
    displayOptions: {
        theme: Theme;
    };
}

export interface PersonalizedContentProvider {
    getEntry(...args: any[]): Promise<ContentEntry>;
}

export class ApiPersonalizedContentProvider implements PersonalizedContentProvider {
    private static resourceType = "pers";

    private url: string;

    constructor(baseUrl: string, locale?: Locale, regionCode?: string, contentType?: string, entryId?: string) {
        let resourceLocation = contentType ? `${ApiPersonalizedContentProvider.resourceType}/${contentType}/` : ``;
        resourceLocation = resourceLocation && entryId ? `${resourceLocation}${entryId}` : resourceLocation;
        const tempUrl = url.parse(baseUrl + resourceLocation, true);
        tempUrl.query = {
            lang: locale,
        };

        if (regionCode) {
            tempUrl.query.regionCode = regionCode;
        }

        this.url = url.format(tempUrl).toLowerCase();
    }

    public async getEntry(): Promise<ContentEntry> {
        const apiUrl = url.format(this.url).toLowerCase();
        const res = await fetch(apiUrl, HttpRequestType.PersonalizedContentApi);
        const json = await res.json();
        return json;
    }
}

export default ApiPersonalizedContentProvider;

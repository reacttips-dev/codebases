import {HttpRequestType} from "errors";
import {HelpCategory, HelpHub, HelpLink, HelpTopic, HelpContent, RegionCode} from "models";
import fetch from "utils/fetch";
import {HelpProvider} from "./";

export default class ApiHelpProvider implements HelpProvider {
    constructor(private baseUrl: string, private locale: Locale, private regionCode: RegionCode) {}

    public async getHub(): Promise<HelpHub> {
        const url = this.baseUrl + `/?lang=${this.locale}&regioncode=${this.regionCode}`;
        const response = await fetch(url.toLowerCase(), HttpRequestType.HelpTopicApi);
        const json = await response.json();

        // renaming helpCategories to categories
        json.categories = json.helpCategories.map((category) => {
            const topics = category.topics.map((topic) => this.createHelpLink(topic));
            return {
                ...this.createHelpLink(category),
                topics,
            };
        });
        delete json.helpCategories;
        return json;
    }

    public async getCategory(categoryId: string): Promise<HelpCategory> {
        const url = this.baseUrl + `/categories/${categoryId}?lang=${this.locale}&regioncode=${this.regionCode}`;
        const response = await fetch(url.toLowerCase(), HttpRequestType.HelpTopicApi);
        const json = await response.json();
        return {
            ...json,
            topics: json.topics.map((topic) => this.createHelpLink(topic)),
        };
    }

    public async getTopic(categoryId: string, topicId: string): Promise<HelpTopic> {
        const url =
            this.baseUrl +
            `/categories/${categoryId}/topics/${topicId}?lang=${this.locale}&regioncode=${this.regionCode}`;
        const response = await fetch(url.toLowerCase(), HttpRequestType.HelpTopicApi);
        const json = await response.json();
        return json;
    }

    public async getSubTopic(categoryId: string, topicId: string, subTopicId: string): Promise<HelpContent> {
        const url =
            this.baseUrl +
            `/categories/${categoryId}/topics/${topicId}/subtopics/${subTopicId}?lang=${this.locale}&regioncode=${this.regionCode}`;
        const response = await fetch(url.toLowerCase(), HttpRequestType.HelpTopicApi);
        const json = await response.json();
        return json;
    }

    private createHelpLink(serverLink: any): HelpLink {
        const [, , , categoryId, , topicId] = serverLink.path && serverLink.path.split("/");
        const helpLink: HelpLink = {
            ...serverLink,
            categoryId,
        };

        if (!topicId) {
            return helpLink;
        }

        return {
            ...helpLink,
            topicId,
        };
    }
}

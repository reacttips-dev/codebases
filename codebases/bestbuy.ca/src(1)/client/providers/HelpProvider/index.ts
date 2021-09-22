import {HelpCategory, HelpHub, HelpTopic, HelpContent, RegionCode} from "models";
import ApiHelpProvider from "providers/HelpProvider/ApiHelpProvider";

export interface HelpProvider {
    getHub(): Promise<HelpHub>;
    getCategory(categoryId: string): Promise<HelpCategory>;
    getTopic(categoryId: string, topicId: string): Promise<HelpTopic>;
    getSubTopic(categoryId: string, topicId: string, subTopicId: string): Promise<HelpContent>;
}

export function getHelpProvider(baseUrl: string, locale: Locale, regionCode: RegionCode): HelpProvider {
    return new ApiHelpProvider(baseUrl, locale, regionCode);
}

import { i18nFilter } from "../../../../../../app/filters/ngFilters";
import { AssetsService } from "../../../../../../app/services/AssetsService";
import { IModalConfig } from "../unlockModalConfig";

export interface ITrackModalConfigTypes {
    CustomDashboards: "CustomDashboards";
    NewsFeed: "NewsFeed";
}

export const TrackUnlockModalConfig = (): {
    [D in keyof ITrackModalConfigTypes]: IModalConfig<D>;
} => ({
    CustomDashboards: {
        slides: {
            CustomDashboards: {
                img: AssetsService.assetUrl("/images/unlock-modal/custom-dashboards.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/custom-dashboards-2x.jpg"),
                title: i18nFilter()("hook_unlock.custom_dashboards.title"),
                subtitle: i18nFilter()("hook_unlock.custom_dashboards.subtitle"),
                text: i18nFilter()("hook_unlock.custom_dashboards.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.custom_dashboards.cta_text"),
        label: "Custom Dashboards",
    },
    NewsFeed: {
        slides: {
            NewsFeed: {
                img: AssetsService.assetUrl("/images/unlock-modal/news-feed.jpg"),
                img2x: AssetsService.assetUrl("/images/unlock-modal/news-feed-2x.jpg"),
                title: i18nFilter()("hook_unlock.news_feed.title"),
                subtitle: i18nFilter()("hook_unlock.news_feed.subtitle"),
                text: i18nFilter()("hook_unlock.news_feed.text"),
            },
        },
        ctaText: i18nFilter()("hook_unlock.news_feed.cta_text"),
        label: "News Feed",
    },
});

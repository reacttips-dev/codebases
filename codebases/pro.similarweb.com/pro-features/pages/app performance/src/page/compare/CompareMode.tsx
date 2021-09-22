import React from "react";
import WithAllContexts from "../../common components/WithAllContexts";
import HeaderWithLink from "./links section/HeaderWithLink";
import { TablesContainer } from "./StyledComponents";
import TableBox from "./TableBox/TableBox";
import { categoryColumns, overallColumns } from "./TableBox/tableColumns";
import * as _ from "lodash";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

type CompareModeType = {
    loading: boolean;
    data: any;
    hideStoreSection: boolean;
};

const CompareMode: React.FC<CompareModeType> = ({ loading, data, hideStoreSection }) => (
    <WithAllContexts>
        {({ translate, track, getLink, filters, swNavigator }) => {
            const appIds = `${
                filters.store.toLowerCase() === "google" ? "0" : "1"
            }_${filters.appsInfo.map((app) => app.id).join(",")}`;
            const trackUsage = () =>
                track("internal link", "click", "Usage/Engagement Overview/Compare Link");
            const trackDownloads = () =>
                track("internal link", "click", "Downloads/Engagement Overview/Compare Link");
            const trackAudience = () =>
                track(
                    "internal link",
                    "click",
                    "Audience Interests/Audience Interests/Compare Link",
                );
            const store = filters.store.toLowerCase();
            let category = filters.appsInfo[0].category;
            category = category ? category.replace("/", ">") : "";

            let stateAppLeaderboard = "appcategory-leaderboard";
            let stateAppEngagement = "apps-engagementoverview";
            let stateAppInterest = "apps-appaudienceinterests";

            if (isSalesIntelligenceAppsState(swNavigator)) {
                stateAppLeaderboard = "salesIntelligence-appcategory-leaderboard";
                stateAppEngagement = "salesIntelligence-apps-engagementoverview";
                stateAppInterest = "salesIntelligence-apps-appaudienceinterests";
            }

            const subtitleFilters = [
                {
                    filter: "country",
                    countryCode: filters.country,
                    value: filters.countryName,
                    href: getLink(stateAppLeaderboard, {
                        country: filters.country,
                        category: "All",
                        store: _.capitalize(filters.store),
                        device:
                            filters.store.toLowerCase() === "google" ? "AndroidPhone" : "iPhone",
                        mode: "Top Free",
                    }),
                },
            ];

            const categorySubtitleFilters = [
                {
                    filter: "text",
                    value: category,
                    href: getLink(stateAppLeaderboard, {
                        country: filters.country,
                        category,
                        store: _.capitalize(filters.store),
                        device:
                            filters.store.toLowerCase() === "google" ? "AndroidPhone" : "iPhone",
                        mode: "Top Free",
                    }),
                },
            ];
            return [
                hideStoreSection ? null : (
                    <TablesContainer key="tables">
                        <TableBox
                            loading={loading}
                            data={data.overall}
                            columns={overallColumns}
                            title={translate("app.performance.storeintel.overallrank.title")}
                            tooltip={translate("app.performance.storeintel.overallrank.tooltip")}
                            subtitleFilters={subtitleFilters}
                        />
                        <TableBox
                            loading={loading}
                            data={data.category}
                            columns={categoryColumns}
                            title={translate("app.performance.storeintel.categoryrank.title")}
                            tooltip={translate("app.performance.storeintel.categoryrank.tooltip")}
                            subtitleFilters={categorySubtitleFilters}
                        />
                    </TablesContainer>
                ),
                <HeaderWithLink
                    key="hl1"
                    title={translate("app.performance.downloads.title")}
                    tooltip={translate("app.performance.downloads.tooltip")}
                    subtitleFilters={subtitleFilters}
                    onTrack={trackDownloads}
                    href={getLink(stateAppEngagement, {
                        appId: appIds,
                        country: filters.country,
                        duration: "3m",
                        tab: "Downloads",
                        dataMode: "Number",
                    })}
                />,

                <HeaderWithLink
                    key="hl2"
                    title={translate("app.performance.usage.title")}
                    tooltip={translate("app.performance.usagesection.tooltip")}
                    subtitleFilters={subtitleFilters}
                    onTrack={trackUsage}
                    href={getLink("apps-engagementoverview", {
                        appId: appIds,
                        country: filters.country,
                        duration: "3m",
                        tab: "UsageTime",
                        dataMode: "Number",
                    })}
                />,
                store === "google" && (
                    <HeaderWithLink
                        key="hl3"
                        title={translate("app.performance.audience.title")}
                        tooltip={translate("app.performance.audience.tooltip")}
                        subtitleFilters={subtitleFilters}
                        onTrack={trackAudience}
                        href={getLink(stateAppInterest, {
                            appId: appIds,
                            country: filters.country,
                            duration: "1m",
                        })}
                    />
                ),
            ];
        }}
    </WithAllContexts>
);

CompareMode.defaultProps = {
    data: {
        overall: undefined,
        category: undefined,
    },
};

CompareMode.displayName = "CompareMode";
export default CompareMode;

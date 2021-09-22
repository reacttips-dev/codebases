import * as React from "react";
import WithAllContexts from "../../../common components/WithAllContexts";
import Rank from "./Rank";
import * as _ from "lodash";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

const gradientProps = {
    stop1Color: "rgba(255, 206, 66, 0.2)",
    stop2Color: "rgba(255, 248, 218, 0.2)",
    fillColor: "#fad15d",
};

const OverallRank: any = (props) => (
    <WithAllContexts>
        {({ translate, track, filters, getLink, swNavigator }) => {
            const state = isSalesIntelligenceAppsState(swNavigator)
                ? "salesIntelligence-appcategory-leaderboard"
                : "appcategory-leaderboard";

            const subtitleFilters = [
                {
                    filter: "country",
                    countryCode: filters.country,
                    value: filters.countryName,
                    href: getLink(state, {
                        category: "All",
                        country: filters.country,
                        store: _.capitalize(filters.store),
                        device:
                            filters.store.toLowerCase() === "google" ? "AndroidPhone" : "iPhone",
                        mode: "Top Free",
                    }),
                    target: "_self",
                    onClick: () =>
                        track(
                            "internal link",
                            `OverallRank/appcategory-leaderboard/subtitle`,
                            "click",
                        ),
                },
            ];
            return (
                <Rank
                    {...props}
                    gradientProps={gradientProps}
                    title={translate("app.performance.storeintel.overallrank.title")}
                    tooltip={translate("app.performance.storeintel.overallrank.tooltip")}
                    subtitleFilters={subtitleFilters}
                />
            );
        }}
    </WithAllContexts>
);
export default OverallRank;

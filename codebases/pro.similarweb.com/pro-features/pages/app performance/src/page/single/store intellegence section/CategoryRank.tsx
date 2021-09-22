import * as _ from "lodash";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";
import * as React from "react";
import WithAllContexts from "../../../common components/WithAllContexts";
import Rank from "./Rank";

const gradientProps = {
    stop1Color: "rgba(56, 190, 214, 0.15)",
    stop2Color: "rgba(105, 224, 237, 0.05)",
    fillColor: "#38bed6",
};

const CategoryRank: any = (props) => (
    <WithAllContexts>
        {({ translate, track, filters, getLink, swNavigator }) => {
            const state = isSalesIntelligenceAppsState(swNavigator)
                ? "salesIntelligence-appcategory-leaderboard"
                : "appcategory-leaderboard";

            const { appsInfo } = filters;
            let [{ category }] = appsInfo;
            category = category ? category.replace(/\s*[~/]\s*/g, " > ") : "";
            const subtitleFilters = [
                {
                    value: category,
                    href: getLink(state, {
                        category,
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
                            `CategoryRank/appcategory-leaderboard/subtitle`,
                            "click",
                        ),
                },
            ];
            return (
                <Rank
                    {...props}
                    gradientProps={gradientProps}
                    title={translate("app.performance.storeintel.categoryrank.title")}
                    tooltip={translate("app.performance.storeintel.categoryrank.tooltip")}
                    subtitleFilters={subtitleFilters}
                />
            );
        }}
    </WithAllContexts>
);
export default CategoryRank;

import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { BoxStates, getTitleUrl, resourcesNames, trackEvents } from "../../pageDefaults";
import { FailedBox } from "../FailedBox";
import { LoadingBox } from "../LoadingBox";
import { ReadyBox } from "../ReadyBox";
import { Settings } from "./Settings";

export const TrendingApps: StatelessComponent<any> = (props) => {
    switch (props.state) {
        case BoxStates.LOADING:
            return <LoadingBox resourceName={resourcesNames.trendingApps} />;
        case BoxStates.READY:
            return <ReadyBox {...props} {...getHeaderProps(props)} />;
        case BoxStates.FAILED:
            return (
                <FailedBox
                    {...props}
                    {...getHeaderProps(props)}
                    error="something.went.wrong.error.message"
                />
            );
        case BoxStates.EMPTY:
            return (
                <FailedBox
                    {...props}
                    {...getHeaderProps(props)}
                    error="global.nodata.notavilable"
                />
            );
        case BoxStates.SETTINGS:
            return <Settings {...props} {...getHeaderProps(props)} />;
    }
};

const getHeaderProps = (props) => {
    const resourceName = resourcesNames.trendingApps;
    const title = {
        ...titleProps,
        titleUrl: getTitleUrl("appcategory-leaderboard", props.filters),
    };

    return {
        tooltip: { tooltipText: "research.homepage.trendingapps.tooltip" },
        subtitle: `${i18nFilter()("common.country." + props.filters.country)} • ${
            props.filters.store
        } • ${i18nCategoryFilter()(props.filters.category)}`,
        resourceName,
        title,
    };
};

const titleProps = {
    titleText: "research.homepage.trendingapps.title",
    titleClick: () =>
        trackEvents(resourcesNames.trendingApps, "Internal Link", "click", "App Category Analysis"),
};

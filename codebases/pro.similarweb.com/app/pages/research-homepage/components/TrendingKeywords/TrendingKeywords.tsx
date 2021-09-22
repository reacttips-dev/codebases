import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import { BoxStates, getTitleUrl, resourcesNames, trackEvents } from "../../pageDefaults";
import { FailedBox } from "../FailedBox";
import { LoadingBox } from "../LoadingBox";
import { ReadyBox } from "../ReadyBox";
import { Settings } from "./Settings";

export const TrendingKeywords: StatelessComponent<any> = (props) => {
    switch (props.state) {
        case BoxStates.LOADING:
            return <LoadingBox resourceName={resourcesNames.trendingKeywords} />;
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
    const resourceName = resourcesNames.trendingKeywords;
    const title = {
        ...titleProps,
        titleUrl: getTitleUrl("findkeywords_byindustry_TopKeywords", props.filters),
    };

    return {
        tooltip: { tooltipText: "research.homepage.trendingkeywords.tooltip" },
        subtitle: `${i18nFilter()(
            "common.country." + props.filters.country,
        )} • ${i18nCategoryFilter()(props.filters.category)}`,
        resourceName,
        title,
    };
};

const titleProps = {
    titleText: "research.homepage.trendingkeywords.title",
    titleClick: () =>
        trackEvents(resourcesNames.trendingKeywords, "Internal Link", "click", "Industry Analysis"),
};

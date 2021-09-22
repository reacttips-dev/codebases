import { i18nFilter } from "filters/ngFilters";
import {
    IconWrapper,
    StyledIcon,
    CardHeader,
    CardContentBody,
    BoldText,
    InsightCardContainer,
    CTA,
} from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/StyledComponents";
import { searchTrafficGraphTabsConfig } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/Helpers/SearchOverviewGraphConfig";
import { defaultInsightsProps } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/MD";
import {
    EInsightTypes,
    IInsightLayout,
} from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/typesAndConstants";
import { getInsightType } from "pages/website-analysis/traffic-sources/search/tabs/SearchOverviewGraph/SearchTrafficInsights/utilities";
import React, { useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { InsightHeaderStyled } from "./StyledComponents";
import I18n from "components/React/Filters/I18n";
import ReactDOMServer from "react-dom/server";

const InsightHeader = ({ headerColor, headerKey, headerIcon, isRotate, isDecrease }) => {
    return (
        <>
            <CardHeader>
                <IconWrapper>
                    <StyledIcon
                        isRotate={isRotate}
                        size="xs"
                        isDecrease={isDecrease}
                        iconName={headerIcon}
                        fill={headerColor}
                    />
                </IconWrapper>
                <InsightHeaderStyled color={headerColor}>
                    {i18nFilter()(headerKey)}
                </InsightHeaderStyled>
            </CardHeader>
        </>
    );
};

const InsightBody = ({
    bodyKey,
    value,
    formatter,
    lastDataPoint,
    getValue,
    displayName,
    granularity,
    themeColor,
}) => {
    const displayValue = formatter(getValue ? getValue(value, lastDataPoint.y) : value);
    const replacementObject = {
        prefix: ReactDOMServer.renderToString(<BoldText>{i18nFilter()(displayName)}</BoldText>),
        amount: ReactDOMServer.renderToString(
            <span style={{ color: themeColor }}>{displayValue}</span>,
        ),
        month: lastDataPoint.x.format("MMM"),
        week: lastDataPoint.x.format("MMM DD, YYYY"),
    };
    return (
        <CardContentBody>
            <I18n dataObj={replacementObject} dangerouslySetInnerHTML={true}>
                {bodyKey(granularity)}
            </I18n>
        </CardContentBody>
    );
};

const InsightCallToAction = () => <CTA>{i18nFilter()("search.overview.insights.view.trend")}</CTA>;

export const Insight: React.FunctionComponent<IInsightLayout> = (props) => {
    const {
        value,
        isNewChannel,
        isPeriodOverPeriodAboveThreshold,
        isPeriodOverPeriodOverPeriodAboveThreshold,
        getInsightProps,
        selectedTabOnClick,
        selectedCategoryOnClick,
        setTab,
        setCategory,
        setLegends,
        unSelectedLegend,
        selectedLegend,
        insightId,
        selectedInsightId,
        setSelectedInsightId,
        displayName,
        formatter,
        getValue,
        lastDataPoint,
        granularity,
        setGranularity,
        isVisited,
    } = props;
    const insightType = getInsightType(
        isNewChannel,
        isPeriodOverPeriodAboveThreshold,
        isPeriodOverPeriodOverPeriodAboveThreshold,
        value,
    );
    const isDecrease = false;
    const isRotate = false;
    const { headerColor, headerKey, bodyKey, headerIcon } = getInsightProps
        ? getInsightProps(insightType)
        : defaultInsightsProps[insightType];

    const onInsightClick = () => {
        if (!isNaN(selectedTabOnClick)) {
            const tabIndex = searchTrafficGraphTabsConfig.findIndex(
                ({ identifier }) => identifier === selectedTabOnClick,
            );
            setTab(tabIndex);
        }
        selectedCategoryOnClick && setCategory(selectedCategoryOnClick);
        if (unSelectedLegend) {
            const unSelectedLegendObject = {
                rawName: unSelectedLegend,
                visible: true,
            };
            setLegends(unSelectedLegendObject);
        }
        if (selectedLegend) {
            const selectedLegendObject = {
                rawName: selectedLegend,
                visible: false,
            };
            setLegends(selectedLegendObject);
        }
        setGranularity(granularity);
        setSelectedInsightId(insightId);
        TrackWithGuidService.trackWithGuid("search.overview.insights.click", "click", {
            insightType: EInsightTypes[insightType],
            channel: i18nFilter()(props.displayName),
        });
    };
    return (
        <>
            <InsightCardContainer
                onClick={onInsightClick}
                isClicked={insightId === selectedInsightId}
                isVisited={isVisited}
            >
                <InsightHeader
                    headerColor={headerColor}
                    headerIcon={headerIcon}
                    headerKey={headerKey}
                    isDecrease={isDecrease}
                    isRotate={isRotate}
                />
                <InsightBody
                    value={value}
                    displayName={displayName}
                    bodyKey={bodyKey}
                    formatter={formatter}
                    getValue={getValue}
                    lastDataPoint={lastDataPoint}
                    granularity={granularity}
                    themeColor={headerColor}
                />
                <InsightCallToAction />
            </InsightCardContainer>
        </>
    );
};

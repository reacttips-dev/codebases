import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { AssetsService } from "services/AssetsService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    ColLoader,
    GridContainer,
    LoaderContainer,
    MetricTitleText,
    NoDataContainer,
    NoDataIcon,
    NoDataSubTitle,
    NoDataTitle,
    SeeMoreButton,
    SeeMoreContainer,
    SubTitleContainer,
    Text,
} from "../StyledComponents";

export const MetricTitle = ({ tooltip, headline, fontSize }) => {
    return (
        <BoxTitle tooltip={tooltip}>
            <MetricTitleText fontSize={fontSize}>{headline}</MetricTitleText>
        </BoxTitle>
    );
};
MetricTitle.defaultProps = {
    tooltip: undefined,
    fontSize: 20,
};

export const KeywordMetricsSubTitle = ({ subtitle = "", webSource = "none" }) => {
    const subtitleFilters = {
        all: [
            {
                filter: "webSource",
                value: "Total",
            },
        ],
        Desktop: [
            {
                filter: "webSource",
                value: "desktop",
            },
        ],
        MobileWeb: [
            {
                filter: "webSource",
                value: "MobileWeb",
            },
        ],
        Total: [
            {
                filter: "webSource",
                value: "Total",
            },
        ],
    };
    return (
        <SubTitleContainer>
            <Text opacity={1}>{subtitle}</Text>&nbsp;
            {subtitleFilters[webSource] && (
                <Text opacity={1}>
                    <BoxSubtitle filters={subtitleFilters[webSource]} />
                </Text>
            )}
        </SubTitleContainer>
    );
};

export const NoData = ({
    noDataTitleKey,
    noDataSubTitleKey,
    paddingTop,
    paddingBottom,
    className = "",
}) => {
    const i18n = i18nFilter();
    return (
        <NoDataContainer
            className={className}
            paddingTop={paddingTop}
            paddingBottom={paddingBottom}
        >
            <img
                src={AssetsService.assetUrl("/images/no-data-new.svg")}
                style={{ height: "96px", width: "190px" }}
            />
            <NoDataTitle>{i18n(noDataTitleKey)}</NoDataTitle>
            <NoDataSubTitle>{i18n(noDataSubTitleKey)}</NoDataSubTitle>
        </NoDataContainer>
    );
};

NoData.defaultProps = {
    noDataTitleKey: "keyword.analysis.overview.nodata",
    noDataSubTitleKey: "keyword.analysis.overview.nodata.subtitle",
    paddingTop: 0,
    paddingBottom: 0,
};

SWReactRootComponent(NoData, "NoData");

export const TableLoader: any = ({
    rowsAmount = 6,
    columnsAmount = 2,
    cellHeight = 12,
    isBorder = true,
    isCenter = false,
    cellWidth = "30%",
}) => (
    <LoaderContainer>
        {[...Array(rowsAmount)].map((x, i) => (
            <GridContainer key={i} isFirst={i === 0 || !isBorder} isCenter={isCenter}>
                {[...Array(columnsAmount)].map((y, j, items) => (
                    <ColLoader key={j} isLast={j === items.length - 1} width={cellWidth}>
                        <PixelPlaceholderLoader width={"100%"} height={cellHeight} />
                    </ColLoader>
                ))}
            </GridContainer>
        ))}
    </LoaderContainer>
);
export const SeeMore = ({
    children,
    componentName,
    innerLink,
    guidName = "keywords.overview.page.see.more",
    textAlign = "center",
}) => {
    const onClick = (componentName) => {
        TrackWithGuidService.trackWithGuid(guidName, "click", { componentName });
    };
    return (
        <SeeMoreContainer textAlign={textAlign} onClick={() => onClick(componentName)}>
            <a href={innerLink} target="_self">
                <SeeMoreButton type="flat">{children}</SeeMoreButton>
            </a>
        </SeeMoreContainer>
    );
};

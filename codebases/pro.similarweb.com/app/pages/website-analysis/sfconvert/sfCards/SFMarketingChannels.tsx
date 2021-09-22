import { colorsPalettes } from "@similarweb/styles";
import { Type } from "@similarweb/ui-components/dist/item-icon";
import Chart from "components/Chart/src/Chart";
import { ClosableItemColorMarker } from "components/compare/StyledComponent";
import { StyledItemIcon } from "components/core cells/src/CoreRecentCell/StyledComponents";
import { commonWebSources } from "components/filters-bar/utils";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { CHART_COLORS } from "constants/ChartColors";
import { categoryIconFilter, i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { SfCardWrapper } from "pages/website-analysis/sfconvert/sfCards/SfCardWrapper";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import { SfCardLoader } from "pages/website-analysis/sfconvert/components/SfCardLoader";
import React, { useContext, useEffect, useMemo, useState } from "react";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { trafficSources } from "Shared/utils";
import { FlexColumn, FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

const fetchService = DefaultFetchService.getInstance();

function getTotalVisits(obj) {
    return Object.values(obj).reduce((total: number, val: number) => {
        return total + (isNaN(val) ? 0 : val);
    }, 0);
}

function toPercents(dataObject) {
    const { totalVisits, ...channels } = dataObject;
    return _.fromPairs(
        Object.entries(channels).map(([channel, value]: [string, number]) => [
            channel,
            totalVisits > 0 ? 100 * (value / totalVisits) : 0,
        ]),
    );
}

function getCategories(siteData, industryData) {
    const categories = Object.keys({ ...siteData, ...industryData });
    return Object.entries(trafficSources)
        .filter(([name]) => categories.some((source) => name === source))
        .map(([_, { title }]) => i18nFilter()(title));
}

const formatCategoryName = (category) =>
    category.split(/[$/]/).slice(-1)[0].split("_").map(_.capitalize).join(" ");

function prepareGraphData([[site, siteData], [industry, industryData]]) {
    const getMapper = (isSite) => ([channel, value]) => {
        const color = isSite
            ? CHART_COLORS.trafficSourcesColorsBySourceMMX[channel]
            : colorsPalettes.carbon[50];
        return {
            key: channel,
            y: value,
            color,
            pointTooltipColor: isSite ? color : "gray",
        };
    };

    const sortFn = ({ key }, { key: key2 }) =>
        trafficSources[key].priority - trafficSources[key2].priority;

    const prepareData = (data, isSite) => {
        return Object.entries(toPercents(data)).map(getMapper(isSite)).sort(sortFn);
    };

    return {
        data: [
            { name: site, data: siteData ? prepareData(siteData, true) : [] },
            {
                name: formatCategoryName(industry),
                data: industryData ? prepareData(industryData, false) : [],
                id: industry,
                isCategorySeries: true,
                grouping: false,
                zIndex: -1,
                pointWidth: 41,
                dataLabels: {
                    enabled: false,
                },
            },
        ],
        categories: getCategories(siteData, industryData),
    };
}

function Graph({ data, categories }) {
    return (
        <Chart
            type={"column"}
            data={data}
            config={{
                title: {
                    text: null,
                },
                chart: {
                    height: 220,
                    margin: [20, 0, 40, 40],
                    spacing: [10, 0, 0, 0],
                    type: "column",
                    borderColor: "#FFFFFF",
                    style: {
                        fontFamily: "Arial",
                        fontSize: "11px",
                    },
                    animation: true,
                    events: {},
                },
                credits: {
                    enabled: false,
                },
                xAxis: {
                    categories,
                    lineColor: "#e4e4e4",
                    gridLineColor: "#e4e4e4",
                    tickWidth: 0,
                    labels: {
                        align: "center",
                        rotation: 0,
                        useHTML: false,
                        style: {
                            fontSize: window.innerWidth <= 450 ? "11px" : "12px",
                            textAlign: "center",
                            textOverflow: "none",
                            fontFamily: '"Roboto", sans-serif',
                        },
                    },
                },
                yAxis: {
                    gridLineColor: "#e4e4e4",
                    min: 0,
                    max: 100,
                    startOnTick: false,
                    endOnTick: true,
                    title: null,
                    opposite: false,
                    showLastLabel: true,
                    labels: {
                        align: "right",
                        enabled: true,
                        format: "{value}%",
                        x: -10,
                        style: {
                            fontSize: "12px",
                            textTransform: "uppercase",
                            fontFamily: '"Roboto", sans-serif',
                            color: "#aaa",
                        },
                    },
                },
                legend: {
                    enabled: false,
                    floating: false,
                    useHTML: false,
                    align: "left",
                    borderRadius: 0,
                    borderWidth: 0,
                    verticalAlign: "top",
                    itemStyle: {
                        fontSize: "13px",
                        fontFamily: '"Roboto", sans-serif',
                        color: "#545454",
                    },
                    itemHoverStyle: {
                        color: "#545454",
                    },
                },
                plotOptions: {
                    column: {
                        borderWidth: 0,
                        borderRadius: 3,
                        pointWidth: 29,
                        minPointLength: 3,
                        dataLabels: {
                            enabled: false,
                            color: "#707070",
                            useHTML: false,
                            style: {
                                fontFamily: '"Roboto", sans-serif',
                                fontSize: "12px",
                                fontWeight: "400",
                            },
                            crop: false,
                            overflow: "none",
                        },
                        states: {
                            hover: {
                                enabled: false,
                            },
                        },
                        pointRange: 1,
                        grouping: true,
                    },
                },
                tooltip: {
                    enabled: true,
                    shared: true,
                    valueDecimals: 2,
                    pointFormatter() {
                        const value = (Math.round(this.y * 100) / 100).toFixed(2) + "%";

                        const color = this.pointTooltipColor ? this.pointTooltipColor : this.color;
                        return `<span style="color:${color}; font-family: Roboto;">\u25CF </span>${this.series.name}: <span style="font-weight: bold;color:${color};">${value}</span><br/>`;
                    },
                },
            }}
        />
    );
}

const Body = styled(FlexColumn)`
    flex-grow: 1;
    margin-bottom: 16px;
`;
const ChildIconContainer = styled.div.attrs({
    className: "ItemIcon ItemIcon--website",
})`
    width: 32px;
    height: 32px;
    margin-left: 18px;
    position: relative;
`;

const CategoryLegendMarker = styled(ClosableItemColorMarker)`
    background-color: ${colorsPalettes.carbon[100]};
    bottom: -5px;
    right: -5px;
`;

const ChildIconImage = styled.div`
    border-radius: 3px;
    align-self: center;
    width: 32px;
    height: 32px;
    text-align: center;
    font-size: 20px;
    i {
        line-height: 32px;
    }
`;

const CategoryItem = ({ category }) => (
    <ChildIconContainer>
        <ChildIconImage>
            <i className={`sprite-category ${categoryIconFilter()(category)}`} />
            <CategoryLegendMarker />
        </ChildIconImage>
    </ChildIconContainer>
);

const LegendContainer = styled(FlexRow)`
    margin-bottom: 2px;
    max-width: 380px;
    display: flex;
    align-items: center;
`;

const ItemName = styled.span`
    margin: 0 12px 0 10px;
    font-size: 14px;
    color: ${colorsPalettes.carbon[300]};
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    :last-child {
        margin-right: 0;
    }
`;
const SiteItemIcon = styled(StyledItemIcon)`
    width: 32px;
    height: 32px;
`;

const Item = ({ name, children }) => (
    <>
        {children}
        <PlainTooltip variation={"white"} text={name}>
            <ItemName>{name}</ItemName>
        </PlainTooltip>
    </>
);

const Vs = styled.div`
    color: ${colorsPalettes.carbon[400]};
`;
function Legend() {
    const {
        site,
        siteInfo: { category, icon },
    } = useContext(sfConvertPageContext);
    if (category || icon) {
        return (
            <LegendContainer>
                <Item name={site}>
                    <SiteItemIcon iconType={Type.Website} iconName="" iconSrc={icon} />
                </Item>
                {category && (
                    <React.Fragment>
                        <Vs>VS.</Vs>
                        <Item name={formatCategoryName(category)}>
                            <CategoryItem category={category} />
                        </Item>
                    </React.Fragment>
                )}
            </LegendContainer>
        );
    }
    return null;
}

export function SFMarketingChannels() {
    const { site, competitors, country, duration, webAnalysisComponent, siteInfo } = useContext(
        sfConvertPageContext,
    );
    const webSource = commonWebSources.desktop().id; // only desktop source is relevant
    const {
        forAPI: { from, to },
    } = DurationService.getDurationData(duration, null, webAnalysisComponent.componentId);
    const [siteData, setSiteData] = useState(null);
    const [industryData, setIndustryData] = useState(null);

    function getProLink() {
        return `https://pro.similarweb.com/#website/traffic-overview/${site}/*/${country}/${duration}/?category=${
            siteInfo?.category?.replace(/\//g, "~") ?? ""
        }&webSource=${webSource}`;
    }
    useEffect(() => {
        async function fetchData() {
            setSiteData(null);
            const response = await fetchService.get<{
                Data: { [key: string]: any };
            }>("/widgetApi/MarketingMix/TrafficSourcesOverview/PieChart", {
                country,
                from,
                to,
                webSource: webSource.toLowerCase(),
                ShouldGetVerifiedData: false,
                includeSubDomains: true,
                isWindow: false,
                keys: site,
                timeGranularity: "Monthly",
            });
            const data = response && Object.keys(response).length > 0 ? response.Data[site] : {};
            setSiteData({ ...data, totalVisits: getTotalVisits(data) });
        }

        fetchData();
    }, [country, from, to, webSource, site]);

    useEffect(() => {
        async function fetchData() {
            setIndustryData(null);
            const category = `$${siteInfo.category}`;
            const response = await fetchService.get<{
                Data: { [key: string]: any };
            }>("/api/WidgetKpis/TrafficSourcesOverviewAverage/GetPieChartData", {
                country,
                from,
                to,
                webSource: webSource.toLowerCase(),
                ShouldGetVerifiedData: false,
                includeSubDomains: true,
                isWindow: false,
                keys: category,
                timeGranularity: "Monthly",
            });
            const data =
                response && Object.keys(response).length > 0 ? response.Data[category] : {};
            setIndustryData({ ...data, totalVisits: getTotalVisits(data) });
        }

        if (siteInfo.category) {
            fetchData();
        }
    }, [country, from, to, webSource, siteInfo.category]);

    const graphData = useMemo(
        () =>
            prepareGraphData([
                [site, siteData],
                [siteInfo.category, industryData],
            ]),
        [siteData, industryData],
    );
    return (
        <SfCardWrapper
            webSource={webSource}
            country={country}
            duration={duration}
            title={i18nFilter()("salesforce.marketing_channels.title")}
            tooltip={i18nFilter()("salesforce.marketing_channels.tooltip")}
            footerLink={getProLink()}
            footerText={i18nFilter()("salesforce.marketing_channels.footer")}
            dataAutomation={"marketing-channels"}
        >
            <Body>
                <Legend />
                {graphData ? <Graph {...graphData} /> : <SfCardLoader height="244px" />}
            </Body>
        </SfCardWrapper>
    );
}

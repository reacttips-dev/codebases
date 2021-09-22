import React, { FC, useEffect, useState } from "react";
import { i18nFilter, percentageFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { DefaultFetchService } from "services/fetchService";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { EmptyState } from "../common/EmptyState";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import CountryService from "services/CountryService";
import {
    DisplayAdsGraphHeaderStyle,
    SwitchersContainer,
} from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { Injector } from "common/ioc/Injector";
import {
    PieChart,
    PieChartDataItemType,
} from "pages/website-analysis/traffic-sources/display-ads/common/PieChart";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import { availableDataTypes } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/helpers/DisplayAdsGraphConstants";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { GraphTypeSwitcher, IDataType } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import styled from "styled-components";

const ChartSwitchersContainer = styled(SwitchersContainer)`
    padding: 0;
    > div:first-child {
        margin: 0;
    }
`;

export const AdsVisitsDistribution: FC<any> = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const chosenSitesService = Injector.get("chosenSites") as any;
    const getSiteColor = chosenSitesService.getSiteColor;
    const isCompare = params.key.split(",").length > 1;
    const appMode = isCompare ? "compare" : "single";
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, key, duration, isWWW } = params;
    const durationObject = DurationService.getDurationData(duration, null, null, null);
    const { from, to, isWindow } = durationObject.forAPI;
    const [chartType, setPieChartType] = useState<IDataType>(availableDataTypes[0]);
    const i18n = i18nFilter();
    const title = i18n("display.ads.overview.distribution.ads.title");
    const tooltip = i18n("display.ads.overview.distribution.ads.tooltip");
    const [data, setData] = useState<PieChartDataItemType[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const is28d = duration === "28d";
    const subTitleFilters = [
        {
            filter: "country",
            countryCode: country,
            value: CountryService.getCountryById(country)?.text,
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];

    const transformData = (data) => {
        const total = data.reduce((total, item) => {
            total += item.SearchTotal;
            return total;
        }, 0);
        return data.map((item) => {
            const { Domain, SearchTotal } = item;
            return {
                color: getSiteColor(Domain),
                percent: percentageFilter()(SearchTotal / total, 2),
                y: SearchTotal / total,
                searchTotal: SearchTotal,
                name: Domain,
            };
        });
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<{ Data: object[] }>(
                    "widgetApi/WebsiteDisplayAds/WebsiteAdsVisitsOverview/Table",
                    {
                        appMode,
                        country,
                        from,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key,
                        timeGranularity: is28d ? "Daily" : "Monthly",
                        to,
                        pageSize: 5,
                        webSource,
                    },
                )
                .finally(() => {
                    setIsLoading(false);
                });
            setData(transformData(response.Data));
        }
        fetchData();
    }, [from, to, isWindow, country, webSource, key]);

    const getComponent = () =>
        data && data.length > 0 ? (
            <PieChart pieChartData={data} chartType={chartType} />
        ) : (
            <EmptyState
                titleKey="display.ads.overview.empty.state.title"
                subTitleKey="display.ads.overview.empty.state.sub.title"
            />
        );

    ///////////////  Graph Type Switcher  ///////////////

    const ChartTypeSwitcherContainer = ({ chartType, setChartType }) => {
        const onChartTypeClick = (index) => {
            const type = availableDataTypes[index].value;
            TrackWithGuidService.trackWithGuid(
                "display_ads.overview.pie-chart.data_type",
                "click",
                {
                    type,
                },
            );
            setChartType(availableDataTypes[index]);
        };
        return (
            <GraphTypeSwitcher
                onItemClick={(index) => onChartTypeClick(index)}
                selectedIndex={availableDataTypes.findIndex(
                    (item) => item.value === chartType.value,
                )}
                buttonsList={availableDataTypes}
            />
        );
    };

    return (
        <>
            <DisplayAdsGraphHeaderStyle isSingle={false}>
                <DisplayOverviewTitleComponent
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
                <ChartSwitchersContainer data-automation="display-ads-pie-chart-switchers">
                    <ChartTypeSwitcherContainer
                        chartType={chartType}
                        setChartType={setPieChartType}
                    />
                </ChartSwitchersContainer>
            </DisplayAdsGraphHeaderStyle>
            {isLoading ? (
                <LoaderWrapper>
                    <Loader />
                </LoaderWrapper>
            ) : (
                getComponent()
            )}
        </>
    );
};

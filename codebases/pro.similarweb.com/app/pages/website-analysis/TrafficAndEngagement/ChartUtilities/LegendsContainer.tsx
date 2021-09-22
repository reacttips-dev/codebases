import { BulletLegends } from "components/React/Legends/BulletLegends";
import { Legends } from "components/React/Legends/Legends";
import React from "react";
import { DefaultFetchService } from "services/fetchService";

const LegendsDataEndpoint = "widgetApi/TrafficAndEngagement/EngagementOverview/Table";
const HeaderDataEndpoint = "api/WebsiteOverview/getheader";
const PublicGa = "Public";
const EndpointToLegendsDataName = {
    EngagementVisits: "AvgMonthVisits",
    UniqueUsers: "UniqueUsers",
    EngagementDedup: "DedupUniqueUsers",
    EngagementAvgVisitDuration: "AvgVisitDuration",
    EngagementPagesPerVisit: "PagesPerVisit",
    EngagementBounceRate: "BounceRate",
    EngagementTotalPagesViews: "TotalPagesViews",
};
export const LegendsContainer = ({
    metric,
    data,
    showGAApprovedData,
    sites,
    chartType,
    webSource,
    onLegendClick,
    queryParams,
    meta,
}) => {
    const [state, setState] = React.useState({ legendsData: undefined, isGaPublicDict: {} });
    const { legendsData, isGaPublicDict } = state;
    const [isLoading, setIsLoading] = React.useState(true);
    const { isPOP, isSingleMode, isSingleCompare } = meta;
    const shouldGetLegendsData = !(isPOP || isSingleMode || isSingleCompare);
    const getData = () => {
        if (!shouldGetLegendsData) {
            setState({ legendsData: undefined, isGaPublicDict: undefined });
            setIsLoading(false);
            return;
        }
        const fetchService = DefaultFetchService.getInstance();
        const apiParams = { ...queryParams };
        const legendsDataPromise = fetchService.get(LegendsDataEndpoint, apiParams);
        const headerDataPromise = fetchService.get(HeaderDataEndpoint, {
            includeCrossData: true,
            keys: apiParams.keys,
        });
        Promise.all([legendsDataPromise, headerDataPromise])
            .then((data: any) => {
                const dict = {};
                sites.map(({ name }) => {
                    dict[name] = data[1][name]?.privacyStatus === PublicGa;
                });
                setState({ legendsData: data[0].Data, isGaPublicDict: dict });
            })
            .finally(() => setIsLoading(false));
    };
    React.useEffect(getData, [queryParams.ShouldGetVerifiedData]);
    if (isLoading) {
        return "";
    }
    const getSiteAverage = (siteName) => {
        if (!legendsData || !shouldGetLegendsData) {
            return undefined;
        }
        const siteData = (legendsData as any[]).find(({ Domain }) => Domain === siteName);
        const metricName = metric.endPoint.split("/")[2];
        return siteData[EndpointToLegendsDataName[metricName]];
    };
    const getIsGAVerified = (siteName) => {
        if (showGAApprovedData && data.KeysDataVerification) {
            let site = siteName;
            if (isSingleCompare) {
                const legendObj = sites.find((st) => st.name === siteName);
                if (legendObj.isBeta) {
                    return false;
                }
                site = Object.keys(data.KeysDataVerification)?.[0];
            }
            return data.KeysDataVerification[site];
        }
        return false;
    };

    const getLegendItems = () =>
        sites.map(({ name, isSelected, color, transparentColor, infoTooltip, isBeta }) => ({
            name,
            hidden: !isSelected,
            color,
            transparentColor,
            infoTooltip,
            isGAVerified: getIsGAVerified(name),
            isGAPrivate: isGaPublicDict ? !isGaPublicDict[name] : undefined,
            isBeta,
            data: metric.hideLegendsData
                ? ""
                : metric.yAxisLabelsFormatter({ value: getSiteAverage(name) }),
        }));
    const defaultLegends =
        sites.length > 1 ? (
            <Legends
                legendItems={getLegendItems()}
                toggleSeries={onLegendClick}
                showLegendsData={shouldGetLegendsData}
            />
        ) : (
            <BulletLegends legendItems={getLegendItems()} />
        );
    const ChartLegends = metric.legends
        ? metric.legends({
              legendItems: getLegendItems(),
              toggleSeries: onLegendClick,
              webSource,
              chartType,
          })
        : defaultLegends;
    return ChartLegends;
};

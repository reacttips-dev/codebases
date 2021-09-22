import React, { FC, useEffect, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import styled from "styled-components";
import { DefaultFetchService } from "services/fetchService";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { TrafficShare } from "components/React/Table/cells/TrafficShare";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { CtaButton, CtaWrapper } from "./StyledComponents";
import { EmptyState } from "./EmptyState";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import { DefaultCell, GroupTrafficShare } from "components/React/Table/cells";
import CountryService from "services/CountryService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { DisplayAdsGraphHeaderStyle } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { numberFilter } from "filters/numberFilter";

const StyledTable: any = styled(MiniFlexTable)`
    margin: 0 22px 0 22px;
    padding-bottom: 0;
    min-height: 232px;

    .MiniFlexTable-column {
        .MiniFlexTable-cell {
            height: 40px;

            font-size: 14px;
            &:not(:first-child) {
                border-top: 1px solid ${colorsPalettes.carbon[50]};
            }

            .cell-innerText {
                white-space: nowrap;
            }

            > div {
                height: 100%;
                align-items: center;
                display: flex;
            }
        }
    }

    .MiniFlexTable-headerCell {
        margin-bottom: 2px;
        font-weight: 500;
        font-size: 12px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

export const TopAdNetworks: FC<any> = () => {
    const swNavigator = Injector.get<any>("swNavigator");
    const params = swNavigator.getParams();
    const fetchService = DefaultFetchService.getInstance();
    const isCompare = params.key.split(",").length > 1;
    const appMode = isCompare ? "compare" : "single";
    const { country, webSource, key, duration, isWWW } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const i18n = i18nFilter();
    const title = i18n("display.ads.overview.topadnetworks");
    const tooltip = i18n("display.ads.overview.topadnetworks.tooltip");
    const [data, setData] = useState<object[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState<number>();
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

    useEffect(() => {
        async function fetchData() {
            setData(null);

            const response = await fetchService
                .get<{ Data: object[]; TotalCount: number }>(
                    "widgetApi/WebsiteDisplayAds/WebsiteAdsMediators/Table",
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
                        orderBy: "TotalShare desc",
                    },
                )
                .finally(() => {
                    setIsLoading(false);
                });

            setData(response.Data);
            setTotalCount(response.TotalCount);
        }
        fetchData();
    }, [from, to, isWindow, country, webSource, key]);

    const getTableColumns = () => {
        return [
            {
                field: "Mediator",
                displayName: i18n("display.ads.overview.topadnetworks.table.mediator.column.title"),
                headerComponent: DefaultCellHeader,
                cellComponent: (props) => (
                    <div>
                        <DefaultCell {...props} />
                    </div>
                ),
            },
            isCompare
                ? {
                      field: "ShareSplit",
                      displayName: i18n(
                          "display.ads.overview.topadnetworks.table.share.column.title",
                      ),
                      cellComponent: GroupTrafficShare,
                      isResizable: false,
                      sortable: false,
                  }
                : {
                      field: "Share",
                      displayName: i18n(
                          "display.ads.overview.topadnetworks.table.share.column.title",
                      ),
                      headerComponent: DefaultCellHeader,
                      cellComponent: TrafficShare,
                  },
        ];
    };

    const ctaClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "display_ads.overview.top_ad_networks.cta.click",
            "click",
        );
        swNavigator.go("websites-trafficDisplay-adNetworks", params);
    };

    const getComponent = () =>
        data && data.length > 0 ? (
            <>
                <StyledTable className="MiniFlexTable" data={data} columns={getTableColumns()} />
                <CtaWrapper>
                    <CtaButton
                        onClick={ctaClicked}
                        type="flat"
                        label={i18n("display.ads.overview.topadnetworks.cta", {
                            TotalCount: numberFilter()(totalCount),
                        })}
                    />
                </CtaWrapper>
            </>
        ) : (
            <EmptyState
                titleKey="display.ads.overview.empty.state.title"
                subTitleKey="display.ads.overview.empty.state.sub.title"
            />
        );

    return (
        <>
            <DisplayAdsGraphHeaderStyle isSingle={false}>
                <DisplayOverviewTitleComponent
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
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

SWReactRootComponent(TopAdNetworks, "TopAdNetworks");

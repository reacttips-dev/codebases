import React, { FC, useEffect, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import styled from "styled-components";
import { DefaultFetchService } from "services/fetchService";
import { DefaultCellHeader } from "components/React/Table/headerCells";
import { TrafficShare } from "components/React/Table/cells/TrafficShare";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { Loader } from "pages/website-analysis/traffic-sources/display-ads/common/Loader";
import { CtaButton, CtaWrapper } from "./StyledComponents";
import { EmptyState } from "./EmptyState";
import { DisplayOverviewTitleComponent } from "pages/website-analysis/traffic-sources/display-ads/overview/common/DisplayOverviewTitleComponent";
import CountryService from "services/CountryService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { DisplayAdsGraphHeaderStyle } from "pages/website-analysis/traffic-sources/display-ads/overview/overview-graph/components/StyledComponents";
import { GroupTrafficShare } from "components/React/Table/cells";
import { Injector } from "common/ioc/Injector";
import { LoaderWrapper } from "pages/website-analysis/traffic-sources/display-ads/common/StyledComponents";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { numberFilter } from "filters/numberFilter";

const StyledTable: any = styled(MiniFlexTable)`
    margin: 0 22px 0 22px;
    padding-bottom: 0;
    min-height: 232px;

    .MiniFlexTable-cell {
        height: 40px;
        vertical-align: middle;
        font-size: 14px;
        &:not(:first-child) {
            border-top: 1px solid ${colorsPalettes.carbon[50]};
        }
    }

    .MiniFlexTable-column:nth-of-type(2) {
        .MiniFlexTable-cell {
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

export const TopPublishers: FC<any> = () => {
    const swNavigator = Injector.get<any>("swNavigator");
    const params = swNavigator.getParams();
    const isCompare = params.key.split(",").length > 1;
    const appMode = isCompare ? "compare" : "single";
    const fetchService = DefaultFetchService.getInstance();
    const { country, webSource, key, duration, isWWW } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const i18n = i18nFilter();
    const title = i18n("display.ads.overview.toppublishers.title");
    const tooltip = i18n("display.ads.overview.toppublishers.tooltip");
    const [data, setData] = useState<object[]>(null);
    const [columns, setColumns] = useState<object[]>(null);
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

    const transformData = (data) => {
        return data.Data.map((record) => {
            return {
                ...record,
                url: swNavigator.href("websites-worldwideOverview", {
                    ...params,
                    key: record.Domain,
                    isWWW: "*",
                }),
            };
        });
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);

            const response = await fetchService
                .get<{ Data: object[]; TotalCount: number }>(
                    "widgetApi/WebsiteDisplayAds/WebsiteAdsPublishers/Table",
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
            setData(transformData(response));
            setColumns(getTableColumns());
            setTotalCount(response.TotalCount);
        }
        fetchData();
    }, [from, to, isWindow, country, webSource, key]);

    const getTableColumns = () => {
        return [
            {
                field: "Domain",
                displayName: i18n("display.ads.overview.toppublishers.table.domain.column.title"),
                headerComponent: DefaultCellHeader,
                cellComponent: ({ value, row }) => {
                    const props = {
                        displayName: "CoreWebsiteCell",
                        domain: value,
                        icon: row.Favicon,
                        internalLink: row.url,
                        hideTrackButton: true,
                    };
                    return (
                        <ComponentsProvider components={{ WebsiteTooltip }}>
                            <CoreWebsiteCell {...props} />
                        </ComponentsProvider>
                    );
                },
            },
            isCompare
                ? {
                      field: "ShareSplit",
                      displayName: i18n(
                          "display.ads.overview.toppublishers.table.share.column.title",
                      ),
                      cellComponent: GroupTrafficShare,
                      isResizable: false,
                      sortable: false,
                  }
                : {
                      field: "Share",
                      displayName: i18n(
                          "display.ads.overview.toppublishers.table.share.column.title",
                      ),
                      headerComponent: DefaultCellHeader,
                      cellComponent: TrafficShare,
                  },
        ];
    };

    const ctaClicked = () => {
        TrackWithGuidService.trackWithGuid(
            "display_ads.overview.top_publishers.cta.click",
            "click",
        );
        swNavigator.go("websites.trafficDisplay", {
            ...params,
            selectedTab: "publishers",
        });
    };

    const getComponent = () =>
        data && data.length > 0 && columns ? (
            <>
                <StyledTable className="MiniFlexTable" data={data} columns={columns} />
                <CtaWrapper>
                    <CtaButton
                        onClick={ctaClicked}
                        type="flat"
                        label={i18n("display.ads.overview.toppublishers.cta", {
                            totalPublishers: numberFilter()(totalCount),
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

SWReactRootComponent(TopPublishers, "TopPublishers");

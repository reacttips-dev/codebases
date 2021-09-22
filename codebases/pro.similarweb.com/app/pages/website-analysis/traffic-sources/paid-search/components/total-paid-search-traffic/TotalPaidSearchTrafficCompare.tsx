import React, { FunctionComponent, useEffect, useState } from "react";
import { minAbbrNumberFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import { StyledBox, TitleContainer } from "../common/StyledComponents";
import styled from "styled-components";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { ChangePercentage, DefaultCellRightAlign } from "components/React/Table/cells";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { Loader } from "../common/Loader";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { PaidSearchComponentTitle } from "pages/website-analysis/traffic-sources/paid-search/components/common/PaidSearchComponentTitle";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { IPaidSearchOverviewProps } from "pages/website-analysis/traffic-sources/paid-search/PaidSearchOverview";
import { isNumber } from "util";

const FlexEndRow = styled(FlexRow)`
    justify-content: flex-end;
`;

const StyledTable: any = styled(MiniFlexTable)`
    .MiniFlexTable-cell {
        height: 40px;
        vertical-align: middle;
        font-size: 14px;
        &:not(:first-child) {
            border-top: 1px solid ${colorsPalettes.carbon[50]};
        }
    }
    .MiniFlexTable-column {
        &:first-child {
            .MiniFlexTable-cell {
                padding-left: 24px;
                > div {
                    @media (max-width: 1400px) {
                        max-width: 140px;
                    }
                }
            }
            .MiniFlexTable-headerCell {
                padding-left: 24px;
            }
        }
        &:last-child {
            .MiniFlexTable-headerCell,
            .MiniFlexTable-cell {
                padding-right: 24px;
            }
        }
        &:nth-child(2) {
            .MiniFlexTable-cell {
                padding-right: 4px;
            }
        }
        &:not(:first-child) {
            .MiniFlexTable-cell {
                > div {
                    margin: 10px auto;
                }
            }
        }
    }

    .MiniFlexTable-headerCell {
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 12px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

export interface IData {
    Domain: string;
    Traffic: number;
    Favicon: string;
    url: string;
    Change: number;
    precision: number;
}

export const TotalPaidSearchTrafficCompare: FunctionComponent<IPaidSearchOverviewProps> = (
    props,
) => {
    const { href, fetchService, i18n } = props;
    const { country, webSource, isWWW, key, duration } = props.navigationParams;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const title = i18n(
        "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.title",
    );
    const tooltip = i18n(
        "website-analysis.traffic-sources.paid-search.total-paid-search-traffic.title.tooltip",
    );
    const [data, setData] = useState<IData[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const subTitleFilters = [
        {
            filter: "date",
            value: {
                from: fromDate.valueOf(),
                to: toDate.valueOf(),
                useRangeDisplay: fromDate.format("YYYY-MM") !== toDate.format("YYYY-MM"),
            },
        },
        {
            filter: "webSource",
            value: webSource,
        },
    ];

    const transformData = (data) => {
        return Object.entries(data.Data).map(
            ([domain, data]: [
                string,
                {
                    Favicon: string;
                    TotalPaidSearchTraffic: number;
                    PaidSearchChange: number;
                },
            ]) => {
                return {
                    Favicon: data?.Favicon,
                    Domain: domain,
                    Traffic: data?.TotalPaidSearchTraffic,
                    url: href("websites-worldwideOverview", {
                        ...props.navigationParams,
                        key: domain,
                        isWWW: "*",
                    }),
                    Change: data?.PaidSearchChange,
                    precision: 0,
                };
            },
        );
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            const response = await fetchService
                .get<{ Data: object }>(
                    "widgetApi/TrafficSourcesSearch/PaidSearchOverview/SingleMetric",
                    {
                        country,
                        from,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key,
                        timeGranularity: isWindow ? "Weekly" : "Monthly",
                        to,
                        webSource,
                    },
                )
                .finally(() => setIsLoading(false));
            setData(transformData(response));
        }
        fetchData();
    }, []);

    const getTableColumns = () => {
        return [
            {
                field: "Domain",
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.total-paid-search-traffic-compare.domain.column",
                ),
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
            {
                field: "Traffic",
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.total-paid-search-traffic-compare.traffic.column",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: ({ value }) =>
                    value === undefined || value === 0 ? (
                        <FlexEndRow>N/A</FlexEndRow>
                    ) : (
                        <DefaultCellRightAlign value={minAbbrNumberFilter()(value)} />
                    ),
            },
            {
                field: "Change",
                headerComponent: DefaultCellHeaderRightAlign,
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.total-paid-search-traffic-compare.change.column",
                ),
                tooltip: i18n(
                    "website-analysis.traffic-sources.paid-search.total-paid-search-traffic-compare.change.column.tooltip",
                ),
                cellComponent: (props) =>
                    !props.value && !isNumber(props.value) ? (
                        <FlexEndRow>
                            {isWindow
                                ? "-"
                                : props.row.Traffic === undefined
                                ? "N/A"
                                : i18n("new.label.pill")}
                        </FlexEndRow>
                    ) : (
                        <ChangePercentage {...props} />
                    ),
            },
        ];
    };

    const getComponent = () =>
        !data || data.length === 0 ? (
            <NoDataLandscape
                title="website-analysis.traffic-sources.paid-search.no-data"
                subtitle=""
            />
        ) : (
            <StyledTable className="MiniFlexTable" data={data} columns={getTableColumns()} />
        );

    return (
        <StyledBox
            width="36%"
            height="338"
            data-automation="total-paid-search-traffic-compare"
            marginRight={24}
        >
            <TitleContainer>
                <PaidSearchComponentTitle
                    title={title}
                    tooltip={tooltip}
                    filters={subTitleFilters}
                />
            </TitleContainer>
            {isLoading ? <Loader /> : getComponent()}
        </StyledBox>
    );
};

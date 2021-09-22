import React, { FC, useCallback, useEffect, useState } from "react";
import { pureNumberFilter } from "filters/numberFilter";
import DurationService from "services/DurationService";
import { SeeMoreContainer, StyledBox, TitleContainer } from "../common/StyledComponents";
import styled from "styled-components";
import { DefaultCellHeader, DefaultCellHeaderRightAlign } from "components/React/Table/headerCells";
import { DefaultCellRightAlign, WaKeywordPositionCompare } from "components/React/Table/cells";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Loader } from "../common/Loader";
import { PaidSearchComponentTitle } from "pages/website-analysis/traffic-sources/paid-search/components/common/PaidSearchComponentTitle";
import { setFont } from "@similarweb/styles/src/mixins";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { Button } from "@similarweb/ui-components/dist/button";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { IPaidSearchOverviewProps } from "pages/website-analysis/traffic-sources/paid-search/PaidSearchOverview";

const Link = styled.div`
    ${setFont({ $size: 14, $color: rgba(colorsPalettes.blue[400], 0.8) })};
    cursor: pointer;
`;

const StyledTable: any = styled(MiniFlexTable)`
    padding-bottom: 0;
    min-height: 188px;

    .MiniFlexTable-cell {
        height: 40px;
        vertical-align: middle;
        font-size: 14px;
        &:not(:first-child) {
            border-top: 1px solid ${colorsPalettes.carbon[50]};
        }
        > div {
            margin: 10px auto;
        }
    }

    .MiniFlexTable-column {
        &:first-child {
            .MiniFlexTable-cell,
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
    }
    .MiniFlexTable-headerCell {
        margin-bottom: 8px;
        font-weight: 500;
        font-size: 12px;
        color: ${rgba(colorsPalettes.carbon[500], 0.6)};
    }
`;

const WaKeywordPositionCompareWrapper = styled.div`
    .cell-innerText {
        margin-top: 8px;
        justify-content: flex-end;
        display: flex;
        align-items: center;
    }
    .sw-icon-show-more {
        margin-top: 4px;
    }
`;

interface IData {
    Traffic: number;
    CPC: number;
    KwVolume: number;
    Keyword: string;
    KeywordUrl: string;
    PositionPaid?: object;
}

interface ITableColumn {
    field: string;
    displayName: string;
    headerComponent: any;
    cellComponent: any;
    format?: string;
}

export const TopPaidKeywords: FC<IPaidSearchOverviewProps> = (props) => {
    const { i18n, href, isCompare, fetchService } = props;
    const { country, webSource, isWWW, key, duration } = props.navigationParams;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const getDateRange = (durationObject) => [durationObject.raw.from, durationObject.raw.to];
    const [fromDate, toDate] = getDateRange(durationObject);
    const title = i18n("website-analysis.traffic-sources.paid-search.top-paid-keywords.title");
    const tooltip = i18n(
        "website-analysis.traffic-sources.paid-search.top-paid-keywords.title.tooltip",
    );
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
    const [data, setData] = useState<IData[]>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [totalCount, setTotalCount] = useState<number>(0);
    const innerCtaLink = href("competitiveanalysis_website_search_keyword", {
        ...props.navigationParams,
        IncludePaid: true,
    });

    const transformData = (data) => {
        return data?.map((record) => {
            const item: IData = {
                Traffic: record.TotalVisits,
                CPC: record.CPC,
                KwVolume: record.KwVolume,
                Keyword: record.SearchTerm,
                KeywordUrl: href("keywordAnalysis_overview", {
                    ...props.navigationParams,
                    keyword: record.SearchTerm,
                }),
            };
            if (isCompare) {
                item.PositionPaid = record.PositionPaid;
            }
            return item;
        });
    };

    useEffect(() => {
        async function fetchData() {
            setData(null);
            setTotalCount(0);
            const response = await fetchService
                .get<{ Data: object[]; TotalCount: number }>(
                    "widgetApi/SearchKeywords/NewSearchKeywords/Table",
                    {
                        country,
                        from,
                        includeSubDomains: isWWW === "*",
                        isWindow,
                        keys: key,
                        timeGranularity: "Monthly",
                        to,
                        webSource,
                        pageSize: 4,
                        IncludePaid: true,
                    },
                )
                .finally(() => setIsLoading(false));

            setTotalCount(response?.TotalCount);
            setData(transformData(response?.Data));
        }
        fetchData();
    }, []);

    const getTableColumns = () => {
        const cols: ITableColumn[] = [
            {
                field: "Keyword",
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.top-paid-keywords.top-keywords.column.title",
                ),
                headerComponent: DefaultCellHeader,
                cellComponent: ({ value, row }) => {
                    return (
                        <Link>
                            <a
                                href={row.KeywordUrl}
                                onClick={() => {
                                    TrackWithGuidService.trackWithGuid(
                                        "websiteanalysis.trafficsources.paidsearch.top_paid_keywords.keyword",
                                        "click",
                                        { selectedKeyword: value },
                                    );
                                }}
                            >
                                {value}
                            </a>
                        </Link>
                    );
                },
            },
            {
                field: "KwVolume",
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.top-paid-keywords.volume.column.title",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: DefaultCellRightAlign,
                format: "swPosition",
            },

            {
                field: "Traffic",
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.top-paid-keywords.traffic.column.title",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: DefaultCellRightAlign,
                format: "abbrNumber",
            },
            {
                field: "CPC",
                displayName: i18n(
                    "website-analysis.traffic-sources.paid-search.top-paid-keywords.cpc.column.title",
                ),
                headerComponent: DefaultCellHeaderRightAlign,
                cellComponent: DefaultCellRightAlign,
                format: "CPC",
            },
        ];

        if (isCompare) {
            cols.push({
                field: "PositionPaid",
                displayName: i18n(
                    `website-analysis.traffic-sources.paid-search.top-paid-keywords.position.column.title`,
                ),
                cellComponent: (props) => {
                    return (
                        <WaKeywordPositionCompareWrapper>
                            <WaKeywordPositionCompare {...props} />
                        </WaKeywordPositionCompareWrapper>
                    );
                },
                headerComponent: DefaultCellHeaderRightAlign,
                format: "avgKeywordPosition",
            });
        }

        return cols;
    };

    const onClickSeeMore = useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "websiteanalysis.trafficsources.paidsearch.top_paid_keywords.see_more",
            "click",
        );
    }, []);

    const getComponent = () =>
        !data || data.length === 0 ? (
            <NoDataLandscape
                title="website-analysis.traffic-sources.paid-search.no-data"
                subtitle=""
            />
        ) : (
            <>
                <StyledTable className="MiniFlexTable" data={data} columns={getTableColumns()} />
                <SeeMoreContainer onClick={onClickSeeMore} marginTop={isCompare ? 3 : 22}>
                    <a href={decodeURIComponent(innerCtaLink)} target="_self">
                        <Button type="flat">
                            {i18n(
                                "website-analysis.traffic-sources.paid-search.top-paid-keywords.cta",
                                { total: pureNumberFilter(totalCount) },
                            )}
                        </Button>
                    </a>
                </SeeMoreContainer>
            </>
        );

    return (
        <StyledBox
            width="67%"
            height={isCompare ? "338" : "357"}
            data-automation="total-paid-keywords"
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

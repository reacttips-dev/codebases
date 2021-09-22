import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RankingDistributionBanner } from "./RankingDistributionBanner";
import { IWebsiteKeywordsPageTableData } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import { Injector } from "common/ioc/Injector";
import { DefaultFetchService } from "services/fetchService";
import {
    createCpcFilter,
    createPositionFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { apiHelper } from "common/services/apiHelper";
import DurationService from "services/DurationService";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import AddTableRowsKeywordsToGroupUtility from "pages/keyword-analysis/AddTableRowsKeywordsToGroupUtility";
import { tableActionsCreator } from "actions/tableActions";
import styled from "styled-components";
import { getColumnsConfig } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RanknigDistributionColumns";
import { RankingDistributionTableTop } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionTableTop";
import queryString from "query-string";

const Container = styled.div`
    border: 1px solid #dadce3;
    border-radius: 0px;
`;

const MAX_SUPPORTED_POSITION = 100;

const calcDomainsPositions = (data) => {
    return Object.entries<{ CurrentPosition?: number }>(data).reduce<{
        domain: string;
        value: number;
    }>(
        (res, [domain, domainData]) => {
            if (domainData.CurrentPosition && domainData.CurrentPosition <= res.value) {
                res.domain = domain;
                res.value = domainData.CurrentPosition;
            }
            return res;
        },
        { value: MAX_SUPPORTED_POSITION, domain: null },
    );
};

const calcDomainsUrls = (data) => {
    return Object.entries<{ CurrentUrl?: string }>(data)
        .map(([domain, domainData]) => {
            return {
                Key: domain,
                Value: domainData.CurrentUrl || "N/A",
            };
        })
        .sort((a, b) => (a.Value === "N/A" ? 1 : -1));
};

export const RankingDistributionMain: React.FC<any> = (props) => {
    // need to save the table data, since the columns config is calculated based on the data
    const [tableData, setTableData] = useState<IWebsiteKeywordsPageTableData>({});
    const navigator = Injector.get("swNavigator");
    const chosenSites = Injector.get("chosenSites");
    const { params } = props;

    const onDataError = (error) => {
        console.error(error);
        setTableData({ Records: [] });
    };

    const getDataCallback = (data) => {
        setTableData(data);
    };

    const SERVER_API = `/api/RankDistribution`;

    const initialFilters = {
        ...params,
        keys: params.key,
        IncludeBranded: params.IncludeBranded === "true",
        IncludeNoneBranded: params.IncludeNoneBranded === "true",
        includeSubDomains: params.isWWW === "*",
        page: 0,
        pageSize: 100,
        timeGranularity: "Monthly",
        sort: "position0",
        asc: false,
        serp: params.serp?.split(","),
    };
    const isCompare = initialFilters.keys.split(",").length > 1;

    delete initialFilters.key;
    delete initialFilters.isWWW;
    delete initialFilters.selectedTab;

    if (initialFilters.ExcludeTerms) {
        initialFilters.ExcludeTerms = decodeURIComponent(initialFilters.ExcludeTerms);
    }
    if (initialFilters.ExcludeUrls) {
        initialFilters.ExcludeUrls = decodeURIComponent(initialFilters.ExcludeUrls);
    }
    if (initialFilters.IncludeTerms) {
        initialFilters.IncludeTerms = decodeURIComponent(initialFilters.IncludeTerms);
    }
    if (initialFilters.IncludeUrls) {
        initialFilters.IncludeUrls = decodeURIComponent(initialFilters.IncludeUrls);
    }

    const columns = useMemo(
        () =>
            getColumnsConfig({
                hasKwaPermission: true,
                domains: params.key.split(","),
                sortedColumn: initialFilters.sort,
                sortDirection: initialFilters.asc ? "asc" : "desc",
                currentMonth: initialFilters.duration.split("-")[0],
            }),
        [tableData],
    );

    const dataParamsAdapter = (params) => {
        // filters
        const { IncludeTerms: includeTerms, selectedPhrase } = params;
        if (selectedPhrase) {
            delete params.selectedPhrase;
            params.IncludeTerms = includeTerms
                ? includeTerms + `,${selectedPhrase}`
                : selectedPhrase;
        }

        const position = params.ranking;
        let fromPosition, toPosition;
        if (position) {
            [fromPosition, toPosition] = position.split("-");
        }
        const { volumeFromValue, volumeToValue, cpcFromValue, cpcToValue } = params;
        params.rangefilter = getRangeFilterQueryParamValue([
            createVolumeFilter(volumeFromValue, volumeToValue, "volume"),
            createCpcFilter(cpcFromValue, cpcToValue, "cpc"),
            createPositionFilter(fromPosition, toPosition),
        ]);
        !params.rangefilter && delete params.rangefilter;
        delete params.volumeFromValue;
        delete params.volumeToValue;
        delete params.cpcFromValue;
        delete params.cpcToValue;
        delete params.ranking;

        //align page
        if (typeof params.page == "number") {
            params.page += 1;
        }

        //serp
        if (params.serp?.length > 0) {
            params.serpfilter = params.serp;
            delete params.serp;
        }

        //branded/non-branded
        if (params.IncludeBranded === true) {
            params.BrandedFilter = "Branded";
        } else if (params.IncludeNoneBranded === true) {
            params.BrandedFilter = "NonBranded";
        }
        delete params.IncludeBranded;
        delete params.IncludeNoneBranded;
        // sorting
        // const orderBy = `${params.sort} ${params.asc ? "asc" : "desc"}`;
        // delete params.sort;
        // delete params.asc;
        // params.orderBy = orderBy;
        delete params.orderBy;
        //
        // params.sort = "position0";
        // params.asc = true;

        return apiHelper.transformParamsForAPI(params);
    };

    const createTopComponentCustomProps = () => {
        let topComponentProps: any = {
            chosenItems: chosenSites.sitelistForLegend(),
            durationObject: DurationService.getDurationData(params.duration),
            excelLink: `${SERVER_API}/Table/Excel?${queryString.stringify(
                dataParamsAdapter({ ...initialFilters, page: null }),
            )}`,
            noData: tableData.Records?.length === 0,
            tableData,
            dataParamsAdapter,
        };
        if (tableData.Header) {
            topComponentProps = {
                ...topComponentProps,
                // headerData: tableData.Header,
            };
        }
        return topComponentProps;
    };

    const transformData = (data) => {
        return {
            ...data,
            Records: data.Records.map((record) => {
                const siteData = isCompare ? {} : record.SiteData[initialFilters.keys];
                const serpRelatedData = {
                    SearchTerm: record.Keyword,
                    SerpFeatures: record.SerpFeatures,
                    SerpScrapeDate: record.SerpScrapeDate,
                    SiteSerpFeatures: Object.fromEntries(
                        Object.entries<{ SerpFeatures: string[] }>(record.SiteData || {}).map(
                            ([key, value]) => {
                                return [key, value.SerpFeatures];
                            },
                        ),
                    ),
                };
                return {
                    ...record,
                    ...siteData,
                    ...serpRelatedData,
                    PositionLeader: calcDomainsPositions(record.SiteData),
                    CurrentUrl: calcDomainsUrls(record.SiteData),
                    adsUrl: navigator.href("keywordAnalysis-ads", {
                        ...navigator.getParams(),
                        keyword: record.Keyword,
                    }),
                };
            }),
            TotalCount: data.ResultCount,
        };
    };

    return (
        <>
            <RankingDistributionBanner />
            <Container>
                <SWReactTableWrapperWithSelection
                    tableSelectionKey="RankingDistribution_Table"
                    tableSelectionProperty="Keyword"
                    serverApi={`${SERVER_API}/Table`}
                    tableColumns={columns}
                    totalRecordsField="TotalCount"
                    onDataError={onDataError}
                    rowsPerPage={100}
                    getDataCallback={getDataCallback}
                    transformData={transformData}
                    recordsField="Records"
                    tableOptions={{
                        aboveHeaderComponents: [
                            <AddTableRowsKeywordsToGroupUtility
                                key="1"
                                clearAllSelectedRows={
                                    tableActionsCreator("RankingDistribution_Table", "SearchTerm")
                                        .clearAllSelectedRows
                                }
                                stateKey="RankingDistribution_Table"
                            />,
                        ],
                        metric: "RankingDistribution_Table",
                        onSerpIconClick: (serp) => {
                            navigator.applyUpdateParams(
                                {
                                    serp: serp.id,
                                },
                                { reload: true },
                            );
                        },
                    }}
                    initialFilters={{ ...initialFilters }}
                    dataParamsAdapter={dataParamsAdapter}
                >
                    {(topComponentProps) => {
                        return (
                            <RankingDistributionTableTop
                                {...topComponentProps}
                                {...createTopComponentCustomProps()}
                            />
                        );
                    }}
                </SWReactTableWrapperWithSelection>
            </Container>
        </>
    );
};

const mapStateToProps = ({ routing: { params } }) => {
    return {
        params,
    };
};

const connected = connect(mapStateToProps)(RankingDistributionMain);
SWReactRootComponent(connected, "RankingDistribution");

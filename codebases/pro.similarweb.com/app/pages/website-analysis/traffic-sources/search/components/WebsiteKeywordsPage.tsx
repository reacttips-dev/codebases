import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getColumnsConfig } from "./WebsiteKeywordsPageColumns";
import { Injector } from "common/ioc/Injector";
import { tableActionsCreator } from "actions/tableActions";
import AddTableRowsKeywordsToGroupUtility from "pages/keyword-analysis/AddTableRowsKeywordsToGroupUtility";
import { WebsiteKeywordsPageTableTop } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTableTop";
import DurationService from "services/DurationService";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import { IAdvancedFilter } from "services/AdvancedFilterService/AdvancedFilterService";
import { IWebsiteKeywordsPageTableData } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import queryString from "query-string";
import styled from "styled-components";
import { KeywordsWeeklyFeedbackSurvey } from "pages/website-analysis/traffic-sources/search/survey/KeywordsWeeklyFeedbackSurvey";
import { allTrackers } from "services/track/track";
import { DefaultFetchService } from "services/fetchService";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { buildFilters } from "./WebsiteKeywordsPageUtillities";
import { closeDashboardsModal } from "pages/keyword-analysis/common/UtilityFunctions";
import { apiHelper } from "common/services/apiHelper";

const Container = styled.div`
    border: 1px solid #dadce3;
    border-radius: 0px;
    .position-column-cell.swReactTableCell.swTable-cell.resizeableCell-hover {
        padding: 0 8px 0 0;
    }
    .wa-keyword-position-compare {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
`;

const WebsiteKeywordsPageInner = (props) => {
    const { tableTopComponent: TableTopComponent } = props;
    // need to save the table data, since the columns config is calculated based on the data
    const [tableData, setTableData] = useState<IWebsiteKeywordsPageTableData>({});
    // save serp data
    const [serpData, setSerpData] = useState<IWebsiteKeywordsPageTableData>();
    const [serpDataLoading, setSerpDataLoading] = useState(true);
    // addToDashBoardModal used for closing the add to dashboard modal when this component is unmounted
    const addToDashBoardModal = useRef<{ result?: Promise<any>; close?: VoidFunction }>();
    useEffect(() => {
        return closeDashboardsModal(addToDashBoardModal);
    }, []);

    const navigator = Injector.get("swNavigator");
    const chosenSites = Injector.get("chosenSites");
    const { params } = props;

    const onDataError = () => {
        setTableData({ Data: [] });
    };

    const getDataCallback = (data) => {
        setTableData(data);
    };
    const onAddToDashboard = (tableFilters) => {
        allTrackers.trackEvent("Pop up", "open", "Add to my Dashboard/Traffic sources");
        const getWidgetOverrideParams = (filters) => {
            const modelFilterFields = [
                "includeSubDomains",
                "timeGranularity",
                "IncludeOrganic",
                "IncludePaid",
                "IncludeBranded",
                "IncludeNoneBranded",
                "IncludeNewKeywords",
                "IncludeTrendingKeywords",
                "IncludeQuestions",
                "ExcludeTerms",
                "IncludeUrls",
                "ExcludeUrls",
                "serp",
            ];
            const { volumeFromValue, volumeToValue, cpcFromValue, cpcToValue } = tableFilters;
            const modelFilters = {
                ...Object.fromEntries(
                    Object.entries(filters).filter(([key, value]) =>
                        modelFilterFields.includes(key),
                    ),
                ),
                selectedPhrase: filters["selectedPhrase"],
                IncludeTerms: filters["IncludeTerms"],
                filter: buildFilters({
                    source: tableFilters.source || null,
                    family: tableFilters.family || null,
                }),
                rangefilter: getRangeFilterQueryParamValue([
                    createVolumeFilter(volumeFromValue, volumeToValue),
                    createCpcFilter(cpcFromValue, cpcToValue),
                ]),
                limits: KeywordAdvancedFilterService.isCustomFilter(params.limits)
                    ? params.limits
                    : (KeywordAdvancedFilterService.getFilterById(
                          filters.limits,
                      ) as IAdvancedFilter).api,
            };
            return modelFilters;
        };

        const { webSource } = tableFilters;

        addToDashBoardModal.current = addToDashboard({
            modelType: "fromWebsite",
            metric: "NewSearchKeywords",
            type: "TableSearchKeywordsDashboard",
            webSource: webSource,
            filters: getWidgetOverrideParams(tableFilters),
        });

        // clear the ref when the modal is closed
        if (addToDashBoardModal.current.result) {
            addToDashBoardModal.current.result.finally(() => {
                addToDashBoardModal.current = null;
                allTrackers.trackEvent("Pop up", "close", "Add to my Dashboard/Traffic sources");
            });
        }
    };
    const SERVER_API = `/widgetApi/${
        params.webSource === "MobileWeb" ? "MobileSearchKeywords" : "SearchKeywords"
    }/NewSearchKeywords`;
    const initialFilters = {
        ...params,
        keys: params.key,
        IncludeOrganic: params.IncludeOrganic === "true",
        IncludePaid: params.IncludePaid === "true",
        IncludeBranded: params.IncludeBranded === "true",
        IncludeNoneBranded: params.IncludeNoneBranded === "true",
        IncludeNewKeywords: params.IncludeNewKeywords === "true",
        IncludeQuestions: params.IncludeQuestions === "true",
        IncludeTrendingKeywords: params.IncludeTrendingKeywords === "true",
        includeSubDomains: params.isWWW === "*",
        page: 0,
        pageSize: 400,
        timeGranularity: "Monthly",
        sort: "TotalShare",
        asc: false,
        serp: params.serp?.split(","),
        GetSerpData: params.serp ? true : false,
    };
    delete initialFilters.key;
    delete initialFilters.isWWW;
    delete initialFilters.selectedTab;

    useEffect(() => {
        const getSerpData = async () => {
            // if the use select serp filters, We won't send an extra request,
            // But send the first one with GetSerpData=true.
            if (params.serp) {
                setSerpDataLoading(false);
                return;
            }
            try {
                const response = await DefaultFetchService.getInstance().get<any>(
                    `${SERVER_API}/Table`,
                    dataParamsAdapter({
                        ...initialFilters,
                        GetSerpData: true,
                    }),
                );
                setSerpData(response);
                setSerpDataLoading(false);
            } catch (e) {
                setSerpData({
                    TotalCount: 0,
                    Header: {
                        flags: {
                            serpFailed: true,
                        },
                    },
                    Data: [],
                });
                setSerpDataLoading(false);
            }
        };
        getSerpData();
    }, []);

    // sim-31835: reset irrelevant filters for mobileweb
    if (params.webSource === "MobileWeb") {
        delete initialFilters.IncludePaid;
        delete initialFilters.IncludeOrganic;
        delete initialFilters.source;
        delete initialFilters.family;
    }
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
                country: params.country,
                data: tableData,
                domains: params.key.split(","),
                duration: params.duration,
                // TODO: fix filters
                filters: {
                    IncludeOrganic: initialFilters.IncludeOrganic,
                    IncludePaid: initialFilters.IncludePaidinitialFilters,
                },
                organicPaid: initialFilters.IncludePaid ? "Paid" : "Organic",
                webSource: params.webSource,
                sortedColumn: initialFilters.sort,
                sortDirection: initialFilters.asc ? "asc" : "desc",
                serpData,
            }),
        [tableData, serpData],
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
        const filters = buildFilters({
            source: params.source || null,
            family: params.family || null,
        });
        if (filters) {
            params.filter = filters;
        }
        if (params.limits) {
            const isCustomLimits = KeywordAdvancedFilterService.isCustomFilter(params.limits);
            params.limits = isCustomLimits
                ? params.limits
                : (KeywordAdvancedFilterService.getFilterById(params.limits) as IAdvancedFilter)
                      .api;
        }
        if (params.limitsUsingAndOperator) {
            const LIMITS_WITH_AND_OPERATOR_PREFIX = "&";
            params.limits = LIMITS_WITH_AND_OPERATOR_PREFIX + params.limitsUsingAndOperator;
        }
        delete params.source;
        delete params.family;

        const { volumeFromValue, volumeToValue, cpcFromValue, cpcToValue } = params;
        params.rangefilter = getRangeFilterQueryParamValue([
            createVolumeFilter(volumeFromValue, volumeToValue),
            createCpcFilter(cpcFromValue, cpcToValue),
        ]);
        !params.rangefilter && delete params.rangefilter;
        delete params.volumeFromValue;
        delete params.volumeToValue;
        delete params.cpcFromValue;
        delete params.cpcToValue;

        //align page
        if (typeof params.page == "number") {
            params.page += 1;
        }

        //serp
        if (params.serp?.length > 0) {
            params.serpfilter = params.serp.join(",");
            delete params.serp;
        }

        return apiHelper.transformParamsForAPI(params);
    };

    const createTopComponentCustomProps = () => {
        let topComponentProps: any = {
            onAddToDashboard,
            chosenItems: chosenSites.sitelistForLegend(),
            durationObject: DurationService.getDurationData(params.duration),
            excelLink: `${SERVER_API}/Excel?${queryString.stringify(
                dataParamsAdapter({ ...initialFilters, page: null }),
            )}`,
            isLast28Days: params.duration === "28d",
            noData: tableData.Data?.length === 0,
            tableData,
            serpDataLoading,
        };
        if (tableData?.Header?.total) {
            topComponentProps = {
                ...topComponentProps,
                headerData: tableData.Header.total,
                breakdown: tableData.Header.breakdown,
                channelsFilter: tableData.Filters.ChannelFilters.map((item) => ({
                    ...item,
                    id: parseInt(item.id),
                })),
                sourcesFilter: tableData.Filters.SourcesFilter.map((item) => ({
                    ...item,
                    id: item.text.toLowerCase(),
                })),
            };
        }
        return topComponentProps;
    };

    const enrichData = useCallback(
        (records) => {
            if (!records || !Array.isArray(records)) {
                return records;
            }
            return records.map((record) => {
                const modifiedRecord = {
                    ...record,
                    serpFailed: serpData?.Header?.flags?.serpFailed,
                    serpLoading: serpDataLoading,
                };
                // only add the serp data if we got it from the 2nd call
                if (serpData) {
                    const { SerpFeatures = [], SerpScrapeDate, SiteSerpFeatures } =
                        serpData.Data.find((r) => r.SearchTerm == record.SearchTerm) || {};
                    modifiedRecord.SerpFeatures = SerpFeatures;
                    modifiedRecord.SerpScrapeDate = SerpScrapeDate;
                    modifiedRecord.SiteSerpFeatures = SiteSerpFeatures;
                }
                return modifiedRecord;
            });
        },
        [serpData, serpDataLoading, tableData],
    );
    return (
        <>
            <KeywordsWeeklyFeedbackSurvey />
            <Container>
                <SWReactTableWrapperWithSelection
                    tableSelectionKey="NewSearchKeywords_Table"
                    tableSelectionProperty="SearchTerm"
                    serverApi={`${SERVER_API}/Table`}
                    tableColumns={columns}
                    totalRecordsField="TotalCount"
                    onDataError={onDataError}
                    fetchServerPages={4}
                    rowsPerPage={100}
                    selectAllCount={100}
                    getDataCallback={getDataCallback}
                    recordsField="Data"
                    tableOptions={{
                        aboveHeaderComponents: [
                            <AddTableRowsKeywordsToGroupUtility
                                key="1"
                                clearAllSelectedRows={
                                    tableActionsCreator("NewSearchKeywords_Table", "SearchTerm")
                                        .clearAllSelectedRows
                                }
                                stateKey="NewSearchKeywords_Table"
                            />,
                        ],
                        metric: "NewSearchKeywords_Table",
                        onSerpIconClick: (serp) => {
                            navigator.applyUpdateParams({ serp: serp.id });
                        },
                    }}
                    initialFilters={{ ...initialFilters }}
                    dataParamsAdapter={dataParamsAdapter}
                    enrichData={enrichData}
                >
                    {(topComponentProps) => (
                        <TableTopComponent
                            {...topComponentProps}
                            {...createTopComponentCustomProps()}
                        />
                    )}
                </SWReactTableWrapperWithSelection>
            </Container>
        </>
    );
};

WebsiteKeywordsPageInner.defaultProps = {
    tableTopComponent: WebsiteKeywordsPageTableTop,
};

const mapStateToProps = ({ routing }) => {
    const { currentPage, params } = routing;
    return {
        currentPage,
        params,
    };
};
export const WebsiteKeywordsPage = connect(mapStateToProps)(WebsiteKeywordsPageInner);
SWReactRootComponent(WebsiteKeywordsPage, "WebsiteKeywordsPage");

import SWReactRootComponent from "decorators/SWReactRootComponent";
import { connect } from "react-redux";
import React, { FunctionComponent, useState, useEffect } from "react";
import { i18nFilter, subCategoryFilter } from "filters/ngFilters";
import DurationService from "services/DurationService";
import useLocalStorage from "custom-hooks/useLocalStorage";
import { KWOPPORTUNITIES } from "./localStorageKey";
import { IKeywordGroup } from "userdata";
import { FindAffiliateByKeywordsTableSettings } from "pages/digital-marketing/find-affiliate/by-keywords/FindAffiliateByKeywordsTableSettings";
import { Injector } from "common/ioc/Injector";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import * as queryString from "query-string";
import { FindAffiliateByKeywordsTableTop } from "pages/digital-marketing/find-affiliate/by-keywords/FindAffiliateByKeywordsTableTop";
import { swSettings } from "common/services/swSettings";
import { getWebsiteTypeOptions } from "pages/keyword-analysis/Organic";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FindAffiliateByKeywordsEmptyState } from "./FindAffiliateByKeywordsEmptyState";
import { GhostLoader } from "components/React/Table/SWReactTableWrapper";
import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import * as _ from "lodash";
import { TITLE_MAX_LENGTH } from "pages/keyword-analysis/KeywordGroupEditorHelpers";
import { getStoredGroupName } from "./findAffiliateByKeywordUtils";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import { apiHelper } from "common/services/apiHelper";
import categoryService from "common/services/categoryService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const fetchService = DefaultFetchService.getInstance();
interface IParams {
    country: string;
    duration: string;
    webSource: string;
    keyword: string;
}

interface IFindAffiliateByKeywordsProps {
    children?: React.ReactNode;
    params: IParams;
    showToast: (href, text, label) => void;
    clearAllSelectedRows: () => void;
    selectedRows: any;
}

const FindAffiliateByKeywordsTable: FunctionComponent<IFindAffiliateByKeywordsProps> = (props) => {
    const {
        params: { country, duration, webSource, keyword },
        showToast,
        clearAllSelectedRows,
        selectedRows,
    } = props;
    const swNavigator = Injector.get("swNavigator") as any;
    const { category, search, websiteType, orderBy } = swNavigator.getParams();
    const categoryName = category ? decodeURIComponent(subCategoryFilter()(category)) : null;
    const [kwGroupRaw, setOpportunitiesKeywords] = useLocalStorage(KWOPPORTUNITIES);
    const isKwGroup = keyword?.startsWith("*");
    const getGroupFromId = (groupId) => {
        const userGroups = keywordsGroupsService.userGroups;
        const sharedGroups = keywordsGroupsService.getSharedGroups();
        return [...userGroups, ...sharedGroups].find(({ Id }) => Id === groupId);
    };

    const getKwGroup = (): IKeywordGroup => {
        if (isKwGroup) {
            const keywordGroupIdFromUrl = keyword.slice(1);
            const foundUserGroup = getGroupFromId(keywordGroupIdFromUrl);
            if (foundUserGroup?.Id) {
                return foundUserGroup;
            } else {
                if (kwGroupRaw) {
                    const kwGroup: IKeywordGroup = JSON.parse(kwGroupRaw);
                    if (kwGroup.Id === keywordGroupIdFromUrl) {
                        return kwGroup;
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    };
    const kwGroup: IKeywordGroup = getKwGroup();
    if (isKwGroup && !kwGroup) {
        swNavigator.go(swNavigator.current().homeState);
    }
    const hideTopBar = !kwGroup?.Keywords;
    const bigGroup = kwGroup?.Keywords?.length > 200;
    const hasCustomCategoriesPermission = categoryService.hasCustomCategoriesPermission();
    const [allCategories, setAllCategories] = useState();
    const [hideUtils, setHideUtils] = useState(false);
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const { from, to } = DurationService.getDurationData(duration).forAPI;
    const params = {
        country,
        from,
        includeSubDomains: true,
        isWindow: false,
        Keys: "null",
        timeGranularity: "Monthly",
        to,
        webSource,
    } as any;
    useEffect(() => {
        const controller = new AbortController();
        if (!isKwGroup) {
            const createGroupParams = {
                keyword,
                country,
                from,
                to,
                webSource,
            };
            const { signal } = controller;
            const endpoint = `/widgetApi/FindAffiliates/KeywordAffiliate/create`;
            fetchService
                .get(endpoint, createGroupParams, {
                    headers: NoCacheHeaders,
                    preventAutoCancellation: false,
                    cancellation: signal,
                })
                .then((response: object) => {
                    const kwGroup = _.mapKeys<any>(response, (v, k) => _.capitalize(k));
                    if (!kwGroup.Id) {
                        kwGroup.Id = `${Date.now()}`;
                    }
                    const Name = getStoredGroupName(
                        keyword,
                        i18nFilter(),
                        keywordsGroupsService.userGroups,
                        TITLE_MAX_LENGTH,
                    );
                    setOpportunitiesKeywords(JSON.stringify({ ...kwGroup, Name }));
                    swNavigator.go(swNavigator.current(), {
                        keyword: `*${kwGroup.Id}`,
                    });
                });
        }
        return () => {
            controller.abort();
        };
    }, [keyword]);

    const getDataCallback = (data) => {
        if (data.Categories) {
            setAllCategories(data.Categories);
        }
        setHideUtils(false);
    };

    const getInitialFilters = () => {
        params.filter = {};

        if (category) {
            params.filter.Category = category;
        }
        if (websiteType) {
            params.funcFlag = getWebsiteTypeOptions().find(
                (item) => i18nFilter()(item.text) === websiteType,
            ).id;
        }
        if (search) {
            params.filter.domain = search;
        }

        params.orderBy = orderBy ? orderBy : "Share desc";

        return apiHelper.transformParamsForAPI(params);
    };

    const getColumns = (useSelection) => {
        let sortedColumn;
        if (orderBy) {
            const [field, sortDirection] = orderBy.split(" ");
            sortedColumn = {
                field,
                sortDirection,
            };
        }
        return FindAffiliateByKeywordsTableSettings.getColumns(sortedColumn, useSelection);
    };

    const dataParamsAdapter = (params) => {
        const transformedParams = { ...params };
        const filters = [];

        if (transformedParams.filter.domain) {
            filters.push(
                `Domain;contains;"${decodeURIComponent(transformedParams.filter.domain)}"`,
            );
        }

        if (transformedParams.filter.Category) {
            filters.push(`category;category;"${transformedParams.filter.Category}"`);
        }

        if (filters.length > 0) {
            transformedParams.filter = filters.join(",");
        } else {
            delete transformedParams.filter;
        }

        return transformedParams;
    };

    const transformData = (data) => {
        const parseCategory = (category: string) =>
            category ? category.replace(/_/g, " ").replace(/~/g, " > ") : "Other";

        const parseChildCategory = (category: string) =>
            category ? category.replace(/_/g, " ").replace(/\//g, " > ") : "Other";

        return {
            ...data,
            Records: data.Data.map((record) => {
                return {
                    ...record,
                    url: swNavigator.href("websites-worldwideOverview", {
                        ...swNavigator.getParams(),
                        key: record.Domain,
                        isWWW: "*",
                    }),
                    LeaderUrl: record.Leader
                        ? swNavigator.href("websites-worldwideOverview", {
                              ...swNavigator.getParams(),
                              key: record.Leader,
                              isWWW: "*",
                          })
                        : null,
                    Category: parseCategory(record.Category),
                    Children: Array.isArray(record.Children)
                        ? record.Children.map((child) => {
                              return {
                                  ...child,
                                  url: swNavigator.href("websites-worldwideOverview", {
                                      ...swNavigator.getParams(),
                                      key: child.Domain,
                                      isWWW: "*",
                                  }),
                                  LeaderUrl: child.Leader
                                      ? swNavigator.href("websites-worldwideOverview", {
                                            ...swNavigator.getParams(),
                                            key: child.Leader,
                                            isWWW: "*",
                                        })
                                      : null,
                                  Category: parseChildCategory(child.Category),
                              };
                          })
                        : null,
                };
            }),
        };
    };

    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
    };

    const getExcel = () => {
        const params = getInitialFilters();
        if (params.filter === "") {
            delete params.filter;
        }
        const queryStringParams = queryString.stringify(params);
        return `widgetApi/FindAffiliates/KeywordAffiliate/excel?seedKeyword=${
            swNavigator.getParams().keyword
        }&${queryStringParams}`;
    };

    const onDataError = () => {
        setHideUtils(true);
    };
    return !kwGroup ? (
        <GhostLoader />
    ) : bigGroup ? (
        <FindAffiliateByKeywordsEmptyState bigGroup />
    ) : hideTopBar ? (
        <FindAffiliateByKeywordsEmptyState />
    ) : (
        <SWReactTableWrapperWithSelection
            serverApi="widgetApi/FindAffiliates/KeywordAffiliate/table"
            tableColumns={getColumns(hasCustomCategoriesPermission)}
            initialFilters={getInitialFilters()}
            recordsField="Records"
            totalRecordsField="TotalCount"
            pageIndent={1}
            getDataCallback={getDataCallback}
            transformData={transformData}
            requestBody={kwGroup.Keywords}
            onSort={onSort}
            onDataError={onDataError}
            tableSelectionKey="FindAffiliateByKeywordsTable"
            maxSelectedRows={MAX_DOMAINS_IN_CATEGORY}
            dataParamsAdapter={dataParamsAdapter}
            tableSelectionProperty="Domain"
            tableOptions={{
                aboveHeaderComponents: [
                    <DomainSelection
                        key="DomainSelection"
                        showToast={showToast}
                        clearAllSelectedRows={clearAllSelectedRows}
                        selectedRows={selectedRows}
                    />,
                ],
                tableSelectionTrackingParam: "Domain",
                metric: "find_affiliate_by_opportunities",
            }}
        >
            {(topComponentProps) => (
                <FindAffiliateByKeywordsTableTop
                    {...topComponentProps}
                    searchTerm={search}
                    selectedCategoryId={category}
                    selectedCategory={categoryName}
                    allCategories={allCategories}
                    excelLink={getExcel()}
                    downloadExcelPermitted={downloadExcelPermitted}
                    selectedWebsiteType={websiteType}
                    excelRequestBody={kwGroup.Keywords}
                    hideTopBar={hideTopBar}
                    useSelection={hasCustomCategoriesPermission}
                    hideUtils={hideUtils}
                />
            )}
        </SWReactTableWrapperWithSelection>
    );
};
const mapStateToProps = ({
    routing: { params },
    tableSelection: { FindAffiliateByKeywordsTable },
}): any => {
    return {
        params,
        selectedRows: FindAffiliateByKeywordsTable,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator(
                    "FindAffiliateByKeywordsTable",
                    "Domain",
                ).clearAllSelectedRows(),
            );
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () =>
                            TrackWithGuidService.trackWithGuid(
                                "find_affiliate_by_keywords.partner_list.created",
                                "click",
                            ),
                    }),
                ),
            );
        },
    };
};

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(FindAffiliateByKeywordsTable),
    "FindAffiliateByKeywordsTable",
);

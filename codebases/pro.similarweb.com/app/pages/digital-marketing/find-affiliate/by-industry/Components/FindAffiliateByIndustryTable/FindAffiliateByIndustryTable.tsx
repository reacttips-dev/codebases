import React, { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { Injector } from "common/ioc/Injector";
import { ICategory } from "common/services/categoryService.types";
import { FindAffiliateByIndustryTableTop, ISource } from "./FindAffiliateByIndustryTableTop";
import { swSettings } from "common/services/swSettings";
import {
    DEFAULT_SORT_DIRECTION,
    DEFAULT_SORT_FIELD,
    getTableColumns,
} from "./FindAffiliateByIndustryTableSettings";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { showSuccessToast } from "actions/toast_actions";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { tableActionsCreator } from "actions/tableActions";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { SwNavigator } from "common/services/swNavigator";
import categoryService from "common/services/categoryService";

interface IParams {
    category: string;
    country: string;
    duration: string;
    webSource: string;
    selectedCategory: string;
    funcFlag: number;
    searchValue: string;
}

interface IFindAffiliateByIndustryTableProps {
    children?: React.ReactNode;
    params: IParams;
    showToast: (href, text, label) => void;
    selectedRows: any[];
    clearAllSelectedRows: () => void;
}

const FindAffiliateByIndustryTable: FunctionComponent<IFindAffiliateByIndustryTableProps> = (
    props,
) => {
    const [allCategories, setAllCategories] = useState<ICategory[]>([]);
    const [allSources, setAllSources] = useState<ISource[]>([]);
    const addToDashboardModal = useRef({ dismiss: () => null });
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    useEffect(() => {
        return () => {
            addToDashboardModal.current.dismiss();
        };
    }, [addToDashboardModal]);
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const {
        params: {
            category: categoryQueryParam,
            country,
            duration,
            webSource,
            selectedCategory,
            searchValue,
            funcFlag,
        },
    } = props;
    const categoryObject = categoryService.categoryQueryParamToCategoryObject(categoryQueryParam);
    const { forApi: category, forDisplayApi: categoryDisplayApi } = categoryObject;
    const durationObject = DurationService.getDurationData(duration);
    const { from, to, isWindow } = durationObject.forAPI;
    const params = {
        category,
        country,
        from,
        includeSubDomains: true,
        isWindow,
        keys: category,
        timeGranularity: "Monthly",
        to,
        webSource,
        sourceType: "Referral",
        categoryDisplayApi,
    } as any;
    const [sort, setSort] = useState<{ field; sortDirection }>();

    const initialFilters: any = {
        ...params,
        sourceType: "Referral", // hard coded to fetch the Referral filter data for table
        category: selectedCategory,
        Domain: searchValue,
        funcFlag,
        page: 1,
        orderBy: `${DEFAULT_SORT_FIELD} ${DEFAULT_SORT_DIRECTION}`,
    };

    const dataParamsAdapter = (params) => {
        const transformedParams = { ...params };
        const filters = [];
        if (transformedParams.sourceType) {
            filters.push(`sourceType;==;"${transformedParams.sourceType}"`);
        }
        if (transformedParams.category) {
            filters.push(`category;category;"${transformedParams.category}"`);
        }
        if (transformedParams.Domain) {
            filters.push(`Domain;contains;"${decodeURIComponent(transformedParams.Domain)}"`);
        }
        if (categoryObject.isCustomCategory) {
            params.categoryHash = categoryObject.categoryHash;
        }
        transformedParams.filter = filters.join(",");

        // sorting
        if (params.sort) {
            const orderBy = `${params.sort} ${params.asc ? "asc" : "desc"}`;
            delete transformedParams.sort;
            delete transformedParams.asc;
            transformedParams.orderBy = orderBy;
        }

        return transformedParams;
    };

    const getDataCallback = (data): void => {
        const {
            Filters: { category, sourceType },
        } = data;
        setAllCategories(category);
        setAllSources(sourceType);
    };
    const onSort = ({ field, sortDirection }) => {
        setSort({ field, sortDirection });
    };
    const transformData = (data) => {
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
                              };
                          })
                        : null,
                };
            }),
        };
    };
    const tableColumns = useMemo(() => {
        return getTableColumns(sort);
    }, [sort]);

    return (
        <SWReactTableWrapperWithSelection
            serverApi="/widgetApi/IndustryAnalysis/IndustryAffiliate/Table"
            tableColumns={tableColumns}
            initialFilters={initialFilters}
            recordsField="Records"
            totalRecordsField="TotalCount"
            cleanOnUnMount={true}
            pageIndent={1}
            getDataCallback={getDataCallback}
            onSort={onSort}
            tableOptions={{
                aboveHeaderComponents: [
                    <DomainSelection
                        key="DomainSelection"
                        showToast={props.showToast}
                        clearAllSelectedRows={props.clearAllSelectedRows}
                        selectedRows={props.selectedRows}
                    />,
                ],
                tableSelectionTrackingParam: "Domain",
            }}
            tableSelectionKey="FindAffiliateByIndustry"
            tableSelectionProperty="Domain"
            dataParamsAdapter={dataParamsAdapter}
            transformData={transformData}
        >
            {(topComponentProps) => (
                <FindAffiliateByIndustryTableTop
                    {...topComponentProps}
                    allCategories={allCategories}
                    allSources={allSources}
                    downloadExcelPermitted={downloadExcelPermitted}
                    searchValue={searchValue}
                    dataParamsAdapter={dataParamsAdapter}
                />
            )}
        </SWReactTableWrapperWithSelection>
    );
};
const mapStateToProps = ({
    routing: { params },
    tableSelection: { FindAffiliateByIndustry },
}): { params: IParams; selectedRows: any[] } => {
    return {
        params,
        selectedRows: FindAffiliateByIndustry,
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator("FindAffiliateByIndustry", "Domain").clearAllSelectedRows(),
            );
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () => {
                            TrackWithGuidService.trackWithGuid(
                                "find_affiliate_by_industry.partner_list.created",
                                "click",
                            );
                        },
                    }),
                ),
            );
        },
    };
};

export const FindAffiliateByIndustryTableContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(FindAffiliateByIndustryTable);

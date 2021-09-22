import { tableActionsCreator } from "actions/tableActions";
import { showSuccessToast } from "actions/toast_actions";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { SWReactTableWrapperWithSelection } from "components/React/Table/SWReactTableWrapperSelectionContext";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { KeywordCompetitorsTableTop } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsTableTop";
import * as queryString from "query-string";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { getColumns } from "pages/website-analysis/keyword-competitors/KeywordCompetitorsPageColumns";
import { SwNavigator } from "common/services/swNavigator";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";

const KeywordCompetitorsPage: FunctionComponent<any> = (props) => {
    const downloadExcelPermitted = swSettings.current.resources.IsExcelAllowed;
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const chosenSites = Injector.get("chosenSites");
    const $modal = Injector.get("$modal");
    const $rootScope = Injector.get("$rootScope");
    const widgetModelAdapterService = Injector.get("widgetModelAdapterService");
    const addToDashboardModal = useRef({ dismiss: () => null });
    useEffect(() => {
        return () => {
            addToDashboardModal.current.dismiss();
        };
    }, [addToDashboardModal]);
    const [tableData, setTableData] = useState();
    const [allCategories, setAllCategories] = useState([]);
    const [mainSiteData, setMainSiteData] = useState<any>();
    const chosenItems = chosenSites.map((item, infoItem) => {
        return { name: item, displayName: infoItem.displayName, icon: infoItem.icon };
    });
    const CATEGORY_ALL = "All";

    const {
        params: {
            key,
            country,
            isWWW,
            duration,
            selectedSite,
            risingCompetitors,
            newCompetitors,
            category,
            webSource,
            search,
            websiteType,
            orderby = "Affinity desc",
        },
        selectedRows,
        clearAllSelectedRows,
        showToast,
        tabMetaData,
    } = props;
    const isCompare = chosenSites.isCompare();

    const { from, to } = DurationService.getDurationData(duration).forAPI;

    const getInitialParams = () => {
        const sort = orderby.split(" ")[0];
        const asc = orderby.split(" ")[1] === "asc";

        return {
            country,
            keys: key.split(",")[0],
            includeSubdomains: isWWW === "*",
            category: category !== CATEGORY_ALL ? category : undefined, //fix default category param All
            to,
            from,
            sort,
            asc,
            search,
            websiteType,
            risingCompetitors: risingCompetitors === "true",
            newCompetitors: newCompetitors === "true",
            webSource,
            searchType: props.params[props.tabMetaData.searchTypeParam],
            page: 0,
            pageSize: 400,
        };
    };

    const getDataCallback = (data) => {
        const { CategoriesCount: Categories, TotalTraffic, Traffic } = data.Header;
        setAllCategories(Categories);
        setTableData(data.Data);
        setMainSiteData({
            TotalTraffic,
            Traffic,
        });
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
                    }),
                    Affinity: record.Affinity,
                    KeywordOverlap: record.KwCount,
                    TotalKeywords: record.KwTotal,
                    OrganicTraffic: record.OrganicTraffic,
                    TotalTraffic: record.TotalTraffic,
                };
            }),
        };
    };
    const onSort = ({ field, sortDirection }) => {
        swNavigator.applyUpdateParams({
            orderby: `${field} ${sortDirection}`,
        });
    };
    const getExcelUrl = () => {
        const adaptedParams = dataParamsAdapter(getInitialParams());
        const queryStringParams = queryString.stringify(adaptedParams);
        return `${tabMetaData.excelApi}?${queryStringParams}`;
    };

    const a2d = () => {
        const params = dataParamsAdapter({
            risingCompetitors,
            newCompetitors,
            category,
            search,
            websiteType,
        });

        const chosenWebsite = chosenItems[0];
        addToDashboardModal.current = addToDashboard({
            metric: tabMetaData.a2dMetric,
            type: "Table",
            webSource,
            modelType: "fromWebsite",
            filters: { filter: params.filter },
            overrideAddToDashboardParams: {
                ...params,
                key: [{ image: chosenWebsite.icon, ...chosenWebsite }],
            },
        });
    };

    const dataParamsAdapter = (params) => {
        const transformedParams = { ...params };
        const filter = [];
        // category
        if (transformedParams.category) {
            filter.push(`category;contains;"${transformedParams.category.replace("~", "/")}"`);
            delete transformedParams.category;
        }
        // search
        if (transformedParams.search) {
            filter.push(`domain;contains;"${transformedParams.search}"`);
            delete transformedParams.search;
        }

        // website type
        if (transformedParams.websiteType) {
            filter.push(`SiteFunctionality;==;"${transformedParams.websiteType}"`);
            delete transformedParams.websiteType;
        }

        // search type
        if (transformedParams.searchType) {
            filter.push(`${transformedParams.searchType};==;true`);
            delete transformedParams.searchType;
        }

        // new
        if (transformedParams.newCompetitors) {
            filter.push(`isnew;==;${JSON.parse(newCompetitors)}`);
        }
        delete transformedParams.newCompetitors;

        // rising
        if (transformedParams.risingCompetitors) {
            filter.push(`isrise;==;${JSON.parse(risingCompetitors)}`);
        }
        delete transformedParams.risingCompetitors;

        if (filter.length > 0) {
            transformedParams.filter = filter.join(",");
        }
        // selected domain
        if (transformedParams.selectedSite) {
            transformedParams.keys = transformedParams.selectedSite;
            delete transformedParams.selectedSite;
        }

        // orderby
        transformedParams.orderby = `${transformedParams.sort} ${
            transformedParams.asc ? "asc" : "desc"
        }`;

        if (typeof transformedParams.page == "number") {
            transformedParams.page += 1;
        }
        delete transformedParams.sort;
        delete transformedParams.asc;
        delete transformedParams.orderBy;

        return transformedParams;
    };
    return (
        <SWReactTableWrapperWithSelection
            shouldSelectRow={(row) => row.Domain !== "grid.upgrade"}
            tableSelectionKey={tabMetaData.metric}
            tableSelectionProperty="Domain"
            maxSelectedRows={MAX_DOMAINS_IN_CATEGORY}
            cleanOnUnMount={true}
            fetchServerPages={4}
            rowsPerPage={100}
            selectAllCount={100}
            tableOptions={{
                aboveHeaderComponents: [
                    <DomainSelection
                        key="DomainSelection"
                        appendTo={`.${tabMetaData.metric} .swReactTable-header-wrapper`}
                        showToast={showToast}
                        clearAllSelectedRows={clearAllSelectedRows}
                        selectedRows={selectedRows}
                    />,
                ],
                showCompanySidebar: true,
                metric: tabMetaData.metric,
                tableSelectionTrackingParam: "Domain",
                trackName: tabMetaData.tableSelectionTracking,
                customTableClass: tabMetaData.metric,
            }}
            serverApi={tabMetaData.tableApi}
            tableColumns={getColumns({
                tabMetaData,
                orderBy: orderby,
                onSelectCategory: (cat) => {
                    allTrackers.trackEvent("Internal Link", "click", `Category/${cat}`);
                    swNavigator.applyUpdateParams(
                        { category: cat.replace("/", "~") },
                        { reload: true },
                    );
                },
                isPaid: tabMetaData.isPaid === true,
            })}
            initialFilters={getInitialParams()}
            recordsField="Records"
            totalRecordsField="TotalCount"
            onSort={onSort}
            getDataCallback={getDataCallback}
            transformData={transformData}
            dataParamsAdapter={dataParamsAdapter}
        >
            {(topComponentProps) => (
                <KeywordCompetitorsTableTop
                    {...topComponentProps}
                    isCompare={isCompare}
                    allCategories={allCategories}
                    selectedSites={chosenItems}
                    selectedSite={selectedSite}
                    downloadExcelPermitted={downloadExcelPermitted}
                    excelLink={getExcelUrl()}
                    a2d={a2d}
                    tableData={tableData}
                    searchTypeParam={props.tabMetaData.searchTypeParam}
                    searchTypes={props.tabMetaData.searchTypes}
                    searchTypeFilterPlaceholder={props.tabMetaData.searchTypeFilterPlaceholder}
                    title={props.tabMetaData.title}
                    mainSiteData={mainSiteData}
                />
            )}
        </SWReactTableWrapperWithSelection>
    );
};

const mapStateToProps = (
    { routing: { params }, tableSelection },
    { tabMetaData: { tableSelectionKey } },
) => {
    return {
        params,
        selectedRows: tableSelection[tableSelectionKey],
    };
};
const mapDispatchToProps = (dispatch, { tabMetaData }) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(tableActionsCreator(tabMetaData.metric, "Domain").clearAllSelectedRows());
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: () =>
                            allTrackers.trackEvent(
                                "add to Custom Category",
                                "click",
                                "internal link/websites.overview",
                            ),
                    }),
                ),
            );
        },
    };
};

export const Connected = connect(mapStateToProps, mapDispatchToProps)(KeywordCompetitorsPage);

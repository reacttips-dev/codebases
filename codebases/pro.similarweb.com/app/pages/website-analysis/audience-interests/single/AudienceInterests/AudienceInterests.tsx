import { swSettings } from "common/services/swSettings";
import { AudienceInterestsOverlapTable } from "pages/website-analysis/audience-interests/single/AudienceInterestsOverlapTable";
import { AudienceInterestsTableSettings } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableSettings";
import { AudienceInterestsTableTop } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsTableTop";
import { ReferralsPage } from "pages/website-analysis/incoming-traffic/StyledComponents";
import * as queryString from "query-string";
import React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../../scripts/common/services/swNavigator";
import { tableActionsCreator } from "../../../../../actions/tableActions";
import { showSuccessToast } from "../../../../../actions/toast_actions";
import { SWReactTableWrapperWithSelection } from "../../../../../components/React/Table/SWReactTableWrapperSelectionContext";
import { getToastItemComponent } from "../../../../../components/React/Toast/ToastItem";
import SWReactRootComponent from "../../../../../decorators/SWReactRootComponent";
import { i18nCategoryFilter } from "../../../../../filters/ngFilters";
import { allTrackers } from "../../../../../services/track/track";
import CountryService from "services/CountryService";
import {
    IAudienceInterestsApiData,
    IAudienceInterestsProps,
    IAudienceInterestsState,
} from "./AudienceInterestsTypes";
import { DomainSelection } from "components/React/TableSelectionComponents/DomainSelection";
import dayjs from "dayjs";
import { MAX_DOMAINS_IN_CATEGORY } from "components/customCategoriesWizard/custom-categories-wizard-react";
import { apiHelper } from "common/services/apiHelper";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { buildSearchFilterForTable } from "../AudienceInterestsUtils";
import categoryService from "common/services/categoryService";

declare const similarweb;

class AudienceInterests extends React.PureComponent<
    IAudienceInterestsProps,
    IAudienceInterestsState
> {
    private dropdownRef;
    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private swSettings: any = swSettings;
    private chosenSites = Injector.get<any>("chosenSites");
    private modalService = Injector.get<any>("$modal");

    constructor(props) {
        super(props);
        this.dropdownRef = React.createRef();
        this.state = {
            newGroupLoading: false,
            newGroupType: null,
            newGroupError: false,
            newGroupErrorMessage: null,
            allCategories: [],
            customCategories: [],
            topics: [],
        };
    }

    public componentDidMount() {
        const { duration } = this.swNavigator.getParams();
        const currentState: any = this.swNavigator.current();
        const durationData = DurationService.getDurationData(duration);
        if (!currentState?.overrideDatepickerPreset.includes(duration)) {
            const latestValid = DurationService.getDurationData(
                currentState.overrideDatepickerPreset[0],
            );
            const closestPreset = DurationService.getClosestPreset(
                durationData.raw.from,
                latestValid.raw.to,
                currentState.overrideDatepickerPreset,
            );
            this.swNavigator.go(
                currentState,
                Object.assign(this.swNavigator.getParams(), {
                    duration: closestPreset ? closestPreset : "3m",
                }),
            );
        }
    }

    private getCustomUserCategoriesLastUpdated = (): Date => {
        return UserCustomCategoryService.getCustomCategoriesLastUpdated();
    };

    private getSelectedCategoryIds = (): string[] => {
        const { audienceCategory, customCategory } = this.swNavigator.getParams();

        const customCategoryIds = customCategory ? customCategory.split(",") : [];
        const audienceCategoryIds = audienceCategory ? audienceCategory.split(",") : [];
        const allCategoryIds = [...customCategoryIds, ...audienceCategoryIds];

        // The audienceInterestsTableTop expects to have an array
        // with "" in case no id is selected. therefore we
        // check if we have any selected ids
        return allCategoryIds.length > 0 ? allCategoryIds : [""];
    };

    public render() {
        const downloadExcelPermitted = this.swSettings.current.resources.IsExcelAllowed;
        const {
            search,
            webSource = "Desktop",
            duration,
            country,
            isWWW,
        } = this.swNavigator.getParams();
        const durationData = DurationService.getDurationData(duration, "", "WebAnalysis");
        const { from, to, isWindow } = durationData.forAPI;
        const chosenSites = this.chosenSites.sitelistForLegend();
        const selectedCategoryIds = this.getSelectedCategoryIds();

        const hasCustomCategoriesPermission = categoryService.hasCustomCategoriesPermission();

        return (
            <ReferralsPage className="sharedTooltip">
                {chosenSites.length > 1 && (
                    <AudienceInterestsOverlapTable
                        chosenSites={chosenSites}
                        duration={{ from, to, isWindow }}
                        webSource={webSource}
                        country={country}
                        isWWW={isWWW}
                        getCountryById={this.getCountryById}
                        onOverlapTableSelect={this.onOverlapTableSelect}
                        openCompareModal={this.openCompareModal}
                    />
                )}
                <SWReactTableWrapperWithSelection
                    tableSelectionKey="AudienceInterestsTable"
                    tableSelectionProperty="Domain"
                    maxSelectedRows={MAX_DOMAINS_IN_CATEGORY}
                    cleanOnUnMount={true}
                    serverApi={this.getApiEndpoint()}
                    initialFilters={this.getInitialFilters()}
                    tableColumns={this.getColumns(hasCustomCategoriesPermission)}
                    transformData={this.transformData}
                    getDataCallback={this.onGetData}
                    tableOptions={{
                        metric: "MarketingWorkspaceWebsiteGroupTable",
                        aboveHeaderComponents: [
                            <DomainSelection
                                key="DomainSelection"
                                showToast={this.props.showToast}
                                clearAllSelectedRows={this.props.clearAllSelectedRows}
                                selectedRows={this.props.selectedRows}
                            />,
                        ],
                        showCompanySidebar: true,
                        tableSelectionTrackingParam: "Domain",
                        trackName: "Traffic Sources",
                    }}
                    recordsField="records"
                    totalRecordsField="TotalCount"
                    onSort={this.onSort}
                    pageIndent={1}
                >
                    {(topComponentProps) => (
                        <AudienceInterestsTableTop
                            {...topComponentProps}
                            duration={{ from, to }}
                            webSource={webSource}
                            country={country}
                            getCountryById={this.getCountryById}
                            searchTerm={search}
                            selectedCategories={selectedCategoryIds}
                            allCategories={this.state.allCategories}
                            customCategories={this.state.customCategories}
                            excelLink={this.getExcel()}
                            downloadExcelPermitted={downloadExcelPermitted}
                            topics={this.state.topics}
                            categoriesData={this.state.categoriesData}
                            domainMetaData={this.state.domainMetaData}
                            domains={this.chosenSites.sitelistForLegend()}
                            selectedDomain={this.getSelectedSite()}
                        />
                    )}
                </SWReactTableWrapperWithSelection>
            </ReferralsPage>
        );
    }

    public getSelectedSite = () => {
        const sites = this.chosenSites.sitelistForLegend();
        const { selectedSite } = this.swNavigator.getParams();
        const selectedSiteItem = sites.find((site) => site.name === selectedSite);
        if (selectedSite && selectedSiteItem) {
            return selectedSiteItem;
        } else {
            return sites[0];
        }
    };

    public getColumns = (useSelection) => {
        const { orderBy, duration } = this.swNavigator.getParams();
        let sortedColumn;
        if (orderBy) {
            const [field, sortDirection] = orderBy.split(" ");
            sortedColumn = {
                field,
                sortDirection,
            };
        }
        const columns = AudienceInterestsTableSettings.getColumns(
            sortedColumn,
            duration === "28d",
            useSelection,
        );
        return columns;
    };

    public getInitialFilters = () => {
        // const {country, key, webSource} = this.props;
        const params = this.swNavigator.getParams();
        params.filter = {};

        // search
        if (params.search) {
            const { filter } = buildSearchFilterForTable("Domain", params.search);
            params.filter = filter;
            delete params.search;
        }
        // orderBy
        if (!params.orderBy) {
            params.orderBy = "RelevancyScore desc";
        }

        if (!params.customCategoryUpdatedOn) {
            // Add custom category updated-on timestamp
            // this is used to fix caching issue of custom categories
            // (cache busting, whenever a custom category gets updated, we want to refresh
            // the results returned from the API. see JIRA SIM-29206 for more details)
            const customCategoriesUpdateTimestamp = this.getCustomUserCategoriesLastUpdated();
            params.customCategoryUpdatedOn = `${dayjs(customCategoriesUpdateTimestamp).unix()}`;
        }

        // selectedSite should override 'key'
        if (params.selectedSite) {
            params.key = this.getSelectedSite().name;
            delete params.selectedSite;
        }
        const apiParams = apiHelper.transformParamsForAPI(params);

        // category
        if (params.audienceCategory) {
            apiParams.category = params.audienceCategory;
            delete apiParams.audienceCategory;
        }

        return apiParams;
    };

    public getApiEndpoint = () => {
        return "/api/websiteanalysis/GetAudienceInterestsTable";
    };

    public transformData = (data) => {
        return {
            ...data,
            records: data.Records.map((record) => {
                return {
                    ...record,
                    url: this.swNavigator.href("websites-worldwideOverview", {
                        ...this.swNavigator.getParams(),
                        key: record.Domain,
                    }),
                    Rank: record.Rank === -1 ? 0 : record.Rank,
                };
            }),
        };
    };

    public onGetData = (data: IAudienceInterestsApiData) => {
        const domainName = this.getSelectedSite().name;

        this.setState({
            allCategories: data.Categories[domainName],
            customCategories: data?.CustomCategories ?? [],
            topics: data.Topics,
            categoriesData: similarweb.utils
                .formatTopList(data.Categories[domainName], 6, {
                    transformFunction: similarweb.utils.addCategoryIdFromName,
                })
                .map((cat) => {
                    return {
                        category: i18nCategoryFilter()(cat.Name),
                        categoryApi: cat.Id,
                        ...Object.entries(data.Categories[domainName]).reduce(
                            (acc, [domain, domainCategories]) => {
                                return {
                                    ...acc,
                                    [domainName]: cat.Value,
                                };
                            },
                            {},
                        ),
                    };
                }),
            domainMetaData: [
                {
                    icon: this.chosenSites.listInfo[domainName].icon,
                    name: domainName,
                    color: this.chosenSites.getSiteColor(domainName),
                },
            ],
        });
    };

    public getExcel = () => {
        const params = this.getInitialFilters();
        const domain = this.getSelectedSite().name;
        params.key = domain;
        const queryStringParams = queryString.stringify(params);
        return `export/analysis/GetAudienceInterestsTsv?${queryStringParams}`;
    };

    public onAdd = (s) => (event) => {};

    public onSort = ({ field, sortDirection }) => {
        this.swNavigator.applyUpdateParams({
            orderBy: `${field} ${sortDirection}`,
        });
    };

    public setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }

    public onListTypeSelect = (typeId) => {
        this.setState({ newGroupType: typeId });
    };

    private getCountryById = (id) => CountryService.getCountryById(id);
    private onOverlapTableSelect = (selectedSite) => {
        this.swNavigator.applyUpdateParams({ selectedSite });
    };
    private openCompareModal = () => {
        this.modalService.open({
            templateUrl: "/partials/websites/modal-compare.html",
            controller: "ModalCompareInstanceCtrl",
            controllerAs: "ctrl",
        });
    };
}

const mapStateToProps = ({ routing: { params }, tableSelection: { AudienceInterestsTable } }) => {
    return {
        params,
        selectedRows: AudienceInterestsTable,
    };
};

export const mapDispatchToProps = (dispatch) => {
    return {
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator("AudienceInterestsTable", "Domain").clearAllSelectedRows(),
            ); // todo
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

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps, null, {
        areStatesEqual: (next, prev) => {
            if (
                next.routing.currentPage !== "websites-audienceInterests" &&
                next.routing.currentPage !== "companyresearch_website_audienceInterests" &&
                next.routing.currentPage !== "accountreview_website_audience_interests"
            ) {
                return true;
            } else {
                return next === prev;
            }
        },
    })(AudienceInterests),
    "AudienceInterests",
);

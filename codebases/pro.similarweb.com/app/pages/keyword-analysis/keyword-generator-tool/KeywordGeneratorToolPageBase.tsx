import { setBooleanSearchTerms } from "actions/keywordGeneratorToolActions";
import { showSuccessToast } from "actions/toast_actions";
import { swSettings } from "common/services/swSettings";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { TableSelectionGroupKeywordComponent } from "components/TableSelection/src/TableSelectionGroupKeywordComponent";
import * as _ from "lodash";
import { MAIN_PROPS } from "pages/keyword-analysis/keyword-generator-tool/Constants";
import { KeywordGeneratorToolPageModal } from "pages/keyword-analysis/keyword-generator-tool/KeywordGeneratorToolPageModal";
import { BooleanSearchStateBased } from "pages/website-analysis/traffic-sources/search/BooleanSearchStateBased";
import {
    booleanSearchToObject,
    booleanSearchToString,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import queryString from "query-string";
import * as React from "react";
import styled from "styled-components";
import DurationService from "services/DurationService";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { IKeywordGroup } from "userdata";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { TableSelection } from "../../../../.pro-features/components/TableSelection/src/TableSelection";
import { ETableSelectionNewGroupDropdownMode } from "../../../../.pro-features/components/TableSelection/src/TableSelectionNewGroupDropdown";
import { Injector } from "../../../../scripts/common/ioc/Injector";
import { tableActionsCreator } from "../../../actions/tableActions";
import { ColumnsPickerModal } from "../../../components/React/ColumnsPickerModal/ColumnsPickerModal";
import {
    SWReactTableWrapperContextConsumer,
    SWReactTableWrapperWithSelection,
} from "../../../components/React/Table/SWReactTableWrapperSelectionContext";
import { numberFilter, i18nFilter, minVisitsAbbrFilter } from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { DownloadExcelContainer } from "../../workspace/StyledComponent";
import { KeywordGroupEditorHelpers } from "../KeywordGroupEditorHelpers";
import { KeywordGeneratorToolPageTableAbstract } from "./KeywordGeneratorToolPageTableAbstract";
import KeywordGeneratorToolPageTableHeader from "./KeywordGeneratorToolPageTableHeader";
import {
    BooleanSearchUtilityContainer,
    KeywordGeneratorToolPageTableHeaderStyled,
    TableHeaderItemContainer,
    TableHeaderItemsContainer,
    TableHeaderText,
} from "./styledComponents";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import TrialService from "services/TrialService";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { colorsPalettes } from "@similarweb/styles";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { ChipdownItem } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsTableTopStyles";
import { CpcFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/CpcFilter";
import { VolumeFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/VolumeFilter";
import { WebsiteKeywordsPageTableTopContextProvider } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { getWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { SwNavigator } from "common/services/swNavigator";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const FiltersContainers = styled(FlexRow)`
    padding: 10px 15px;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

const TableHeaderItem = ({ title, subtitle }) => {
    return (
        <TableHeaderItemContainer>
            <TableHeaderText weight={500} size={18}>
                {title}
            </TableHeaderText>
            <TableHeaderText>{subtitle}</TableHeaderText>
        </TableHeaderItemContainer>
    );
};

interface IKeywordGeneratorToolPageTableBaseProps {
    booleanSearchTerms: string;
    seedKeyword: string;
    isGroupContext: boolean;
    webSource: string;
    country: number;
    duration: string;
    cpcFromValue: string;
    cpcToValue: string;
    volumeFromValue: string;
    volumeToValue: string;
    clearAllSelectedRows: () => void;
    showToast: (href: string, text: string, label: string) => void;
    setBooleanSearchTerms: (s: string) => void;
    notify?: boolean;
    tableSelection: any; // artem: the real any here
    preventCountTracking: boolean;
    getDataCallback?: (data) => void;
    onDataError?: (err) => void;
    onKeywordsAddedToGroup: (
        group: IKeywordGroup,
        newlyCreatedGroup: boolean,
        workspaceId?: string,
    ) => void;
}

interface IKeywordGeneratorToolPageTableBaseState {
    totalVisits: number;
    totalRows: number;
    isTableSelectionLoading: boolean;
    isColumnsPickerOpen: boolean;
    tableSelectionIsValid: boolean;
    tableSelectionErrorMessage: string;
    tableSelectionMode: ETableSelectionNewGroupDropdownMode;
    isSuccessModalOpen: boolean;
    isCreateNewListModalOpen: boolean;
    groupName: string;
    newlyCreatedGroup: boolean;
    workspaceId: string;
    tableSelectionCurrentGroup: string;
    orderBy: {
        field: string;
        sortDirection: string;
    };
    number: number;
}

export class KeywordGeneratorToolPageTableBase extends KeywordGeneratorToolPageTableAbstract<
    IKeywordGeneratorToolPageTableBaseProps,
    IKeywordGeneratorToolPageTableBaseState
> {
    public static defaultProps = {
        notify: false,
    };
    protected swNavigator = Injector.get<any>("swNavigator");
    protected swSettings = swSettings;
    protected i18nFilter = i18nFilter();
    protected numberFilter = numberFilter();
    protected visitNumberFilter = minVisitsAbbrFilter();
    protected dropdownRef;
    protected maxKeywordsInGroup = KeywordGroupEditorHelpers.getMaxGroupCount();
    protected tableSelectionKey = "KeywordGeneratorToolTable";
    protected tableSelectionProperty = "keyword";
    protected groupsData;
    protected tableSettings;
    protected pageName;
    protected tableApiUrl;
    protected tableApiExcelUrl;
    protected tableStorageKey;
    protected dropdownAppendTo;
    protected transformData;

    protected trialService: any;
    protected isTrial: boolean;

    constructor(props, context) {
        super(props, context);
        this.trialService = new TrialService();
        this.isTrial = this.trialService.isTrial();
        this.state = {
            isColumnsPickerOpen: false,
            totalVisits: 0,
            totalRows: 0,
            tableSelectionCurrentGroup: null,
            tableSelectionErrorMessage: null,
            isTableSelectionLoading: false,
            tableSelectionIsValid: true,
            isSuccessModalOpen: false,
            newlyCreatedGroup: false,
            isCreateNewListModalOpen: false,
            groupName: "",
            workspaceId: "",
            tableSelectionMode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
            orderBy: {
                field: "",
                sortDirection: "",
            },
            number: 0,
        };
    }

    public UNSAFE_componentWillMount(): void {
        if (this.pageName !== "TrendingTable") {
            this.setState({
                orderBy: {
                    field: this.tableSettings.defaultSortField,
                    sortDirection: this.tableSettings.defaultSortDirection,
                },
            });
        }
    }

    public componentDidUpdate(prevProps: Readonly<IKeywordGeneratorToolPageTableBaseProps>): void {
        MAIN_PROPS.forEach((prop) => {
            if (prevProps[prop] !== this.props[prop]) {
                this.setState({ totalVisits: 0, totalRows: 0 });
            }
            if (prevProps.seedKeyword !== this.props.seedKeyword) {
                this.props.clearAllSelectedRows();
                this.props.setBooleanSearchTerms(undefined);
            }
        });
    }

    public getColumns(filters) {
        const columns = this.tableSettings.getColumns(
            {
                field: filters.sort,
                sortDirection: filters.asc ? "asc" : "desc",
            },
            filters.websource,
        );
        return columns;
    }

    public render() {
        const filters = this.getTableFilters();
        const columns = this.tableSettings.getColumns(
            {
                field: filters.sort,
                sortDirection: filters.asc ? "asc" : "desc",
            },
            filters.websource,
            filters.country,
            this.props.duration,
        );

        return (
            <>
                <SWReactTableWrapperWithSelection
                    shouldSelectRow={(row) => row.keyword !== "grid.upgrade"}
                    pageIndent={1}
                    preventCountTracking={this.props.preventCountTracking}
                    allowClientSort={true}
                    tableSelectionKey={this.tableSelectionKey}
                    tableSelectionProperty={this.tableSelectionProperty}
                    getDataCallback={this.getDataCallback}
                    cleanOnUnMount={false}
                    serverApi={this.tableApiUrl}
                    onSort={this.onSort}
                    tableColumns={columns}
                    initialFilters={filters}
                    transformData={this.transformData}
                    onDataError={this.onDataError}
                    tableOptions={{
                        noDataTitle: i18nFilter()("keyword.generator.tool.table.nodata.title"),
                        noDataSubtitle: i18nFilter()(
                            "keyword.generator.tool.table.nodata.subtitle",
                        ),
                        metric: this.tableStorageKey,
                        tableSelectionTrackingParam: "keyword",
                        aboveHeaderComponents: [
                            this.getTableSelectionComponent(
                                this.getDropdown(this.dropdownAppendTo),
                            ),
                        ],
                    }}
                >
                    {(topComponentProps) => (
                        <KeywordGeneratorToolPageTableHeader
                            {...topComponentProps}
                            getDurationApiParams={this.getDurationApiParams}
                        >
                            {this.getTableHeaderChildren(
                                topComponentProps.tableColumns,
                                topComponentProps.onClickToggleColumns,
                            )}
                        </KeywordGeneratorToolPageTableHeader>
                    )}
                </SWReactTableWrapperWithSelection>
                <ColumnsPickerModal
                    isOpen={this.state.isColumnsPickerOpen}
                    onCancelClick={this.toggleColumnsPicker}
                    onApplyClick={this.onApplyColumnsPicker}
                    groupsData={this.groupsData}
                    columnsData={this.tableSettings.getColumns(
                        {
                            field: filters.sort,
                            sortDirection: this.tableSettings.defaultSortDirection,
                        },
                        filters.websource,
                    )}
                    showRestore={true}
                    defaultColumnsData={this.tableSettings.getColumns(
                        {
                            field: filters.sort,
                            sortDirection: this.tableSettings.defaultSortDirection,
                        },
                        filters.websource,
                    )}
                    storageKey={this.tableStorageKey}
                />
                <KeywordGeneratorToolPageModal
                    isOpen={this.state.isSuccessModalOpen}
                    onCloseClick={this.onModalClose}
                    onViewGroupClick={this.onViewGroupClick}
                    onStartOverClick={this.onStartOverClick}
                    newlyCreatedGroup={this.state.newlyCreatedGroup}
                />
            </>
        );
    }

    private onModalClose = () => {
        this.setState({ isSuccessModalOpen: false });
    };

    private onStartOverClick = () => {
        this.props.clearAllSelectedRows();
        this.setState({ isSuccessModalOpen: false });
    };

    private onViewGroupClick = () => {
        const { country, duration, webSource } = this.swNavigator.getParams();
        const { groupName } = this.state;
        this.swNavigator.go("keywordAnalysis-overview", {
            country,
            duration,
            keyword: `*${groupName}`,
        });
    };

    protected onDataError = (err) => {
        if (typeof this.props.onDataError === "function") {
            this.props.onDataError(err);
        }
    };
    protected getTableFilters = () => {
        const durationObject = this.getDurationApiParams(this.props.duration);
        const rangeFilter = getRangeFilterQueryParamValue([
            createVolumeFilter(this.props.volumeFromValue, this.props.volumeToValue, "volume"),
            createCpcFilter(this.props.cpcFromValue, this.props.cpcToValue, "cpc"),
        ]);
        const filters: { [key: string]: string | boolean | number } = {
            keyword: this.props.seedKeyword,
            country: this.props.country,
            from: durationObject.forAPI.from,
            to: durationObject.forAPI.to,
            isWindow: durationObject.forAPI.isWindow,
            websource: this.props.webSource,
            sort: this.state.orderBy.field,
            asc: this.state.orderBy.sortDirection === "asc",
            rangeFilter,
            rowsPerPage: 100,
        };
        if (this.props.booleanSearchTerms) {
            const { booleanSearchTerms: booleanSearchTermsWithPrefix } = this.props;
            const { IncludeTerms, ExcludeTerms } = booleanSearchToObject(
                booleanSearchTermsWithPrefix,
            );
            filters.ExcludeTerms = ExcludeTerms;
            filters.IncludeTerms = IncludeTerms;
        } else {
            filters.ExcludeTerms = undefined;
            filters.IncludeTerms = undefined;
        }
        const { seedKeyword, isGroupContext } = this.props;

        if (isGroupContext && seedKeyword) {
            const keywordsGroup =
                KeywordsGroupUtilities.getGroupById(seedKeyword) ||
                KeywordsGroupUtilities.getGroupByName(seedKeyword);
            filters.GroupHash = keywordsGroup.GroupHash;
            filters.keyword = keywordsGroup.Id;
        }

        return filters;
    };
    protected onApplyColumnsPicker = (columns) => {
        this.toggleColumnsPicker();
    };
    protected toggleColumnsPicker = () => {
        this.setState({ isColumnsPickerOpen: !this.state.isColumnsPickerOpen });
    };
    private getColumnsPickerLiteProps = (tableColumns, onColumnToggle): IColumnsPickerLiteProps => {
        const columns = tableColumns.reduce((res, col, index) => {
            if (!col.fixed) {
                return [
                    ...res,
                    {
                        key: index.toString(),
                        displayName: col.displayName,
                        visible: col.visible,
                    },
                ];
            }
            return res;
        }, []);
        return {
            columns,
            onColumnToggle: onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };
    private booleanSearchValueChanged = (newBooleanSearchValue) => {
        const newBooleanSearchString = booleanSearchToString(newBooleanSearchValue, false);
        this.props.setBooleanSearchTerms(newBooleanSearchString);
    };

    private contextValue = () =>
        getWebsiteKeywordsPageTableTopContext({
            initialFiltersStateObject: { current: {} },
            nextTableParams: {
                cpcFromValue: this.props.cpcFromValue,
                cpcToValue: this.props.cpcToValue,
                volumeFromValue: this.props.volumeFromValue,
                volumeToValue: this.props.volumeToValue,
            },
            tableData: {},
            addTempParams: (values) => {
                Injector.get<SwNavigator>("swNavigator").applyUpdateParams(values);
            },
        });

    protected getTableHeaderChildren = (columns, onClickToggleColumns) => {
        const excelDownloadUrl = !this.isTrial ? this.getExcelLink() : "";
        let excelLinkHref = {};
        if (excelDownloadUrl !== "") {
            excelLinkHref = { href: excelDownloadUrl };
        }
        return (
            <>
                {this.state.totalRows > 0 && (
                    <TableHeaderItemsContainer>
                        <TableHeaderItem
                            title={this.numberFilter(this.state.totalRows)}
                            subtitle={this.i18nFilter(
                                "keyword.generator.tool.page.table.header.total.rows",
                            )}
                        />
                        <TableHeaderItem
                            title={this.visitNumberFilter(this.state.totalVisits)}
                            subtitle={this.i18nFilter(
                                "keyword.generator.tool.page.table.header.total.visits",
                            )}
                        />
                    </TableHeaderItemsContainer>
                )}
                <WebsiteKeywordsPageTableTopContextProvider value={this.contextValue()}>
                    <FiltersContainers alignItems="center">
                        <ChipdownItem>
                            <CpcFilterForWebsiteKeywords />
                        </ChipdownItem>
                        <ChipdownItem>
                            <VolumeFilterForWebsiteKeywords />
                        </ChipdownItem>
                    </FiltersContainers>
                </WebsiteKeywordsPageTableTopContextProvider>
                <KeywordGeneratorToolPageTableHeaderStyled>
                    <BooleanSearchUtilityContainer>
                        <BooleanSearchStateBased
                            onChange={this.booleanSearchValueChanged}
                            booleanSearchTerms={this.props.booleanSearchTerms}
                        />
                    </BooleanSearchUtilityContainer>
                    <FlexRow>
                        <DownloadExcelContainer {...excelLinkHref}>
                            <DownloadButtonMenu
                                Excel={true}
                                downloadUrl={excelDownloadUrl}
                                exportFunction={this.trackExcelDownload}
                                excelLocked={this.isTrial}
                            />
                        </DownloadExcelContainer>
                        <ColumnsPickerLite
                            {...this.getColumnsPickerLiteProps(columns, onClickToggleColumns)}
                            withTooltip
                        />
                    </FlexRow>
                </KeywordGeneratorToolPageTableHeaderStyled>
            </>
        );
    };
    protected trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Download Excel");
    };
    protected getExcelLink = () => {
        const tableFilters = this.getTableFilters();
        delete tableFilters.rowsPerPage;
        // removing the ExcludeTerms & IncludeTerms due to a backend bug.
        // in order to apply boolean search in the excel results, please remove the next two following lines.
        delete tableFilters.ExcludeTerms;
        delete tableFilters.IncludeTerms;
        const params = queryString.stringify(tableFilters);
        return `${this.tableApiExcelUrl}?${params}`;
    };
    protected getDataCallback = (data) => {
        this.setState({ totalVisits: data.totalVisits, totalRows: data.totalRecords });
        if (typeof this.props.getDataCallback === "function") {
            this.props.getDataCallback(data);
        }
    };
    protected tableSelectionOnSubmit = async (name) => {
        // prevent multiple submit click
        if (this.state.isTableSelectionLoading) {
            return;
        }
        const { isValid, errorMessage } = KeywordGroupEditorHelpers.validateTitle(name);
        if (!isValid) {
            this.setState({
                tableSelectionIsValid: isValid,
                tableSelectionErrorMessage: errorMessage,
            });
        } else {
            await this.toggleLoading();
            const group = KeywordGroupEditorHelpers.keywordGroupFromList({
                title: name,
                items: this.getSelectedRowsFromStore().map((keyword) => {
                    return { text: keyword };
                }),
            });
            allTrackers.trackEvent(
                "add to keyword group",
                "submit-ok",
                `Create New Keyword Group/Save/${name};${group.Keywords.length}`,
            );
            const result = await keywordsGroupsService.update(group);
            if (result) {
                const workspaceId = await marketingWorkspaceApiService.getOrCreateAnEmptyWorkspace();
                const createdGroup = result.find((record) => record.Name === name);
                if (workspaceId) {
                    if (createdGroup) {
                        if (this.props.notify) {
                            this.setState({
                                groupName: createdGroup.Id,
                                workspaceId,
                            });
                        }
                    }
                } else {
                    if (this.props.notify) {
                        this.setState({
                            groupName: createdGroup.Id,
                        });
                    }
                }
                await this.toggleLoading();
                this.props.clearAllSelectedRows();
                this.setState({
                    tableSelectionMode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
                    tableSelectionIsValid: true,
                    tableSelectionErrorMessage: null,
                    isCreateNewListModalOpen: false,
                    isSuccessModalOpen: true,
                    newlyCreatedGroup: true,
                });
                this.dropdownRef.close();
                const addedGroup = result.find((r) => r.Name === group.Name) || {};
                this.props.onKeywordsAddedToGroup(
                    {
                        ...group,
                        ...addedGroup,
                    },
                    true,
                    workspaceId,
                );
            } else {
                // error
                this.dropdownRef.close();
            }
        }
    };
    protected toggleLoading = async () => {
        return this.setStateAsync({
            isTableSelectionLoading: !this.state.isTableSelectionLoading,
        });
    };
    protected getSelectedRowsFromStore = () => {
        return this.props.tableSelection.KeywordGeneratorToolTable.map((item) => item.keyword);
    };
    protected setStateAsync = async (state) => {
        return new Promise<void>((resolve) => {
            this.setState(state, resolve);
        });
    };
    protected onExistingGroupClick = async (item) => {
        const currentGroup = keywordsGroupsService.findGroupById(item.id);
        const currentKeywords = currentGroup.Keywords.map((keyword) => {
            return { text: keyword };
        });
        const newKeywords = this.getSelectedRowsFromStore().map((keyword) => {
            return { text: keyword };
        });
        const withoutDuplications = _.uniqWith(
            [...currentKeywords, ...newKeywords],
            (crr, other) => crr.text === other.text,
        );
        const newKeywordsCount = withoutDuplications.length - currentKeywords.length;
        // if no new keywords was added
        await this.setStateAsync({
            tableSelectionCurrentGroup: currentGroup.Name,
        });
        if (newKeywordsCount === 0) {
            await this.setStateAsync({
                tableSelectionMode: ETableSelectionNewGroupDropdownMode.ALL_ITEMS_EXISTS,
            });
            this.dropdownRef.openWarning();
        }
        // new keywords added
        else {
            const group = KeywordGroupEditorHelpers.keywordGroupFromList(
                {
                    title: currentGroup.Name,
                    items: withoutDuplications,
                },
                currentGroup,
            );
            allTrackers.trackEvent(
                "add to keyword group",
                "click",
                `Edit Keyword Group/Save/${group.Name};${group.Keywords.length}`,
            );
            // check number of keywords in group
            if (group.Keywords.length > this.maxKeywordsInGroup) {
                this.setState({
                    tableSelectionMode: ETableSelectionNewGroupDropdownMode.MAX_ITEMS,
                });
            } else {
                const result = await keywordsGroupsService.update(group);
                if (result) {
                    this.props.clearAllSelectedRows();
                    this.setState({
                        tableSelectionMode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
                        tableSelectionIsValid: true,
                        tableSelectionErrorMessage: null,
                    });
                    this.dropdownRef.close();
                    this.props.onKeywordsAddedToGroup(group, false);
                    if (this.props.notify) {
                        this.showGroupLinkToast(
                            currentGroup.Name,
                            this.i18nFilter("table.selection.keywords.groupupdated", {
                                count: newKeywordsCount.toString(),
                            }),
                            this.i18nFilter("table.selection.keywords.seegroup"),
                        );
                    }
                }
            }
        }
    };
    protected tableSelectionOnCancel = () => {
        if (this.state.tableSelectionMode === ETableSelectionNewGroupDropdownMode.NEW_GROUP) {
            allTrackers.trackEvent(
                "add to keyword group",
                "click",
                "Create New Keyword Group/Cancel",
            );
        }
        this.setState({
            tableSelectionMode: ETableSelectionNewGroupDropdownMode.GROUP_LIST,
            tableSelectionIsValid: true,
            tableSelectionErrorMessage: null,
            isCreateNewListModalOpen: false,
        });
    };
    protected onNewListButtonClick = () => {
        this.setState({ isCreateNewListModalOpen: true });
    };
    protected onGroupClick = async (item) => {
        // click on new group
        if (!item.id) {
            this.onNewGroupClick(item);
        }
        // click on existing group
        else {
            await this.onExistingGroupClick(item);
        }
    };
    protected onNewGroupClick = (item) => {
        allTrackers.trackEvent("add to keyword group", "click", "create new group");
        if (this.getSelectedRowsFromStore().length > KeywordGroupEditorHelpers.getMaxGroupCount()) {
            this.setState({
                tableSelectionMode: ETableSelectionNewGroupDropdownMode.MAX_ITEMS,
            });
        } else {
            this.setState({
                tableSelectionMode: ETableSelectionNewGroupDropdownMode.NEW_GROUP,
            });
        }
    };
    protected setRef = (ref) => {
        this.dropdownRef = ref;
    };
    protected getDropdown = (appendTo) => {
        return (
            <TableSelectionGroupKeywordComponent
                appendTo={appendTo}
                ref={this.setRef}
                groups={keywordsGroupsService.groupsToDropDown()}
                onSubmit={this.tableSelectionOnSubmit}
                isLoading={this.state.isTableSelectionLoading}
                error={!this.state.tableSelectionIsValid}
                errorMessage={this.state.tableSelectionErrorMessage}
                onGroupClick={this.onGroupClick}
                onNewListButtonClick={this.onNewListButtonClick}
                mode={this.state.tableSelectionMode}
                onCancel={this.tableSelectionOnCancel}
                isCreateNewListModalOpen={this.state.isCreateNewListModalOpen}
                groupIconName="keyword-group"
                count={this.maxKeywordsInGroup}
                newGroupNameLabel={this.i18nFilter("table.selection.newgroup.keywords.title")}
                trackingCategory="add to keyword group"
                allItemsExistsMessage="table.selection.keywords.exists"
                maxItemsMessage="table.selection.keywords.max.keywords"
            />
        );
    };
    protected getTableSelectionComponent = (groupSelectorElement) => {
        return (
            <SWReactTableWrapperContextConsumer>
                {({ selectedRows, clearAllSelectedRows }) => {
                    const text = this.i18nFilter("keyword.generator.tool.table.keywords.selected", {
                        number: selectedRows.length.toString(),
                    });
                    return (
                        <TableSelection
                            key="1"
                            selectedText={text}
                            onCloseClick={clearAllSelectedRows}
                            addToGroupLabel=""
                            isVisible={selectedRows.length > 0}
                            groupSelectorElement={groupSelectorElement}
                            showSeparator={false}
                        />
                    );
                }}
            </SWReactTableWrapperContextConsumer>
        );
    };

    protected getUrlForKeyWord(keyword) {
        const { country, duration } = this.props;
        const pageState = "keywordAnalysis_overview";
        const defaultParams = this.swSettings.components[
            this.swNavigator.getState(pageState).configId
        ].defaultParams;
        return this.swNavigator.href(pageState, { ...defaultParams, keyword, country, duration });
    }

    protected getDurationApiParams = (duration) => {
        return DurationService.getDurationData(duration, null, this.swSettings.current.componentId);
    };
    protected onSort = (sortedColumn) => {
        const { field, sortDirection } = sortedColumn;
        this.setState({ orderBy: { field, sortDirection } });
    };
    protected showGroupLinkToast = (name, text, label, workspaceId?: string) => {
        const { country, duration } = this.swNavigator.getParams();
        let linkToGroup;
        if (workspaceId) {
            linkToGroup = this.swNavigator.href("marketingWorkspace-keywordGroup", {
                keywordGroupId: name,
                workspaceId,
            });
        } else {
            linkToGroup = this.swNavigator.href("keywordAnalysis-overview", {
                country,
                duration,
                keyword: `*${name}`,
            });
        }
        this.props.showToast(linkToGroup, text, label);
    };
}

export const mapStateToPropsBase = (props) => {
    const { keywordGeneratorTool, tableSelection } = props;
    const {
        seedKeyword = String(),
        country,
        duration,
        webSource,
        booleanSearchTerms,
    } = keywordGeneratorTool;
    const { volumeFromValue, volumeToValue, cpcFromValue, cpcToValue } = props.routing.params;
    const isSeedKeywordStartsWithGroupPrefix = seedKeyword?.startsWith("*");
    const isGroupContext =
        keywordGeneratorTool.isGroupContext || isSeedKeywordStartsWithGroupPrefix;
    return {
        seedKeyword: isSeedKeywordStartsWithGroupPrefix
            ? KeywordsGroupUtilities.getGroupNameById(seedKeyword.substring(1))
            : seedKeyword,
        country,
        duration,
        webSource,
        tableSelection,
        booleanSearchTerms,
        isGroupContext,
        volumeFromValue,
        volumeToValue,
        cpcFromValue,
        cpcToValue,
    };
};
export const mapDispatchToPropsBase = (dispatch) => {
    return {
        setBooleanSearchTerms: (booleanSearchTerm) => {
            dispatch(setBooleanSearchTerms(booleanSearchTerm));
        },
        clearAllSelectedRows: () => {
            dispatch(
                tableActionsCreator("KeywordGeneratorToolTable", "keyword").clearAllSelectedRows(),
            ); // todo
        },
        showToast: (href, text, label) => {
            dispatch(
                showSuccessToast(
                    getToastItemComponent({
                        text,
                        linkText: label,
                        href,
                        onClick: allTrackers.trackEvent.bind(
                            allTrackers,
                            "add to keyword group",
                            "click",
                            "internal link/keywordAnalysis.organic",
                        ),
                    }),
                ),
            );
        },
    };
};

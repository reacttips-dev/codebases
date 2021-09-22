import { colorsPalettes } from "@similarweb/styles";
import {
    BooleanSearchActionListStyled,
    BooleanSearchInputWrap,
    Input,
} from "@similarweb/ui-components/dist/boolean-search";
import {
    IBooleanSearchChipItem,
    EBooleanSearchActionsTypes,
} from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { PhraseFilter, phraseFilterDataEndpoints } from "components/filtersPanel/src/PhraseFilter";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { CheckboxDropdownItem, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import { MultiSelectDropdownContainer } from "components/dashboard/widget-wizard/components/MultiSelectDropdownContainer";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { FooterButton } from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import I18n from "components/React/Filters/I18n";
import { InjectableComponent } from "components/React/InjectableComponent/InjectableComponent";
import { Widget } from "components/widget/widget-types/Widget";
import { abbrNumberVisitsFilter, i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import { FILTER_DEFAULT_SEPARATOR } from "pages/website-analysis/constants/constants";
import allSearchTypes from "pages/website-analysis/constants/searchTypes";
import allSearchEngines from "pages/website-analysis/constants/searchEngines";
import { booleanSearchChipsObjectToApiParams } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { RangeFilterToDashboard } from "pages/dashboard/RangeFilterForDashboard";
import { BooleanSearchWithBothKeywordsAndWebsiteWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsiteWrapper";
import * as React from "react";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import ColorStack from "components/colorsStack/ColorStack";
import { CHART_COLORS } from "../../../constants/ChartColors";
import { getPhraseFilterData } from "components/filtersPanel/src/PhraseFilterUtilities";
import DurationService from "services/DurationService";

export const BooleanSearchWrapper = styled.div`
    border-radius: 3px;
    border: solid 1px ${colorsPalettes.carbon[100]};
    padding: 5px 10px;

    ${BooleanSearchActionListStyled} {
        background-color: #fff;
    }

    ${BooleanSearchInputWrap} {
        min-width: 0;
    }

    ${Input} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

const CpcVolumeFiltersContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

const CpcFromPlaceholder = i18nFilter()("keyword.dashboard.filter.range.min");
const CpcToPlaceholder = i18nFilter()("keyword.dashboard.filter.range.max");
const VolumeFromPlaceholder = i18nFilter()("keyword.dashboard.filter.range.min");
const VolumeToPlaceholder = i18nFilter()("keyword.dashboard.filter.range.max");
const phraseFilterWidthSingle = 370;
const phraseFilterWidthCompare = 450;
const DEFAULT_SEPARATOR = ",";

export class TableSearchKeywordsDashboardWidgetFilters extends InjectableComponent {
    private filterNames = [
        "IncludeOrganic",
        "IncludePaid",
        "IncludeBranded",
        "IncludeNoneBranded",
        "IncludeNewKeywords",
        "IncludeTrendingKeywords",
        "IncludeQuestions",
        "IncludeTerms",
        "ExcludeTerms",
        "IncludeUrls",
        "ExcludeUrls",
        "selectedPhrase",
    ];
    private selectedFilters: any = {};
    private chartMainColors = new ColorStack(CHART_COLORS.chartMainColors);
    private topicChipDownRef: any;
    private channelRef: any;
    private sourcesRef: any;

    constructor(props) {
        super(props);
        this.state = {
            channelFilters: [],
            sourcesFilters: [],
            allSourcesFilters: [],
            allChannelFilters: [],
            selectedSourcesIds: [],
            selectedChannelIds: [],
            selectedChannelFilter: "",
            selectedSourcesFilter: "",
            isIncludeSubDomainsDisabled: false,
            availableFilterNames: this.filterNames,
            isCustom: KeywordAdvancedFilterService.isCustomFilter(props.widgetFilters.limits),
            chosenItems: props.widgetKeys,
            numOfSites: props.widgetKeys.length,
            TotalCount: props.widgetPreview?.TotalCount,
            cpcToValue: "",
            cpcFromValue: "",
            volumeFromValue: "",
            volumeToValue: "",
            showChannelApplyButton: false,
            showSourcesApplyButton: false,
            phraseFilterData: [],
        };
        this.selectedFilters = {
            IncludeBranded: props.widgetFilters.IncludeBranded || false,
            IncludeNewKeywords: props.widgetFilters.IncludeNewKeywords || false,
            IncludeNoneBranded: props.widgetFilters.IncludeNoneBranded || false,
            IncludeOrganic: props.widgetFilters.IncludeOrganic || false,
            IncludePaid: props.widgetFilters.IncludePaid || false,
            IncludeQuestions: props.widgetFilters.IncludeQuestions || false,
            IncludeTrendingKeywords: props.widgetFilters.IncludeTrendingKeywords || false,
            filter: props.widgetFilters.filter || "",
            includeSubDomains: props.widgetFilters.includeSubDomains || "true",
            orderBy: props.widgetFilters.orderBy || "TotalShare desc",
            timeGranularity: props.widgetFilters.timeGranularity || "Monthly",
            limits: props.widgetFilters.limits || null,
            rangeFilter: props.widgetFilters.rangeFilter || props.widgetFilters.rangefilter || null,
        };
        if (props.widgetFilters.selectedPhrase) {
            this.selectedFilters.selectedPhrase = props.widgetFilters.selectedPhrase;
        }

        if (props.widgetFilters.ExcludeTerms) {
            this.selectedFilters.ExcludeTerms = props.widgetFilters.ExcludeTerms;
        }
        if (props.widgetFilters.IncludeTerms) {
            this.selectedFilters.IncludeTerms = props.widgetFilters.IncludeTerms;
        }
        if (props.widgetFilters.ExcludeUrls) {
            this.selectedFilters.ExcludeUrls = props.widgetFilters.ExcludeUrls;
        }
        if (props.widgetFilters.IncludeUrls) {
            this.selectedFilters.IncludeUrls = props.widgetFilters.IncludeUrls;
        }

        props.changeFilter(this.getSelectedFilters());
    }

    public async componentWillMount() {
        if (this.state.phraseFilterData.length === 0) {
            this.props.widgetKeys && this.getPhraseData(this.props.widgetKeys);
        }
    }

    private getPhraseData = (key) => {
        getPhraseFilterData(phraseFilterDataEndpoints.DEFAULT)(this.getFiltersForPhrase(key)).then(
            (res) => {
                res.unshift({
                    searchTerm: "Any topic",
                    share: 1,
                    siteOrigins: { all: 1 },
                    fontWeight: 400,
                    fontStyle: "italic",
                    hideData: true,
                });
                this.setState({ phraseFilterData: res.slice(0, 25) });
            },
        );
    };

    public componentWillUpdate(nextProps) {
        if (
            nextProps.widgetKeys &&
            this.state.chosenItems &&
            nextProps.widgetKeys.length !== this.state.chosenItems.length
        ) {
            this.getPhraseData(nextProps.widgetKeys);
        }
    }

    public async componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let sourcesFilters = this.state.sourcesFilters;
            let channelFilters = this.state.channelFilters;
            let allSourcesFilters = this.state.allSourcesFilters;
            let allChannelFilters = this.state.allChannelFilters;
            let filterNamesToRemove = [];
            let selectedSourcesIds = this.state.selectedSourcesIds;
            let selectedChannelIds = this.state.selectedChannelIds;
            let numOfSites = this.state.numOfSites;
            let chosenItems = this.state.chosenItems;
            let cpcFromValue;
            let cpcToValue;
            let volumeFromValue;
            let volumeToValue;

            if (this.selectedFilters.rangeFilter) {
                const filters = this.selectedFilters.rangeFilter.split("|");
                const names = filters.map((filter) => filter.split(DEFAULT_SEPARATOR)[0]);
                const cpcIndex = names.indexOf("cpc");
                const volumeIndex = names.indexOf("kwvolume");
                const cpcFilter = filters[cpcIndex]?.split(DEFAULT_SEPARATOR);
                const volumeFilter = filters[volumeIndex]?.split(DEFAULT_SEPARATOR);
                cpcFromValue = cpcFilter && cpcFilter[1];
                cpcToValue = cpcFilter && cpcFilter[2];
                volumeFromValue = volumeFilter && volumeFilter[1];
                volumeToValue = volumeFilter && volumeFilter[2];
            }
            if (this.props.widgetWebSource === "MobileWeb") {
                this.unsetFilter("family", true);
                this.unsetFilter("source", true);
                this.selectedFilters.includeSubDomains = "true";
                filterNamesToRemove = ["IncludeOrganic", "IncludePaid"];
            }
            if (this.props.widgetKeys && this.props.widgetKeys.length !== this.state.numOfSites) {
                numOfSites = this.props.widgetKeys.length;
                chosenItems = this.props.widgetKeys;
            }
            if (this.props.widgetDuration === "28d") {
                filterNamesToRemove = ["IncludeTrendingKeywords", "IncludeNewKeywords"];
            }

            const availableFilterNames = this.filterNames.filter(
                (filterName) => filterNamesToRemove.indexOf(filterName) === -1,
            );
            this.selectedFilters = _.omit(this.selectedFilters, filterNamesToRemove);

            allChannelFilters = allSearchTypes
                .map((type) => {
                    const searchTypeCount = (
                        this.props.widgetPreview?.Filters.ChannelFilters || []
                    ).find((s) => s.id.toString() === type.id)?.count;
                    return {
                        ...type,
                        count: searchTypeCount || 0,
                    };
                })
                .sort((a, b) => b.count - a.count);
            allSourcesFilters = allSearchEngines
                .map((type) => {
                    const searchTypeCount = (
                        this.props.widgetPreview?.Filters.SourcesFilter || []
                    ).find((s) => s.text === type.text)?.count;
                    return {
                        ...type,
                        count: searchTypeCount || 0,
                    };
                })
                .sort((a, b) => b.count - a.count);
            let allSourcesCount = this.getAllCount(allSourcesFilters);
            let allChannelCount = this.getAllCount(allChannelFilters);
            allSourcesFilters.unshift({ id: "0", text: "All Engines", count: allSourcesCount });
            allChannelFilters.unshift({ id: "0", text: "All Types", count: allChannelCount });

            if (
                this.props.widgetPreview &&
                this.props.widgetPreview.Filters &&
                this.props.widgetWebSource !== "MobileWeb"
            ) {
                const filters = this.props.widgetPreview.Filters;
                sourcesFilters =
                    this.state.sourcesFilters.length > 0
                        ? this.state.sourcesFilters
                        : this.getSearchValue("family") !== ""
                        ? this.findFilter("family", allSourcesFilters)
                        : [{ id: "0", text: "All Engines" }];

                channelFilters =
                    this.state.channelFilters.length > 0
                        ? this.state.channelFilters
                        : this.getSearchValue("source") !== ""
                        ? this.findFilter("source", allChannelFilters)
                        : [{ id: "0", text: "All Types" }];
                selectedChannelIds = channelFilters.map((item) => item?.id);
                selectedSourcesIds = sourcesFilters.map((item) => item?.id);
            }

            this.setState({
                channelFilters,
                selectedChannelFilter:
                    this.getSearchValue("source") !== "" ? this.getSearchValue("source") : "0",
                sourcesFilters,
                selectedSourcesFilter:
                    this.props.widgetWebSource === "MobileWeb"
                        ? "0"
                        : this.getSearchValue("family") !== ""
                        ? this.getSearchValue("family")
                        : "0",
                isIncludeSubDomainsDisabled: this.props.widgetWebSource === "MobileWeb",
                availableFilterNames,
                numOfSites,
                chosenItems,
                cpcFromValue,
                cpcToValue,
                volumeFromValue,
                volumeToValue,
                allChannelFilters,
                allSourcesFilters,
                selectedSourcesIds,
                selectedChannelIds,
            });
        }
    }

    public render() {
        const showCompetitiveTrafficFilter = this.state.numOfSites > 1;
        this.chartMainColors.reset();
        const {
            cpcFromValue,
            cpcToValue,
            volumeFromValue,
            volumeToValue,
            chosenItems,
            phraseFilterData,
        } = this.state;
        const phraseFilterWidth =
            this.state.numOfSites > 1 ? phraseFilterWidthCompare : phraseFilterWidthSingle;
        const items = chosenItems?.map((site) => {
            return {
                name: site.name,
                color: this.chartMainColors.acquire(),
            };
        });

        const channelFilters = this.state.channelFilters ? (
            <div key="channelFilters" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.channelFilters`}</I18n>
                </h5>
                <StatefulDropdown
                    key="channelFilters"
                    DropDownItemComponent={this.DropDownChannelFiltersItemComponent}
                    items={this.state.allChannelFilters}
                    selectedId={""}
                    onSelect={this.onChannelFiltersChange}
                    title={i18nFilter()("keyword.dashboard.filter.title.select.multiple")}
                    setRef={this.setChannelRef}
                    disabled={this.props.widgetWebSource === "MobileWeb"}
                    footerComponent={() =>
                        this.state.showChannelApplyButton && (
                            <FooterButton onClick={this.onChannelApply}>
                                <I18n>common.apply</I18n>
                            </FooterButton>
                        )
                    }
                />
            </div>
        ) : null;
        const sourcesFilters = this.state.sourcesFilters ? (
            <div key="sourcesFilters" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.sourcesFilter`}</I18n>
                </h5>
                <StatefulDropdown
                    key="sourcesFilters"
                    DropDownItemComponent={this.DropDownSourcesFiltersItemComponent}
                    items={this.state.allSourcesFilters}
                    selectedId={""}
                    onSelect={this.onSourcesFiltersChange}
                    title={i18nFilter()("keyword.dashboard.filter.title.select.multiple")}
                    setRef={this.setSourcesRef}
                    disabled={this.props.widgetWebSource === "MobileWeb"}
                    footerComponent={() =>
                        this.state.showSourcesApplyButton && (
                            <FooterButton onClick={this.onSourcesApply}>
                                <I18n>common.apply</I18n>
                            </FooterButton>
                        )
                    }
                />
            </div>
        ) : null;
        const competitiveTrafficFilter = showCompetitiveTrafficFilter ? (
            <div key="CompetitiveTrafficFilter" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.competitive.traffic`}</I18n>
                </h5>
                <StatefulDropdown
                    key="CompetitiveTrafficFilter"
                    items={this.getCompetitiveFilters()}
                    selectedId={
                        this.state.isCustom
                            ? "CUSTOM"
                            : this.selectedFilters.limits
                            ? this.selectedFilters.limits
                            : ""
                    }
                    onSelect={this.onSelectLimit}
                />
            </div>
        ) : null;

        const topic = (
            <div key="topicFilter" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.topic`}</I18n>
                </h5>
                <div>
                    <Dropdown
                        width={phraseFilterWidth}
                        selectedIds={this.selectedFilters.selectedPhrase}
                        ref={this.setRef}
                        closeOnItemClick={false}
                    >
                        <DropdownButton key="DropdownButton1" cssClass="DropdownButton--has-value">
                            {this.selectedFilters.selectedPhrase ? (
                                this.selectedFilters.selectedPhrase
                            ) : (
                                <I18n>{"keyword.dashboard.filter.topic.button.title"}</I18n>
                            )}
                        </DropdownButton>
                        <PhraseFilter
                            chosenItems={items}
                            filterData={phraseFilterData}
                            searchPlaceholder={i18nFilter()(
                                "keyword.dashboard.filter.topic.search.placeholder",
                            )}
                            onClickCallback={({ searchTerm }) => {
                                this.onPhraseChange(searchTerm);
                                this.closeChipDown(this.topicChipDownRef)();
                            }}
                        />
                    </Dropdown>
                </div>
            </div>
        );

        const cpcFilter = (
            <div key="cpcFilter" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.competitive.cpc`}</I18n>
                </h5>
                <RangeFilterToDashboard
                    fromPlaceholder={CpcFromPlaceholder}
                    toPlaceholder={CpcToPlaceholder}
                    fromRange={cpcFromValue}
                    toRange={cpcToValue}
                    onFromChange={this.onCpcFromChange}
                    onToChange={this.onCpcToChange}
                    onBlur={this.onBlurRangeFilter}
                />
            </div>
        );

        const volumeFilter = (
            <div key="volumeFilter" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.competitive.volume`}</I18n>
                </h5>
                <RangeFilterToDashboard
                    fromPlaceholder={VolumeFromPlaceholder}
                    toPlaceholder={VolumeToPlaceholder}
                    fromRange={volumeFromValue}
                    toRange={volumeToValue}
                    onFromChange={this.onVolumeFromChange}
                    onToChange={this.onVolumeToChange}
                    onBlur={this.onBlurRangeFilter}
                />
            </div>
        );

        const selectedFilters = {};
        this.state.availableFilterNames.forEach((filter) => {
            selectedFilters[filter] = this.props.widgetFilters[filter];
        });
        const multiselectItems = [
            <DropdownButton key="multiselectItemsButton" cssClass="DropdownButton--has-value">
                Select multiple...
            </DropdownButton>,
            ...this.state.availableFilterNames
                .filter(
                    (filter) =>
                        ![
                            "IncludeTerms",
                            "ExcludeTerms",
                            "IncludeUrls",
                            "ExcludeUrls",
                            "selectedPhrase",
                        ].includes(filter),
                )
                .map((filter) => (
                    <CheckboxDropdownItem key={filter} id={filter}>
                        <I18n>{`home.dashboards.wizard.filters.filterby.${filter}`}</I18n>
                    </CheckboxDropdownItem>
                )),
        ];
        return (
            <>
                <div key="dynamicFiltersContainer" className="filters">
                    {channelFilters}
                    {sourcesFilters}
                    <div key="filterby" className="dynamicFilter">
                        <h5>
                            <I18n>{`home.dashboards.wizard.filters.filterby`}</I18n>
                        </h5>
                        <MultiSelectDropdownContainer
                            onItemClick={this.onFilterBySelect}
                            initialSelection={selectedFilters}
                        >
                            {multiselectItems}
                        </MultiSelectDropdownContainer>
                    </div>
                    <div key="orderby" className="dynamicFilter">
                        <h5>
                            <I18n>{`home.dashboards.wizard.filters.orderBy`}</I18n>
                        </h5>
                        <StatefulDropdown
                            key="orderbyFilter"
                            items={[
                                { id: "TotalShare desc", text: "Traffic Share" },
                                { id: "Change desc", text: "Change" },
                            ]}
                            selectedId={this.selectedFilters.orderBy}
                            onSelect={this.onSelectOrderBy}
                        />
                    </div>
                    <div key="includeSubDomains" className="dynamicFilter">
                        <h5>
                            <I18n>{`home.dashboards.wizard.filters.includeSubDomains`}</I18n>
                        </h5>
                        <StatefulDropdown
                            key="includeSubDomains"
                            items={[
                                { id: "true", text: "Yes" },
                                { id: "false", text: "No" },
                            ]}
                            selectedId={this.selectedFilters.includeSubDomains}
                            onSelect={this.onIncludeSubDomains}
                            disabled={this.state.isIncludeSubDomainsDisabled}
                        />
                    </div>
                    {competitiveTrafficFilter}
                    {phraseFilterData && topic}
                    <CpcVolumeFiltersContainer>
                        {cpcFilter}
                        {volumeFilter}
                    </CpcVolumeFiltersContainer>
                </div>
                <div key="searchterm" className="filters" style={{ flexDirection: "column" }}>
                    <h5>
                        <I18n>{`home.dashboards.wizard.filters.searchterm`}</I18n>
                    </h5>
                    <BooleanSearchWrapper>
                        <BooleanSearchWithBothKeywordsAndWebsiteWrapper
                            onChange={this.onSearch}
                            onChipAdd={this.onChipAdd}
                            onChipRemove={this.onChipRemove}
                            filters={this.getFiltersForBooleanSearch()}
                            placeholder={i18nFilter()(
                                "analysis.dashboard.keywords.boolean.search.placeholder",
                            )}
                        />
                    </BooleanSearchWrapper>
                </div>
            </>
        );
    }

    private getFiltersForBooleanSearch = () => {
        const selectedFilters = this.selectedFilters;
        const hasPhraseFilter = selectedFilters.selectedPhrase;
        if (hasPhraseFilter && selectedFilters.IncludeTerms) {
            let IncludeTerms = selectedFilters.IncludeTerms.split(DEFAULT_SEPARATOR);
            const indexOfPhrase = IncludeTerms.indexOf(selectedFilters.selectedPhrase);
            IncludeTerms = [
                ...IncludeTerms.slice(0, indexOfPhrase),
                ...IncludeTerms.slice(indexOfPhrase + 1),
            ].join(DEFAULT_SEPARATOR);
            IncludeTerms.length > 0
                ? (selectedFilters.IncludeTerms = IncludeTerms)
                : delete selectedFilters.IncludeTerms;
        }
        return selectedFilters;
    };

    private onPhraseChange = (newFilter) => {
        if (newFilter === "Any topic") {
            this.selectedFilters.selectedPhrase = String();
        } else {
            this.selectedFilters.selectedPhrase = newFilter;
            this.selectedFilters.IncludeTerms = this.selectedFilters.IncludeTerms
                ? this.selectedFilters.IncludeTerms + DEFAULT_SEPARATOR + newFilter
                : newFilter;
        }
        this.props.changeFilter(this.getSelectedFilters());
    };

    private setRef = (ref) => {
        this.topicChipDownRef = ref;
    };

    private setChannelRef = (ref) => {
        this.channelRef = ref;
    };

    private setSourcesRef = (ref) => {
        this.sourcesRef = ref;
    };

    private closeChipDown = (chipDownRef) => () => {
        chipDownRef.closePopup();
    };

    private closePopup = (ref) => {
        ref.closePopup();
    };

    private getFiltersForPhrase = (keys) => {
        const items = keys
            .map((key) => {
                return key.name;
            })
            .join(DEFAULT_SEPARATOR);
        const { widgetDuration, widgetWebSource } = this.props;
        const { to, from, isWindow } = DurationService.getDurationData(widgetDuration).forAPI;

        return { to, from, webSource: widgetWebSource, country: 999, key: items, isWindow };
    };

    private onChannelApply = () => {
        const allTypeIndex = this.state.channelFilters.findIndex((item) => item.id === "0");
        if (allTypeIndex !== -1) {
            this.unsetFilter("source");
        } else {
            const source = this.state.channelFilters.reduce(
                (acc, item) => (acc ? `${acc}${FILTER_DEFAULT_SEPARATOR}${item.id}` : `${item.id}`),
                "",
            );
            const filterObjectUpdate = {
                source: { operator: "==", value: source },
            };
            this.setFilter(filterObjectUpdate);
        }
        this.setState({ showChannelApplyButton: false });
        this.closePopup(this.channelRef);
    };
    private onSourcesApply = () => {
        const allTypeIndex = this.state.sourcesFilters.findIndex((item) => item.id === "0");
        if (allTypeIndex !== -1) {
            this.unsetFilter("family");
        } else {
            const family = this.state.sourcesFilters.reduce(
                (acc, item) =>
                    acc ? `${acc}${FILTER_DEFAULT_SEPARATOR}"${item.id}"` : `"${item.id}"`,
                "",
            );
            const filterObjectUpdate = {
                family: { operator: "==", value: family },
            };
            this.setFilter(filterObjectUpdate);
        }
        this.setState({ showSourcesApplyButton: false });
        this.closePopup(this.sourcesRef);
    };

    private deleteItemFromList = (list, index) => {
        return [...list.slice(0, index), ...list.slice(index + 1)];
    };

    private onClickChannelItem = (selectedItemId: string) => {
        const selectedItemIndex = this.state.channelFilters.findIndex(
            (item) => item.id === selectedItemId,
        );
        let channel;
        // if the item selected is all type option we need to uncheck all options
        if (selectedItemId === "0") {
            channel = [this.state.allChannelFilters.find((option) => option.id === selectedItemId)];
            this.setState({
                channelFilters: channel,
                selectedChannelIds: channel.map((item) => item?.id),
            });
        } else if (selectedItemIndex !== -1) {
            channel = this.deleteItemFromList(this.state.channelFilters, selectedItemIndex);
            channel.length > 0 &&
                this.setState({
                    channelFilters: channel,
                    selectedChannelIds: channel.map((item) => item?.id),
                });
        } else {
            const allTypeIndex = this.state.channelFilters.findIndex((item) => item.id === "0");
            // if the item is not the all type option && the all type option is selected
            if (allTypeIndex !== -1) {
                channel = this.deleteItemFromList(this.state.channelFilters, allTypeIndex);
                channel.push(
                    this.state.allChannelFilters.find((option) => option.id === selectedItemId),
                );
            } else {
                channel = [
                    ...this.state.channelFilters,
                    this.state.allChannelFilters.find((option) => option.id === selectedItemId),
                ];
            }
            this.setState({
                channelFilters: channel,
                selectedChannelIds: channel.map((item) => item?.id),
            });
        }
        this.setState({ showChannelApplyButton: true });
    };
    private onClickSourcesItem = (selectedItemId: string) => {
        const selectedItemIndex = this.state.sourcesFilters.findIndex(
            (item) => item.id === selectedItemId,
        );
        let sources;
        // if the item selectes is all type option we need to uncheck all options
        if (selectedItemId === "0") {
            sources = [this.state.allSourcesFilters.find((option) => option.id === selectedItemId)];
            this.setState({
                sourcesFilters: sources,
                selectedSourcesIds: sources.map((item) => item?.id),
            });
        } else if (selectedItemIndex !== -1) {
            sources = this.deleteItemFromList(this.state.sourcesFilters, selectedItemIndex);
            sources.length > 0 &&
                this.setState({
                    sourcesFilters: sources,
                    selectedSourcesIds: sources.map((item) => item?.id),
                });
        } else {
            const allTypeIndex = this.state.sourcesFilters.findIndex((item) => item.id === "0");
            // if the item is not the all type option && the all type option is selected
            if (allTypeIndex !== -1) {
                sources = this.deleteItemFromList(this.state.sourcesFilters, allTypeIndex);
                sources.push(
                    this.state.allSourcesFilters.find((option) => option.id === selectedItemId),
                );
            } else {
                sources = [
                    ...this.state.sourcesFilters,
                    this.state.allSourcesFilters.find((option) => option.id === selectedItemId),
                ];
            }
            this.setState({
                sourcesFilters: sources,
                selectedSourcesIds: sources.map((item) => item?.id),
            });
        }
        this.setState({ showSourcesApplyButton: true });
    };

    private DropDownChannelFiltersItemComponent = ({ id, count, text }) => {
        const isSelected = this.state.selectedChannelIds.includes(id);
        return (
            <EllipsisDropdownItem
                onClick={() => this.onClickChannelItem(id)}
                showCheckBox
                selected={isSelected}
                key={id}
                id={id}
                infoText={abbrNumberVisitsFilter()(count || 0)}
            >
                {i18nFilter()(text)}
            </EllipsisDropdownItem>
        );
    };
    private DropDownSourcesFiltersItemComponent = ({ id, count, text }) => {
        const isSelected = this.state.selectedSourcesIds.includes(id);
        return (
            <EllipsisDropdownItem
                onClick={() => this.onClickSourcesItem(id)}
                showCheckBox
                selected={isSelected}
                key={id}
                id={id}
                infoText={abbrNumberVisitsFilter()(count || 0)}
            >
                {i18nFilter()(text)}
            </EllipsisDropdownItem>
        );
    };

    private onCpcFromChange = (value) => {
        this.setState({ cpcFromValue: value });
    };

    private onCpcToChange = (value) => {
        this.setState({ cpcToValue: value });
    };

    private onVolumeFromChange = (value) => {
        this.setState({ volumeFromValue: value });
    };

    private onVolumeToChange = (value) => {
        this.setState({ volumeToValue: value });
    };

    private sortNumbersByValue = (from, to) => {
        if (from && to && Number(to) < Number(from)) {
            return [to, from];
        } else {
            return [from, to];
        }
    };

    private onBlurRangeFilter = () => {
        const { cpcFromValue, cpcToValue, volumeFromValue, volumeToValue } = this.state;
        const cpc = this.sortNumbersByValue(cpcFromValue, cpcToValue);
        let volume = this.sortNumbersByValue(volumeFromValue, volumeToValue);
        const range = getRangeFilterQueryParamValue([
            createVolumeFilter(volume[0], volume[1]),
            createCpcFilter(cpc[0], cpc[1]),
        ]);
        this.selectedFilters.rangeFilter = range;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private getSelectedFilters() {
        const filters = [];
        for (const filter of Object.keys(this.selectedFilters)) {
            filters.push({ name: filter, value: this.selectedFilters[filter] });
        }
        return filters;
    }

    private getCompetitiveFilters = () => {
        const filters = [];
        KeywordAdvancedFilterService.getAllFilters().forEach((filter) => {
            const { name, api } = filter;
            filters.push({
                id: api,
                text: i18nFilter()(name),
            });
        });
        filters.push({
            id: "CUSTOM",
            text: i18nFilter()("analysis.source.search.keywords.filters.advanced.custom.title"),
            disabled: true,
        });
        return filters;
    };

    private getAllCount = (array) => {
        let count = 0;
        array.forEach((item) => (count += item.count));
        return count;
    };

    private findFilter = (name, arraySearch) => {
        const value = this.getSearchValue(name).split("[comma]");
        const items = [];
        value.forEach((key) => {
            items.push(arraySearch.find((item) => item.id === key));
        });
        return items;
    };

    private getSearchValue(key) {
        const filterObject: any = Widget.filterParse(this.props.widgetFilters.filter);
        const filterObjectItem = filterObject[key];
        return filterObjectItem && filterObjectItem.hasOwnProperty("value")
            ? filterObjectItem.value.replace(/"/g, "")
            : "";
    }

    private setFilter(filterObjectUpdate) {
        const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
        this.selectedFilters.filter = Widget.filterStringify(
            Object.assign(filterObject, filterObjectUpdate),
        );
        this.props.changeFilter(this.getSelectedFilters());
    }

    private unsetFilter(filterName, silent = false) {
        const filterObject: any = Widget.filterParse(this.selectedFilters.filter);
        delete filterObject[filterName];
        this.selectedFilters.filter = Widget.filterStringify(filterObject);
        if (!silent) {
            this.props.changeFilter(this.getSelectedFilters());
        }
    }

    private chipsKind = (newChip) => {
        switch (newChip.action) {
            case EBooleanSearchActionsTypes.includeKeyword:
                return "includeKeyword";
            case EBooleanSearchActionsTypes.excludeKeyword:
                return "excludeKeyword";
            case EBooleanSearchActionsTypes.includeUrl:
                return "includeUrl";
            case EBooleanSearchActionsTypes.excludeUrl:
                return "excludeUrl";
        }
    };

    private onChipAdd = (newChip) => {
        const chipKind = this.chipsKind(newChip);
        TrackWithGuidService.trackWithGuid("dashboard.boolean.search.chip", "click", {
            mode: chipKind,
            name: newChip.text,
            action: "add",
        });
    };

    private onChipRemove = (removeChip) => {
        const chipKind = this.chipsKind(removeChip);
        TrackWithGuidService.trackWithGuid("dashboard.boolean.search.chip", "click", {
            mode: chipKind,
            name: removeChip.text,
            action: "remove",
        });
    };

    private onSearch = (chipsObject: IBooleanSearchChipItem[]) => {
        const {
            IncludeTerms,
            ExcludeTerms,
            IncludeUrls,
            ExcludeUrls,
        } = booleanSearchChipsObjectToApiParams(chipsObject);
        if (this.selectedFilters.selectedPhrase) {
            if (IncludeTerms === String()) {
                this.selectedFilters.IncludeTerms = this.selectedFilters.selectedPhrase;
            } else {
                this.selectedFilters.IncludeTerms =
                    IncludeTerms + DEFAULT_SEPARATOR + this.selectedFilters.selectedPhrase;
            }
        } else {
            if (IncludeTerms === String()) {
                delete this.selectedFilters.IncludeTerms;
            } else {
                this.selectedFilters.IncludeTerms = IncludeTerms;
            }
        }
        if (IncludeUrls === String()) {
            delete this.selectedFilters.IncludeUrls;
        } else {
            this.selectedFilters.IncludeUrls = IncludeUrls;
        }
        if (ExcludeUrls === String()) {
            delete this.selectedFilters.ExcludeUrls;
        } else {
            this.selectedFilters.ExcludeUrls = ExcludeUrls;
        }

        if (ExcludeTerms === String()) {
            delete this.selectedFilters.ExcludeTerms;
        } else {
            this.selectedFilters.ExcludeTerms = ExcludeTerms;
        }

        this.props.changeFilter(this.getSelectedFilters());
    };

    private onChannelFiltersChange = (selectedChannelFilter) => {
        if (selectedChannelFilter.id === "0") {
            this.unsetFilter("source");
        } else {
            const filterObjectUpdate = {
                source: { operator: "==", value: `${selectedChannelFilter.id}` },
            };
            this.setFilter(filterObjectUpdate);
        }
    };

    private onSourcesFiltersChange = (selectedSourcesFilter) => {
        if (selectedSourcesFilter.id === "0") {
            this.unsetFilter("family");
        } else {
            const filterObjectUpdate = {
                family: { operator: "==", value: `"${selectedSourcesFilter.id}"` },
            };
            this.setFilter(filterObjectUpdate);
        }
    };

    private onFilterBySelect = (selectedFilters) => {
        Object.keys(selectedFilters).forEach((filter) => {
            this.selectedFilters[filter] = selectedFilters[filter];
        });
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectOrderBy = (item) => {
        this.selectedFilters.orderBy = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onIncludeSubDomains = (item) => {
        this.selectedFilters.includeSubDomains = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };

    private onSelectLimit = (item) => {
        if (this.state.isCustom) {
            this.setState({ isCustom: false });
        }
        this.selectedFilters.limits = item.id;
        this.props.changeFilter(this.getSelectedFilters());
    };
}

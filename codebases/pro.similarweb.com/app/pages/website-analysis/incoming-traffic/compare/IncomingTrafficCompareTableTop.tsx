import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import UIComponentStateService from "services/UIComponentStateService";
import { colorsPalettes, mixins } from "@similarweb/styles";
import styled, { css } from "styled-components";
import BoxSubtitle from "../../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { PrimaryBoxTitle } from "../../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { AddToDashboardButton } from "../../../../components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "../../../../components/React/DownloadButtonMenu/DownloadButtonMenu";
import MetricsCompareBars from "../../../../components/React/MetricsCompareBars/MetricsCompareBars";
import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageFilter,
    suffixFilter,
} from "../../../../filters/ngFilters";
import { IncomingReferralsAdvancedFilterService } from "../../../../services/AdvancedFilterService/IncomingReferralsAdvancedFilter";
import { allTrackers } from "../../../../services/track/track";
import { DownloadExcelContainer } from "../../../workspace/StyledComponent";
import { CategoryDistribution } from "../CategoryDisterbution";
import {
    LOCAL_COMPETITIVE_KEY,
    LOCAL_ENGAGEMENT_KEY,
    SingleBox,
} from "../single/IncomingTrafficSingleTableTop";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import {
    Container,
    Filter,
    Filters,
    FiltersBottom,
    FiltersGrow,
    FiltersTop,
    LoaderWrapper,
    Number,
    Right,
    SearchContainerWrapper,
    Section,
    SectionContainer,
    SectionWrapper,
    Separator,
    SubTitleReferrals,
    Text,
    TotalItem,
} from "../StyledComponents";
import { IncomingReferralsEngagementFilters } from "./helpers/IncomingReferralsEngagementFilters";
import I18n from "components/WithTranslation/src/I18n";
import { Pill } from "components/Pill/Pill";
import DurationService from "services/DurationService";
import { adaptDomainCategoryItems } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsCategoriesManager";
import { MultiCategoriesChipDown } from "components/MultiCategoriesChipDown/src/MultiCategoriesChipDown";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import categoryService from "common/services/categoryService";
import { ICategory } from "common/services/categoryService.types";
import { IRouterState } from "routes/allStates";
import { StateOrName, RawParams, HrefOptions } from "@uirouter/angularjs";
import {
    onChipAdd,
    onChipRemove,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { EBooleanSearchActions } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsite";
import { BooleanSearchWithBothKeywordsAndWebsiteWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsiteWrapper";
import { Loader } from "../Loader";

interface IIncomingTrafficCompareTableTopProps {
    allCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    topCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    totalSectionData: {
        totalShare: number;
        totalUnGroupedCount: number;
        totalVisits: number;
    };
    isLoadingData: boolean;
    onFilterChange: any;
    selectedCategory?: string;
    selectedCategoryId?: string;
    selectedLimits?: string;
    selectedEngagementTypeFilter?: string;
    excelLink: string;
    tableColumns: any[];
    onClickToggleColumns: (index) => void;
    referralsTrafficShare: Array<{
        color: string;
        name: string;
        percentage: number;
        value: number;
        valueText: string;
        width: number;
    }>;
    topics: Array<{ Name: string; Value: number }>;
    categoriesData: any[];
    domainMetaData: any[];
    filtersStateObject?: {
        filter: string;
        webSource: string;
    };
    downloadExcelPermitted?: boolean;
    onCheckboxChange: ({ field: string, value: boolean }) => void;
    params: any;
    current: () => IRouterState;
    onBooleanSearchChange: (params) => void;
    href: (stateOrName: StateOrName, params?: RawParams, options?: HrefOptions) => string;
    convertLimitsToApiParam: (limits: string) => string;
}

const ChipdownItem = styled.div`
    flex-grow: 0;
    .ChipItemText {
        max-width: 314px;
        @media (max-width: 1758px) and (min-width: 1601px) {
            max-width: 317px;
        }
        @media (max-width: 1600px) and (min-width: 1367px) {
            max-width: 260px;
        }
        @media (max-width: 1366px) {
            max-width: 180px;
        }
    }
`;

const Title = styled.div`
    padding: 24px 24px 22px 24px;
`;

const MetricsCompareBarsStyled = styled(MetricsCompareBars)<{ isFetching: boolean; items: any }>`
    ${css`
        flex-grow: 1;
        margin-bottom: 29px;
    `}
`;

const MetricsCompareBarsTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-top: 19px;
    margin-bottom: 19px;
`;

const CategoryDistributionWrapper = styled(SingleBox)`
    margin: 24px 0;
`;

const StyledPill = styled(Pill)`
    margin-left: 10px;
    font-size: 10px !important;
`;

const i18n = i18nFilter();

export class IncomingTrafficCompareTableTop extends React.PureComponent<
    IIncomingTrafficCompareTableTopProps,
    any
> {
    public static defaultProps = {
        allCategories: [],
        selectedCategory: "",
        topics: [],
    };

    private initialCategories = [...categoryService.getCategories()];
    private addToDashboardModal: { dismiss: (reason?: string) => void };

    constructor(props, context) {
        super(props, context);
        // "Unknown" is created in order to be able to uncheck "Unknown" category under "All Categories" filter in Incoming Traffic page
        this.initialCategories.push({ text: "Unknown", id: "Unknown", children: [] } as ICategory);
    }

    public componentDidUpdate(
        prevProps: Readonly<IIncomingTrafficCompareTableTopProps>,
        prevState: Readonly<any>,
        snapshot?: any,
    ) {
        if (!prevProps.totalSectionData && this.props.totalSectionData) {
            if (
                UIComponentStateService.getItem(LOCAL_COMPETITIVE_KEY, "localStorage", false) ===
                "true"
            ) {
                UIComponentStateService.setItem(LOCAL_COMPETITIVE_KEY, "localStorage", null, false);
            }
            if (
                UIComponentStateService.getItem(LOCAL_ENGAGEMENT_KEY, "localStorage", false) ===
                "true"
            ) {
                UIComponentStateService.setItem(LOCAL_ENGAGEMENT_KEY, "localStorage", null, false);
            }
        }

        if (prevProps.params.referralsCategory !== this.props.params.referralsCategory) {
            this.onIndustryClick(this.props.params.referralsCategory);
        }
    }

    public componentWillUnmount() {
        if (this.addToDashboardModal) {
            this.addToDashboardModal.dismiss();
        }
    }

    public render() {
        const selectedLimitsName = this.getAdvancedFilterSelectedText();
        const selectedEngagementTypeFilterName = this.getEngagementTypeFilterName(
            this.props.selectedEngagementTypeFilter,
        );
        const subTitleFilters = [
            {
                filter: "webSource",
                value: this.props.params.webSource,
            },
        ];
        const excelDownloadUrl = this.props.downloadExcelPermitted ? this.props.excelLink : "";
        let excelLinkHref = {};
        if (excelDownloadUrl !== "") {
            excelLinkHref = { href: excelDownloadUrl };
        }
        let allCategories;
        if (this.props.allCategories.length === 0 && this.props.selectedCategory) {
            allCategories = this.initialCategories.reduce((result, current) => {
                if (this.props.selectedCategory.includes(current.id)) {
                    result.push({ Name: current.id, Value: 0, Count: 0 });
                }
                current.children.forEach(({ id }) => {
                    if (this.props.selectedCategory.includes(id)) {
                        result.push({ Name: id, Value: 0, Count: 0 });
                    }
                });
                return result;
            }, []);
        } else {
            allCategories = this.props.allCategories;
        }
        const categories = adaptDomainCategoryItems(allCategories);
        const selectedCategoryIds = this.getSelectedCategoryIds(categories);
        const advancedFilter = (
            <ChipdownItem>
                <ChipDownContainer
                    width={340}
                    onClick={this.onSelectAdvancedFilter}
                    tooltipDisabled={true}
                    selectedText={selectedLimitsName ?? ""}
                    onCloseItem={this.onClearAdvancedFilter}
                    buttonText={i18n(
                        "analysis.compare.trafficsource.referrals.advanced.placeholder",
                    )}
                    onToggle={this.onAdvancedFilterToggle}
                    defaultOpen={
                        UIComponentStateService.getItem(
                            LOCAL_COMPETITIVE_KEY,
                            "localStorage",
                            false,
                        ) === "true"
                    }
                >
                    {this.getPresetsOptions()}
                </ChipDownContainer>
            </ChipdownItem>
        );
        const onBooleanSearchChange = (params) => {
            this.props.onFilterChange(
                { ExcludeUrls: params.ExcludeUrls, IncludeUrls: params.IncludeUrls },
                false,
            );
        };
        const engagementFilter = (
            <ChipdownItem>
                <ChipDownContainer
                    width={340}
                    onClick={this.onSelectEngagementTypeFilter}
                    tooltipDisabled={true}
                    selectedText={selectedEngagementTypeFilterName ?? ""}
                    onCloseItem={this.onClearEngagementTypeFilter}
                    buttonText={
                        <div>
                            <I18n>
                                analysis.compare.trafficsource.referrals.engagement.filter.main
                            </I18n>
                            <StyledPill
                                text={i18nFilter()("filters.title.new")}
                                backgroundColor={colorsPalettes.orange[400]}
                            />
                        </div>
                    }
                    onToggle={this.onEngagementTypeFilterToggle}
                    defaultOpen={
                        UIComponentStateService.getItem(
                            LOCAL_ENGAGEMENT_KEY,
                            "localStorage",
                            false,
                        ) === "true"
                    }
                >
                    {this.getEngagementTypePresetsOptions()}
                </ChipDownContainer>
            </ChipdownItem>
        );
        const { onCheckboxChange: onCheckboxChangeProp } = this.props;
        const onCheckboxChange = (field) => () => {
            const currentValue = this.props.params[field] === "true";
            onCheckboxChangeProp({ field, value: !currentValue });
            this.props.onFilterChange({ [field]: !currentValue }, false);
        };
        return (
            <div>
                <Title>
                    <PrimaryBoxTitle>
                        {i18n("analysis.common.trafficsource.referrals.websites")}
                    </PrimaryBoxTitle>
                    <SubTitleReferrals>
                        <BoxSubtitle filters={subTitleFilters} />
                        {/*<SubTitle>{this.getSubtitle()}</SubTitle>*/}
                    </SubTitleReferrals>
                </Title>
                <Separator />
                {this.props.totalSectionData && (
                    <SectionContainer>
                        <SectionWrapper>
                            <Section margin={19}>
                                <Filters>
                                    <FiltersTop>
                                        <FiltersGrow>
                                            <Filter>
                                                <ChipdownItem>
                                                    <MultiCategoriesChipDown
                                                        key={Math.random()}
                                                        ignoreParentOnSelect={false}
                                                        categories={categories}
                                                        initialSelectedCategories={
                                                            selectedCategoryIds
                                                        }
                                                        onDone={this.onSelectCategory}
                                                        buttonText="All Categories"
                                                        searchPlaceholder="Search for categories"
                                                    />
                                                </ChipdownItem>
                                            </Filter>
                                            {selectedLimitsName ? (
                                                <Filter>
                                                    <PlainTooltip
                                                        tooltipContent={selectedLimitsName}
                                                    >
                                                        {advancedFilter}
                                                    </PlainTooltip>
                                                </Filter>
                                            ) : (
                                                <Filter>{advancedFilter}</Filter>
                                            )}
                                            {!this.isEngagementTypeFilterHidden() && (
                                                <>
                                                    {selectedEngagementTypeFilterName ? (
                                                        <Filter>
                                                            <PlainTooltip
                                                                tooltipContent={
                                                                    selectedEngagementTypeFilterName
                                                                }
                                                            >
                                                                {engagementFilter}
                                                            </PlainTooltip>
                                                        </Filter>
                                                    ) : (
                                                        <Filter>{engagementFilter}</Filter>
                                                    )}
                                                </>
                                            )}
                                        </FiltersGrow>
                                        <Button
                                            type="flat"
                                            isDisabled={this.isClearAllDisabled()}
                                            onClick={this.onClearAll}
                                        >
                                            {i18n("forms.buttons.clearall.text")}
                                        </Button>
                                    </FiltersTop>
                                    <FiltersBottom>
                                        <Filter>
                                            <PlainTooltip
                                                placement="top"
                                                tooltipContent={i18n(
                                                    "analysis.common.trafficsource.referrals.table.filters.newly.tooltip",
                                                )}
                                            >
                                                <div>
                                                    <Checkbox
                                                        onClick={onCheckboxChange(
                                                            "IncludeNewReferrals",
                                                        )}
                                                        label={i18n(
                                                            "analysis.common.trafficsource.referrals.table.filters.newly.label",
                                                        )}
                                                        selected={
                                                            this.props.params
                                                                .IncludeNewReferrals === "true"
                                                        }
                                                    />
                                                </div>
                                            </PlainTooltip>
                                        </Filter>
                                        <Filter>
                                            <PlainTooltip
                                                placement="top"
                                                tooltipContent={i18n(
                                                    "analysis.common.trafficsource.referrals.table.filters.trending.tooltip",
                                                )}
                                            >
                                                <div>
                                                    <Checkbox
                                                        onClick={onCheckboxChange(
                                                            "IncludeTrendingReferrals",
                                                        )}
                                                        label={i18n(
                                                            "analysis.common.trafficsource.referrals.table.filters.trending.label",
                                                        )}
                                                        selected={
                                                            this.props.params
                                                                .IncludeTrendingReferrals === "true"
                                                        }
                                                    />
                                                </div>
                                            </PlainTooltip>
                                        </Filter>
                                    </FiltersBottom>
                                </Filters>
                            </Section>
                        </SectionWrapper>
                        <Separator />
                        {this.props.isLoadingData ? (
                            <LoaderWrapper>
                                <Loader />
                            </LoaderWrapper>
                        ) : (
                            <>
                                <Section margin={19}>
                                    <TotalItem>
                                        <Number>
                                            {minVisitsAbbrFilter()(
                                                this.props.totalSectionData.totalVisits,
                                            )}
                                        </Number>
                                        <Text>
                                            {i18n("analysis.common.trafficsource.referrals.visits")}
                                        </Text>
                                    </TotalItem>
                                    <TotalItem>
                                        <Number>
                                            {suffixFilter()(
                                                percentageFilter()(
                                                    this.props.totalSectionData.totalShare,
                                                    2,
                                                ),
                                                "%",
                                            )}
                                        </Number>
                                        <Text>
                                            {i18n("shared.totals.total")}{" "}
                                            {i18n("analysis.common.trafficsource.referrals.visits")}
                                        </Text>
                                    </TotalItem>
                                    <TotalItem>
                                        <Number>
                                            {numberFilter()(
                                                this.props.totalSectionData.totalUnGroupedCount,
                                            )}
                                        </Number>
                                        <Text>
                                            {i18n(
                                                "analysis.common.trafficsource.referrals.websites",
                                            )}
                                        </Text>
                                    </TotalItem>
                                </Section>
                                <Separator />
                                <MetricsCompareBarsTitle>
                                    {i18n("analysis.compare.trafficsource.referrals.compare.title")}
                                </MetricsCompareBarsTitle>
                                {this.props.referralsTrafficShare && (
                                    <MetricsCompareBarsStyled
                                        items={[{ bars: this.props.referralsTrafficShare }]}
                                        isFetching={false}
                                        title={i18n(
                                            "analysis.compare.trafficsource.referrals.tooltip.title",
                                        )}
                                    />
                                )}
                                <CategoryDistributionWrapper border={1}>
                                    <CategoryDistribution
                                        domains={this.props.domainMetaData}
                                        data={this.props.categoriesData}
                                        getLink={this.getCategoryLink}
                                    />
                                </CategoryDistributionWrapper>
                            </>
                        )}
                    </SectionContainer>
                )}
                <Container>
                    <SearchContainerWrapper>
                        <BooleanSearchWithBothKeywordsAndWebsiteWrapper
                            placeholder={i18nFilter()(
                                "analysis.common.trafficsource.referrals.visits.boolean.search.placeholder",
                            )}
                            onChipAdd={onChipAdd}
                            onChipRemove={onChipRemove}
                            booleanSearchAction={EBooleanSearchActions.WEBSITES}
                            onApplyChanges={onBooleanSearchChange}
                        />
                        <Right>
                            <FlexRow>
                                <DownloadExcelContainer {...excelLinkHref}>
                                    <DownloadButtonMenu
                                        Excel={true}
                                        downloadUrl={excelDownloadUrl}
                                        exportFunction={this.trackExcelDownload}
                                        excelLocked={!this.props.downloadExcelPermitted}
                                    />
                                </DownloadExcelContainer>
                                <div>
                                    <ColumnsPickerLite
                                        {...this.getColumnsPickerLiteProps()}
                                        withTooltip
                                    />
                                </div>
                                <div>
                                    <AddToDashboardButton onClick={this.a2d} />
                                </div>
                            </FlexRow>
                        </Right>
                    </SearchContainerWrapper>
                </Container>
            </div>
        );
    }
    private getSelectedCategoryIds = (categories): string[] => {
        return this.props.selectedCategory
            ? categories.reduce((result, current) => {
                  if (this.props.selectedCategory.includes(current.id)) {
                      result.push(current.id);
                  }
                  current.sons.forEach(({ id }) => {
                      if (this.props.selectedCategory.includes(id)) {
                          result.push(id);
                      }
                  });
                  return result;
              }, [])
            : [];
    };

    private getCategoryLink = (category) => {
        return decodeURIComponent(
            this.props.href(this.props.current().name, {
                referralsCategory: category,
            }),
        );
    };

    private onIndustryClick = (value, updateUrl = false) => {
        this.props.onFilterChange({ referralsCategory: value }, updateUrl);
    };

    private onAdvancedFilterToggle = (isOpen: boolean) => {
        if (isOpen) {
            allTrackers.trackEvent("Drop Down", "open", "advanced filter");
        } else {
            allTrackers.trackEvent("Drop Down", "close", "advanced filter");
        }
    };

    private getAdvancedFilterSelectedText = () => {
        const keys = this.props.params.key.split(",").map((domain) => {
            return {
                name: domain,
            };
        });
        const filter = this.props.params.limits;
        return IncomingReferralsAdvancedFilterService.getAdvancedFilterSelectedText(
            keys,
            filter,
            i18n,
        );
    };

    private getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = this.props.tableColumns.reduce((res, col, index) => {
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
            onColumnToggle: this.onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };

    private onColumnToggle = (key) => {
        this.props.onClickToggleColumns(parseInt(key));
    };

    private getPresetsOptions = () => {
        const filters = IncomingReferralsAdvancedFilterService.getAllFilters();
        return filters.map(({ api, id, name, tooltip }, index) => {
            return (
                <EllipsisDropdownItem
                    key={`advanced-filter-item-${index}`}
                    id={id}
                    tooltipText={i18n(tooltip)}
                    selected={id === this.props.selectedLimits}
                >
                    {i18n(name)}
                </EllipsisDropdownItem>
            );
        });
    };

    private onSelectCategory = (categories) => {
        const value = categories ? categories.map((x) => x.id).join(",") : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);
        this.onIndustryClick(value, true);
    };

    private onSelectAdvancedFilter = (selected) => {
        const value = selected ? selected.id : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `advanced filter/${value}`);
        this.props.onFilterChange({ limits: selected && selected.id }, true);
    };

    private onClearAdvancedFilter = () => {
        this.onSelectAdvancedFilter(null);
    };

    private getEngagementTypePresetsOptions = () => {
        return IncomingReferralsEngagementFilters.map(({ id, name, tooltip, api }, index) => {
            return (
                <EllipsisDropdownItem
                    key={`engagement-filter-item-${index}`}
                    id={id}
                    tooltipText={i18n(tooltip)}
                    selected={api === this.props.selectedEngagementTypeFilter}
                >
                    {i18n(name)}
                </EllipsisDropdownItem>
            );
        });
    };

    private isClearAllDisabled = () => {
        const {
            referralsCategory,
            limits,
            engagementTypeFilter,
            IncludeNewReferrals,
            IncludeTrendingReferrals,
        } = this.props.params;
        // button is disabled unless one of the filters has selected value
        return (
            !referralsCategory &&
            !limits &&
            !engagementTypeFilter &&
            !IncludeNewReferrals &&
            !IncludeTrendingReferrals
        );
    };

    private onClearAll = () => {
        allTrackers.trackEvent("Button", "click", "Table/Clear all");
        const resetParams = {
            IncludeNewReferrals: null,
            IncludeTrendingReferrals: null,
            limits: null,
            engagementTypeFilter: null,
            referralsCategory: null,
        };
        this.props.onFilterChange(resetParams, true);
    };

    private trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    private a2d = () => {
        const { webSource, filter } = this.props.filtersStateObject;

        this.addToDashboardModal = addToDashboard({
            modelType: "fromWebsite",
            metric: "TopReferrals",
            type: "TopReferralsDashboardTable",
            webSource: webSource,
            filters: { filter: this.convertFiltersToDashboard(filter) },
        });
    };

    private convertFiltersToDashboard = (filter = "") => {
        let allFilters = filter;
        if (this.props.params.referralsCategory) {
            if (filter !== "") {
                allFilters = allFilters.concat(",");
            }
            const cat = this.props.params.referralsCategory.split(",")[0];
            allFilters = allFilters.concat(`category;category;"${cat}"`);
        }
        return allFilters;
    };

    private getEngagementTypeFilterName = (selectedApi) => {
        if (selectedApi) {
            const keys = this.props.params.key.split(",").map((domain) => {
                return {
                    name: domain,
                };
            });
            const filter = IncomingReferralsEngagementFilters.find(
                (IncomingReferralsEngagementFilters) =>
                    IncomingReferralsEngagementFilters.api === selectedApi,
            );
            return filter ? i18nFilter()(filter.selected, { domain: keys[0].name }) : null;
        }
        return null;
    };

    private onEngagementTypeFilterToggle = (isOpen: boolean) => {
        if (isOpen) {
            allTrackers.trackEvent("Drop Down", "open", "engagement filter");
        } else {
            allTrackers.trackEvent("Drop Down", "close", "engagement filter");
        }
    };

    private onSelectEngagementTypeFilter = (filter) => {
        const id = filter ? filter.id : null;
        const selectedFilter = id
            ? IncomingReferralsEngagementFilters.find(
                  (IncomingReferralsEngagementFilters) =>
                      IncomingReferralsEngagementFilters.id === id,
              )
            : { api: null, id: "ClearFilter" };
        allTrackers.trackEvent("Drop Down", "click", `engagement filter/${selectedFilter.id}`);
        const params = { engagementTypeFilter: filter ? selectedFilter.api : null };
        this.props.onFilterChange(params, true);
    };

    private onClearEngagementTypeFilter = () => {
        this.onSelectEngagementTypeFilter(null);
    };

    private isEngagementTypeFilterHidden = () => {
        const { webSource, duration } = this.props.params;
        const durationObject = DurationService.getDurationData(duration, null, null, null);
        const { to } = durationObject.raw;
        return webSource === "MobileWeb" || duration === "28d" || to.isBefore("2018-10-01");
    };
}

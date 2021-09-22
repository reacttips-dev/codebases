import { AdvancedFilterButton } from "components/filtersPanel/src/filtersPanel";
import { Pill } from "components/Pill/Pill";
import I18n from "components/WithTranslation/src/I18n";
import * as React from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import UIComponentStateService from "services/UIComponentStateService";
import {
    numberFilter,
    i18nFilter,
    minVisitsAbbrFilter,
    percentageFilter,
    suffixFilter,
} from "filters/ngFilters";
import { DownloadExcelContainer } from "pages/workspace/StyledComponent";
import styled from "styled-components";

import { Injector } from "common/ioc/Injector";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { allTrackers } from "services/track/track";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { TagsCloud } from "components/TagsCloud/TagsCloud";
import { CategoryDistribution } from "../CategoryDisterbution";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import BoxSubtitle from "../../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
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
import DurationService from "services/DurationService";
import { MultiCategoriesChipDown } from "components/MultiCategoriesChipDown/src/MultiCategoriesChipDown";
import { adaptDomainCategoryItems } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsCategoriesManager";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import categoryService from "common/services/categoryService";
import { ICategory } from "common/services/categoryService.types";
import { BooleanSearchWithBothKeywordsAndWebsiteWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsiteWrapper";
import {
    onChipAdd,
    onChipRemove,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { EBooleanSearchActions } from "pages/website-analysis/traffic-sources/search/BooleanSearchWithBothKeywordsAndWebsite";
import { IRouterState } from "routes/allStates";
import { StateOrName, RawParams, HrefOptions } from "@uirouter/angularjs";
import { Loader } from "pages/website-analysis/incoming-traffic/Loader";

interface IIncomingTrafficSingleTableTopProps {
    allCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    isLoadingData: boolean;
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
    onFilterChange: any;
    selectedCategory?: string;
    selectedCategoryId?: string;
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
    updateParams: any;
    params: any;
    current: () => IRouterState;
    onBooleanSearchChange: (params) => void;
    href: (stateOrName: StateOrName, params?: RawParams, options?: HrefOptions) => string;
}

export const LOCAL_COMPETITIVE_KEY = "competitive-filter-single";
export const LOCAL_ENGAGEMENT_KEY = "engagement-filter-single";

const ChipdownItem = styled.div`
    flex-grow: 0;
    .ChipItemText {
        @media (max-width: 1366px) {
            max-width: 205px;
        }
    }
`;

const Title = styled.div`
    padding: 24px 24px 22px 24px;
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
`;

export const SingleBox = styled.div<{ border: number }>`
    border: ${({ border }) => border}px solid ${colorsPalettes.carbon[50]};
    border-radius: 4px;
    overflow: hidden;
`;

const CategoriesAndTopicsDist = styled.div`
    display: flex;
    margin: 17px 0 24px 0;
`;

const CategoriesWrapper = styled(SingleBox as any)`
    flex-basis: 60%;
    margin-right: 16px;
`;

const TopicsWrapper = styled(SingleBox as any)`
    flex-basis: 40%;
    padding: 16px;
    box-sizing: border-box;
`;

const TopicsTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 20px;
    display: flex;
`;

const i18n = i18nFilter();

export class IncomingTrafficSingleTableTop extends React.PureComponent<
    IIncomingTrafficSingleTableTopProps,
    any
> {
    static defaultProps = {
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
        prevProps: Readonly<IIncomingTrafficSingleTableTopProps>,
        prevState: Readonly<any>,
        snapshot?: any,
    ) {
        if (prevProps.params.referralsCategory !== this.props.params.referralsCategory) {
            this.onIndustryClick(this.props.params.referralsCategory);
        }
    }

    componentWillUnmount() {
        if (this.addToDashboardModal) {
            this.addToDashboardModal.dismiss();
        }
    }

    render() {
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
        const { onCheckboxChange: onCheckboxChangeProp } = this.props;
        const onCheckboxChange = (field) => () => {
            const currentValue = this.props.params[field] === "true";
            onCheckboxChangeProp({ field, value: !currentValue });
            this.props.onFilterChange({ [field]: !currentValue }, false);
        };
        const onBooleanSearchChange = (params) => {
            this.props.onFilterChange(
                { ExcludeUrls: params.ExcludeUrls, IncludeUrls: params.IncludeUrls },
                false,
            );
        };
        return (
            <div>
                <Title>
                    <PrimaryBoxTitle>
                        {i18n("analysis.common.trafficsource.referrals.websites")}
                    </PrimaryBoxTitle>
                    <SubTitleReferrals>
                        <BoxSubtitle filters={subTitleFilters} />
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
                                            <Filter>
                                                <PlainTooltip
                                                    tooltipContent={i18nFilter()(
                                                        "analysis.source.referrals.filters.advanced.single.tooltip",
                                                    )}
                                                >
                                                    <span onClick={this.onAdvancedFilterToggle}>
                                                        <AdvancedFilterButton>
                                                            <I18n>
                                                                analysis.source.search.keywords.filters.advanced.addcompetitor
                                                            </I18n>
                                                            <Pill text="NEW" />
                                                        </AdvancedFilterButton>
                                                    </span>
                                                </PlainTooltip>
                                            </Filter>
                                            {!this.isEngagementTypeFilterHidden() && (
                                                <Filter>
                                                    <PlainTooltip
                                                        tooltipContent={i18nFilter()(
                                                            "analysis.compare.trafficsource.referrals.engagement.filter.tooltip",
                                                        )}
                                                    >
                                                        <span
                                                            onClick={
                                                                this.onEngagementTypeFilterToggle
                                                            }
                                                        >
                                                            <AdvancedFilterButton>
                                                                <I18n>
                                                                    analysis.compare.trafficsource.referrals.engagement.filter.main
                                                                </I18n>
                                                                <Pill text="NEW" />
                                                            </AdvancedFilterButton>
                                                        </span>
                                                    </PlainTooltip>
                                                </Filter>
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
                                <CategoriesAndTopicsDist>
                                    <CategoriesWrapper border={1}>
                                        <CategoryDistribution
                                            domains={this.props.domainMetaData}
                                            data={this.props.categoriesData}
                                            getLink={this.getCategoryLink}
                                        />
                                    </CategoriesWrapper>
                                    <TopicsWrapper border={1}>
                                        <TopicsTitle>
                                            {i18n("shared.cats-topics.title2")}
                                            <PlainTooltip
                                                placement="top"
                                                tooltipContent={i18n(
                                                    "shared.cats-topics.title2.tooltip",
                                                )}
                                            >
                                                <span>
                                                    <InfoIcon iconName="info" />
                                                </span>
                                            </PlainTooltip>
                                        </TopicsTitle>
                                        <TagsCloud tags={this.props.topics} />
                                    </TopicsWrapper>
                                </CategoriesAndTopicsDist>
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
        return this.props.href(this.props.current().name, {
            referralsCategory: category,
        });
    };

    private onIndustryClick = (value, updateUrl = false) => {
        this.props.onFilterChange({ referralsCategory: value }, updateUrl);
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

    private onSelectCategory = (categories) => {
        const value = categories ? categories.map((x) => x.id).join(",") : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);
        this.onIndustryClick(value, true);
    };

    private isClearAllDisabled = () => {
        const {
            referralsCategory,
            IncludeNewReferrals,
            IncludeTrendingReferrals,
        } = this.props.params;
        // button is disabled unless one of the filters has selected value
        return !referralsCategory && !IncludeNewReferrals && !IncludeTrendingReferrals;
    };

    private onClearAll = () => {
        allTrackers.trackEvent("Button", "click", "Table/Clear all");
        const resetParams = {
            IncludeNewReferrals: null,
            IncludeTrendingReferrals: null,
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

    private onAdvancedFilterToggle = () => {
        allTrackers.trackEvent("drop down", "open", "advanced filter");
        const $modal = Injector.get<any>("$modal");
        const $scope = Injector.get<any>("$rootScope").$new();
        $scope.customSubmit = (config) => {
            UIComponentStateService.setItem(LOCAL_COMPETITIVE_KEY, "localStorage", "true", false);
            this.props.updateParams(config);
        };
        $modal.open({
            templateUrl: "/partials/websites/modal-compare.html",
            controller: "ModalCompareInstanceCtrl",
            controllerAs: "ctrl",
            scope: $scope,
        });
    };

    private onEngagementTypeFilterToggle = () => {
        allTrackers.trackEvent("drop down", "open", "score filter");
        const $modal = Injector.get<any>("$modal");
        const $scope = Injector.get<any>("$rootScope").$new();
        $scope.customSubmit = (config) => {
            UIComponentStateService.setItem(LOCAL_ENGAGEMENT_KEY, "localStorage", "true", false);
            this.props.updateParams(config);
        };
        $modal.open({
            templateUrl: "/partials/websites/modal-compare.html",
            controller: "ModalCompareInstanceCtrl",
            controllerAs: "ctrl",
            scope: $scope,
        });
    };

    private isEngagementTypeFilterHidden = () => {
        const { webSource, duration } = this.props.params;
        const durationObject = DurationService.getDurationData(duration, null, null, null);
        const { to } = durationObject.raw;
        return webSource === "MobileWeb" || duration === "28d" || to.isBefore("2018-10-01");
    };
}

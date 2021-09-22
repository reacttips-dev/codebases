import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Switcher } from "@similarweb/ui-components/dist/switcher";
import { BoxFooter } from "Arena/StyledComponents";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { MarketingWorkspaceOverviewKWTableLegend } from "pages/workspace/marketing/shared/styledComponents";
import * as React from "react";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import BoxSubtitle from "../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import BoxTitle from "../../../../.pro-features/components/BoxTitle/src/BoxTitle";
import Chart from "../../../../.pro-features/components/Chart/src/Chart";
import { GraphLoader } from "../../../../.pro-features/components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { NoData } from "../../../../.pro-features/components/NoData/src/NoData";
import {
    StyledHeader,
    StyledHeaderNoBorder,
    StyledHeaderTitle,
} from "../../../../.pro-features/pages/app performance/src/page/StyledComponents";
import { NoDataContainer } from "../../../../.pro-features/pages/conversion/components/benchmarkOvertime/StyledComponents";
import StyledBoxSubtitle from "../../../../.pro-features/styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { StyledChartFilterSwitcherItem } from "../../../../.pro-features/styled components/StyledChartFilterSwitcherItem/src/StyledChartFilterSwitcherItem";
import { CHART_COLORS } from "../../../constants/ChartColors";
import {
    categoryClassIconFilter,
    i18nCategoryFilter,
    i18nFilter,
    subCategoryFilter,
} from "../../../filters/ngFilters";
import { allTrackers } from "../../../services/track/track";
import { getChartConfig } from "./chartConfig";
import {
    CategoriesChipDownContainer,
    CategoryItemContainer,
    ChannelsBox,
    ChartContainer,
    CheckboxesContainer,
    FiltersContainer,
} from "./StyledComponents";
import categoryService from "common/services/categoryService";

export enum displayType {
    number,
    percent,
}

export interface IArenaChannelsOverviewProps {
    filters: {
        from: string;
        to: string;
        webSource: string;
        keys: string[];
        domains: any;
        country: number;
        duration: string;
        isWWW: string;
    };
    data: {
        Total: {
            [key: string]: {
                [key: string]: number;
            };
        };
        UnbouncedVisits: {
            [key: string]: {
                [key: string]: number;
            };
        };
        Mobile: {
            [key: string]: {
                [key: string]: number;
            };
        };
    };
    categoryData: {
        Total: {
            [key: string]: {
                [key: string]: number;
            };
        };
        UnbouncedVisits: {
            [key: string]: {
                [key: string]: number;
            };
        };
    };
    loading: boolean;
    sitesForLegend: any;
    isPdf: boolean;
    country: number;
    getCountryById: any;
    selectedCategoryId?: string;
    onCategoryChange: (categoryId) => void;
}

export interface IArenaChannelsOverviewState {
    isBenchmarked: boolean;
    isUnbounced: boolean;
    displayType: displayType;
}

export default class ArenaChannelsOverview extends React.PureComponent<
    IArenaChannelsOverviewProps,
    IArenaChannelsOverviewState
> {
    private readonly swNavigator: any;
    private readonly primaryDomain;

    constructor(props, context) {
        super(props, context);
        this.state = {
            isBenchmarked: false,
            isUnbounced: false,
            displayType: displayType.number,
        };

        this.primaryDomain = props.filters.domains[0];
        this.swNavigator = Injector.get<SwNavigator>("swNavigator");
    }

    public render() {
        const { filters, loading, sitesForLegend, isPdf, country, getCountryById } = this.props;
        const { from, to } = filters;
        const { isBenchmarked, isUnbounced, displayType } = this.state;
        const finalData = this.getData();
        const benchmarkTo = (
            <div>
                {i18nFilter()("arena.strategic.channels.benchmark")}{" "}
                <b>{this.primaryDomain.domain}</b>
            </div>
        );
        const subtitleFilters = [
            {
                filter: "date",
                value: {
                    from,
                    to,
                },
            },
            {
                filter: "webSource",
                value: filters.webSource === "MobileWeb" ? filters.webSource : "Desktop",
            },
            {
                filter: "country",
                countryCode: country,
                value: getCountryById(country).text,
            },
        ];
        const learnMoreLink = this.swNavigator.href("websites-trafficOverview", {
            ...filters,
            key: filters.keys,
            category: this.props.selectedCategoryId,
        });

        return (
            <ChannelsBox
                data-sw-intercom-tour-workspaces-marketing-arena_channels_overview-channels_box-step-6
            >
                <StyledHeader>
                    <StyledHeaderTitle>
                        <BoxTitle tooltip={i18nFilter()("arena.strategic.channels.tooltip")}>
                            {i18nFilter()("arena.strategic.channels.title")}
                        </BoxTitle>
                    </StyledHeaderTitle>
                    <StyledBoxSubtitle>
                        <BoxSubtitle filters={subtitleFilters} />
                    </StyledBoxSubtitle>
                    {isPdf && <MarketingWorkspaceOverviewKWTableLegend sites={sitesForLegend} />}
                </StyledHeader>
                {filters.webSource !== "MobileWeb" && (
                    <FiltersContainer>
                        <CheckboxesContainer>
                            <PlainTooltip
                                tooltipContent={i18nFilter()(
                                    "arena.strategic.channels.benchmark.tooltip",
                                )}
                            >
                                <div>
                                    <Checkbox
                                        selected={isBenchmarked}
                                        label={benchmarkTo}
                                        onClick={this.toggleBenchmark}
                                    />
                                </div>
                            </PlainTooltip>
                            <PlainTooltip
                                tooltipContent={i18nFilter()(
                                    "arena.strategic.channels.unbounced.tooltip",
                                )}
                            >
                                <div>
                                    <Checkbox
                                        selected={isUnbounced}
                                        label={i18nFilter()("arena.strategic.channels.unbounced")}
                                        onClick={this.toggleUnbounced}
                                    />
                                </div>
                            </PlainTooltip>
                        </CheckboxesContainer>
                        <FlexRow alignItems="center">
                            <CategoriesChipDownContainer>
                                <ChipDownContainer
                                    width={340}
                                    onClick={this.onSelectCategory}
                                    selectedText={this.getSelectedCategoryText()}
                                    onCloseItem={this.onClearCategory}
                                    buttonText={i18nFilter()(
                                        "workspace.marketing.arena.channels.overview.benchmark.to.category",
                                    )}
                                    searchPlaceHolder={i18nFilter()(
                                        "home.dashboards.wizard.filters.searchCategory",
                                    )}
                                    hasSearch={true}
                                    disabled={this.state.isBenchmarked || this.state.isUnbounced}
                                >
                                    {this.getCategoriesOptions()}
                                </ChipDownContainer>
                            </CategoriesChipDownContainer>
                            <Switcher
                                selectedIndex={displayType}
                                customClass="TextSwitcher"
                                onItemClick={(index) => this.toggleDisplayType(index)}
                            >
                                <StyledChartFilterSwitcherItem>#</StyledChartFilterSwitcherItem>
                                <StyledChartFilterSwitcherItem>%</StyledChartFilterSwitcherItem>
                            </Switcher>
                        </FlexRow>
                    </FiltersContainer>
                )}
                <ChartContainer>
                    {loading && <GraphLoader width={"100%"} height={"232px"} />}
                    {!loading && finalData && (
                        <Chart
                            type="column"
                            data={finalData}
                            config={getChartConfig(
                                finalData,
                                isBenchmarked,
                                this.primaryDomain,
                                displayType,
                                {
                                    key: filters.domains.map((d) => d.domain).join(","),
                                    country: filters.country,
                                    webSource: filters.webSource,
                                    duration: filters.duration,
                                    isWWW: filters.isWWW,
                                },
                            )}
                        />
                    )}
                    {!loading && !finalData && (
                        <NoDataContainer>
                            {" "}
                            <NoData />{" "}
                        </NoDataContainer>
                    )}
                </ChartContainer>
                <BoxFooter>
                    <a href={learnMoreLink}>
                        <Button type="flat">
                            {i18nFilter()("workspace.arena.channels_overview.learn_more.button")}
                        </Button>
                    </a>
                </BoxFooter>
            </ChannelsBox>
        );
    }

    public toggleBenchmark = () => {
        allTrackers.trackEvent(
            "Checkbox",
            this.state.isBenchmarked ? "remove" : "add",
            `channels overview/benchmark/benchmark/${this.primaryDomain.domain}`,
        );
        this.setState({ isBenchmarked: !this.state.isBenchmarked });
    };

    public toggleUnbounced = () => {
        allTrackers.trackEvent(
            "Checkbox",
            this.state.isUnbounced ? "remove" : "add",
            "channels overview/only unbounced visits",
        );
        this.setState({ isUnbounced: !this.state.isUnbounced });
    };

    public toggleDisplayType = (index) => {
        allTrackers.trackEvent(
            "Measure Button",
            "click",
            `channels overview/${
                this.state.displayType === displayType.number ? "percent" : "number"
            }`,
        );
        this.setState({ displayType: index });
    };

    public getData = () => {
        if (this.props.loading) {
            return;
        }
        if (!this.props.data.UnbouncedVisits && !this.props.data.Total && !this.props.data.Mobile) {
            return undefined;
        }
        const rawData = this.props.data.Mobile
            ? this.props.data.Mobile
            : this.state.isUnbounced
            ? this.props.data.UnbouncedVisits
            : this.props.data.Total;
        if (!rawData[Object.keys(rawData)[0]]) {
            return undefined;
        }
        const categoryRawData = this.props.categoryData;
        if (this.state.isBenchmarked) {
            return this.getBenchmarkedData(rawData, categoryRawData);
        } else if (this.state.displayType === displayType.percent) {
            return this.getPercentageData(rawData, categoryRawData);
        } else {
            return this.toHighchartsData(rawData, categoryRawData);
        }
    };

    public getBenchmarkedData = (rawData, categoryRawData) => {
        // returns new data which is the difference between all sites and the first site
        const data =
            this.state.displayType === displayType.percent
                ? this.getPercentageData(rawData, categoryRawData)
                : this.toHighchartsData(rawData, categoryRawData); // benchmarked + percentage mode
        const benchmarked = [];
        for (let i = 1; i < data.length; i++) {
            benchmarked.push({
                name: data[i].name,
                color: CHART_COLORS.chartMainColors[i],
                data: data[i].data.map((item, index) => item - data[0].data[index]),
            });
        }
        return benchmarked;
    };

    public getPercentageData = (rawData, categoryRawData) => {
        // returns new data which is displayed by percentages of all channels
        const sums = Object.values(rawData).map((item) =>
            Object.values(item).reduce((a, b) => a + b, 0),
        );
        if (categoryRawData) {
            const categoryRawDataEntries = Object.entries(categoryRawData);
            if (categoryRawDataEntries.length > 0) {
                sums.push(Object.values(categoryRawDataEntries[0][1]).reduce((a, b) => a + b, 0));
            }
        }
        return this.toHighchartsData(rawData, categoryRawData).map((item, index) => ({
            ...item,
            data: item.data.map((subItem) => subItem / sums[index]),
        }));
    };

    public toHighchartsData = (rawData, categoryRawData) => {
        const order =
            this.props.filters?.webSource === "MobileWeb"
                ? ["Direct", "Email", "Referrals", "Social", "Display Ads", "Search"]
                : [
                      "Direct",
                      "Mail",
                      "Referrals",
                      "Social",
                      "Organic Search",
                      "Paid Search",
                      "Paid Referrals",
                  ];

        const entries = Object.entries(rawData);
        // use type any because we're going to add item with more properties later
        const highChartData = entries.map<any>((item, index) => ({
            name: item[0],
            color: CHART_COLORS.chartMainColors[index],
            data: order.map((subItem) => item[1]?.[subItem] ?? null),
            borderWidth: 0,
        }));

        const categoryData = Object.entries(categoryRawData)[0];
        if (categoryData && !this.state.isBenchmarked && !this.state.isUnbounced) {
            highChartData.push({
                name: this.getCategorySerieTooltipText(),
                color: colorsPalettes.midnight[50],
                data: order.map((subItem) => (categoryData[1] ? categoryData[1][subItem] : null)),
                grouping: false,
                pointRange: this.getCategoryBarPointRange(highChartData.length),
                isCategorySeries: true,
                maxPointWidth: null,
                pointPadding: 0.15,
                pointWidth: null,
                zIndex: -1,
                borderWidth: 0,
                states: {
                    hover: {
                        brightness: 0,
                    },
                },
            });
        }
        return highChartData;
    };

    private getCategoryBarPointRange = (count) => {
        switch (count) {
            case 0:
                return 0.5;
            case 1:
                return 1;
            default:
                return 1.5;
        }
    };

    private onSelectCategory = (category) => {
        this.props.onCategoryChange(category && category.id);
    };

    private onClearCategory = () => {
        this.onSelectCategory(null);
        // this.props.onCategoryChange(null)
    };

    private getCategoriesOptions = () => {
        const allCategories = categoryService.getCategories();
        const customCategories = UserCustomCategoryService.getCustomCategories();

        const items = customCategories.concat(
            allCategories.reduce((result, category) => {
                if (category.children.length > 0) {
                    return [
                        ...result,
                        this.convertCategory(category),
                        ...category.children.map((child) =>
                            this.convertCategory(child, category.id),
                        ),
                    ];
                } else {
                    return [...result, this.convertCategory(category)];
                }
            }, []),
        );

        return items.map((item, index) => {
            return <CategoryItemContainer {...item} key={index} />;
        });
    };

    private convertCategory = ({ text, children = [], id }, parentId = null) => {
        return {
            text,
            id,
            isCustomCategory: false,
            isChild: children.length === 0,
            icon: categoryClassIconFilter()(id),
            forApi: `${parentId ? `${parentId}~` : ``}${id}`,
        };
    };

    private getSelectedCategoryText = () => {
        if (this.props.selectedCategoryId && !this.state.isBenchmarked && !this.state.isUnbounced) {
            return i18nFilter()("workspace.marketing.arena.channels.overview.benchmark.to", {
                category: i18nCategoryFilter()(this.props.selectedCategoryId),
            });
        }
        return null;
    };

    private getCategorySerieTooltipText = () => {
        if (this.props.selectedCategoryId) {
            return i18nFilter()("workspace.marketing.arena.channels.overview.benchmark", {
                category: subCategoryFilter()(this.props.selectedCategoryId).toString(),
            });
        }
    };
}

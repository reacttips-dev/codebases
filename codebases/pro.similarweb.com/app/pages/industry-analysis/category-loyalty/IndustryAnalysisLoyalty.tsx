import { colorsPalettes } from "@similarweb/styles";
import BoxTitle from "components/BoxTitle/src/BoxTitle";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { i18nFilter } from "filters/ngFilters";
import { CategoryLoyaltyTableContainer } from "pages/industry-analysis/category-loyalty/CategoryLoyaltyTableContainer";
import {
    GraphWapper,
    LegnedItem,
    LoyaltyTitleContainer,
    MaxLabel,
    MinLabel,
    TableBoxContainer,
} from "pages/industry-analysis/category-loyalty/StyledComponents";
import {
    GraphContainer,
    NoDataContainer,
    SitesChartLoaderContainer,
    StyledHeaderTitle,
} from "pages/segments/components/benchmarkOvertime/StyledComponents";
import { ICategoryLoyaltyTableData } from "pages/website-analysis/audience-loyalty/LoyaltyApiService";
import {
    BoxContainer,
    ContentContainer,
    LegendContainer,
    StyledBoxSubtitleLoyalty,
    StyledNoData,
} from "pages/website-analysis/audience-loyalty/StyledComponents";
import { NoSuggestionsArt } from "pages/workspace/common/arts/WorkspaceArts";
import React from "react";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { Injector } from "common/ioc/Injector";
import DurationService from "services/DurationService";

export interface IIndustryAnalysisLoyalty {
    isCategoryChartLoading: boolean;
    categoryChartData: {
        backgroundColor: string;
        color: string;
        name: string;
        text: string;
        width: number;
    }[];
    isTableLoading: boolean;
    tableData: ICategoryLoyaltyTableData;
    tableExcelUrl: string;
}

export const LOYALTY_CATEGORIES_COLORS = {
    "0": {
        backgroundColor: colorsPalettes.midnight["400"],
        color: colorsPalettes.carbon["0"],
    },
    "1": {
        backgroundColor: colorsPalettes.blue["500"],
        color: colorsPalettes.carbon["0"],
    },
    "2": {
        backgroundColor: colorsPalettes.blue["400"],
        color: colorsPalettes.carbon["0"],
    },
    "3": {
        backgroundColor: colorsPalettes.blue["300"],
        color: colorsPalettes.carbon["0"],
    },
    "4": {
        backgroundColor: colorsPalettes.sky["300"],
        color: colorsPalettes.black["0"],
    },
    "5+": {
        backgroundColor: colorsPalettes.sky["200"],
        color: colorsPalettes.black["0"],
    },
};

export const IndustryAnalysisLoyalty = (props: IIndustryAnalysisLoyalty) => {
    const {
        isCategoryChartLoading,
        categoryChartData,
        isTableLoading,
        tableData,
        tableExcelUrl,
    } = props;
    const noDataTexts = {
        title: "category.analysis.loyalty.no.data.title",
        subtitle: "category.analysis.loyalty.no.data.subtitle",
    };

    const renderLegend = () => {
        const legenditems = Object.keys(LOYALTY_CATEGORIES_COLORS).map((bucket) => {
            return (
                <LegnedItem
                    color={LOYALTY_CATEGORIES_COLORS[bucket].backgroundColor}
                    title={i18nFilter()(`industry.analysis.loyalty.legend.${bucket}`)}
                />
            );
        });
        return <LegendContainer>{legenditems}</LegendContainer>;
    };

    const swNavigator = Injector.get("swNavigator") as any;
    const params = swNavigator.getParams();
    const { from, to } = DurationService.getDurationData(params.duration).forAPI;
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
            value: "Desktop", // values: available: 'Total' / 'Desktop'
        },
    ];

    const renderCategoryChart = () => {
        return (
            <BoxContainer data-automation-sites-vs-category={true}>
                <LoyaltyTitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle
                                tooltip={i18nFilter()(
                                    "industry.analysis.loyalty.graph.title.tooltip",
                                )}
                            >
                                {i18nFilter()("industry.analysis.loyalty.graph.title")}
                            </BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                        <StyledBoxSubtitleLoyalty>
                            {i18nFilter()("industry.analysis.loyalty.graph.subtitle")}
                        </StyledBoxSubtitleLoyalty>
                    </FlexColumn>
                </LoyaltyTitleContainer>
                <ContentContainer>
                    {isCategoryChartLoading ? (
                        <SitesChartLoaderContainer>
                            <GraphLoader width={"100%"} />
                        </SitesChartLoaderContainer>
                    ) : (
                        <GraphContainer className={"sharedTooltip"}>
                            {categoryChartData && categoryChartData?.length > 0 ? (
                                <>
                                    {renderLegend()}
                                    <GraphWapper>
                                        <MinLabel>
                                            {i18nFilter()(
                                                "industry.analysis.loyalty.legend.minLabel",
                                            )}
                                        </MinLabel>
                                        <TrafficShareWithTooltip
                                            title={""}
                                            data={categoryChartData}
                                        />
                                        <MaxLabel>
                                            {i18nFilter()(
                                                "industry.analysis.loyalty.legend.maxLabel",
                                            )}
                                        </MaxLabel>
                                    </GraphWapper>
                                </>
                            ) : (
                                <NoDataContainer>
                                    {" "}
                                    <StyledNoData
                                        title={noDataTexts.title}
                                        subtitle={noDataTexts.subtitle}
                                        SvgImage={NoSuggestionsArt}
                                    />{" "}
                                </NoDataContainer>
                            )}
                        </GraphContainer>
                    )}
                </ContentContainer>
            </BoxContainer>
        );
    };

    const renderTable = () => {
        return (
            <TableBoxContainer data-automation-sites-vs-category={true}>
                <LoyaltyTitleContainer>
                    <FlexColumn>
                        <StyledHeaderTitle>
                            <BoxTitle
                                tooltip={i18nFilter()(
                                    "industry.analysis.loyalty.table.title.tooltip",
                                )}
                            >
                                {i18nFilter()("audience.loyalty.table.title")}
                            </BoxTitle>
                        </StyledHeaderTitle>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={subtitleFilters} />
                        </StyledBoxSubtitle>
                        <StyledBoxSubtitleLoyalty>
                            {i18nFilter()("industry.analysis.loyalty.table.subtitle")}
                        </StyledBoxSubtitleLoyalty>
                    </FlexColumn>
                </LoyaltyTitleContainer>
                <ContentContainer>
                    {!isTableLoading && !tableData?.Data ? (
                        <NoDataContainer>
                            {" "}
                            <StyledNoData
                                title={noDataTexts.title}
                                subtitle={noDataTexts.subtitle}
                                SvgImage={NoSuggestionsArt}
                            />{" "}
                        </NoDataContainer>
                    ) : (
                        <CategoryLoyaltyTableContainer
                            generateTableExcelApiUrl={tableExcelUrl}
                            isLoading={isTableLoading}
                            tableData={tableData?.Data}
                        />
                    )}
                </ContentContainer>
            </TableBoxContainer>
        );
    };

    return (
        <>
            {renderCategoryChart()}
            {renderTable()}
        </>
    );
};

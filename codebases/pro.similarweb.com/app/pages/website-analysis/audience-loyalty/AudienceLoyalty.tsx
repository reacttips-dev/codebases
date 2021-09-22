import { colorsPalettes } from "@similarweb/styles";
import { BulletLegends } from "components/React/Legends/BulletLegends";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import Chart from "components/Chart/src/Chart";
import { GraphLoader } from "components/Loaders/src/ExpandedTableRowLoader/ExpandedTableRowLoader";
import { CategoryDropdown } from "components/React/CategoriesDropdown";
import { CHART_COLORS } from "constants/ChartColors";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter, percentageSignFilter } from "filters/ngFilters";
import * as _ from "lodash";
import {
    GraphContainer,
    NoDataContainer,
    SitesChartLoaderContainer,
    StyledHeaderTitle,
    TitleContainer,
    UtilitiesContainer,
} from "pages/segments/components/benchmarkOvertime/StyledComponents";
import {
    getBarChartConfig,
    getChartConfig,
    multipleDomainsTooltipFormatter,
} from "pages/website-analysis/audience-loyalty/chartConfig";
import LoyaltyApiService, {
    IDomainLoyaltyData,
} from "pages/website-analysis/audience-loyalty/LoyaltyApiService";
import {
    BoxContainer,
    ButtonsContainer,
    ChartContainer,
    ContentContainer,
    Header,
    LegendContainer,
    StyledLegendCheckbox,
    StyledNoBorderButton,
    TitleRow,
} from "pages/website-analysis/audience-loyalty/StyledComponents";
import React, { useEffect, useMemo, useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FlexColumn, RightFlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { NoDataLandscape } from "components/NoData/src/NoData";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { PdfExportService } from "services/PdfExportService";
import BoxSubtitle from "components/BoxSubtitle/src/BoxSubtitle";
import StyledBoxSubtitle from "styled components/StyledBoxSubtitle/src/StyledBoxSubtitle";
import { TableNoData } from "components/React/Table/FlexTable/Big/FlexTableStatelessComponents";
import categoryService from "common/services/categoryService";
import { IFlattenedCategory } from "common/services/categoryService.types";

interface IAudienceLoyaltyOverview {
    [key: string]: any;
    isSingleMode?: boolean;
    websitesArrayWithColor?: any;
    chosenSitesLegends?: any;
    comparisonData?: any;
    isLoadingComparisonData?: boolean;
    subtitleFilters?: any;
}
interface ICategoriesAndSubCatToDomains {
    //Category or subcategory => list of category / subcategory domains
    [key: string]: string[];
}

interface IDomainsToCategoriesAndSubCat {
    //Domain => list of category / subcategory domains
    [key: string]: { Category: string; SubCategory: string };
}
const LOYALTY_NOTIFICATION_PREFIX = "WebsiteLoyalty";
export const LOYALTY_CATEGORIES = ["0", "1", "2", "3", "4", "5+"];
const DEFAULT_CATEGORY = "Comparison";
export const AudienceLoyalty = (props: IAudienceLoyaltyOverview) => {
    const [isLoading, setIsLoading] = useState(true);
    const [loyaltySitesResponse, setLoyaltySitesResponse] = useState<any>();
    const [loyaltyCategoriesResult, setLoyaltyCategoriesResult] = useState<any>();
    const [graphData, setGraphData] = useState<any>();
    const [uncheckedSitesAndCat, setUncheckedSitesAndCat] = useState<any>({});
    const [domainsCategoriesAndSubCat, setDomainsCategoriesAndSubCaMap] = useState<
        IDomainsToCategoriesAndSubCat
    >();
    const [categoriesAndSubCatToDomainsMap, setCategoriesAndSubCatToDomainsMap] = useState<
        ICategoriesAndSubCatToDomains
    >();
    const [loyaltyColumnChartData, setLoyaltyColumnChartData] = useState<any>();
    const { services } = useMemo(() => {
        return {
            services: {
                loyaltyApiService: new LoyaltyApiService(),
                swNavigator: Injector.get<SwNavigator>("swNavigator"),
                categoryService,
            },
        };
    }, []);
    const [selectedCategory, setSelectedCategory] = useState<{
        name: string;
        isSubcategory: boolean;
    }>(() => {
        const { category = DEFAULT_CATEGORY } = services.swNavigator.getParams();
        return { name: category, isSubcategory: category.indexOf("~") !== -1 };
    });

    const domains = useMemo(() => {
        if (props.isSingleMode) {
            return props.websitesArrayWithColor?.map((website) => {
                return website.name;
            });
        } else {
            return services.swNavigator.getParams().key.split(",");
        }
    }, [props.isSingleMode, props.websitesArrayWithColor]);

    const toggleDomainCategoryChartColumn = (value) => {
        uncheckedSitesAndCat[value]
            ? (uncheckedSitesAndCat[value] = undefined)
            : (uncheckedSitesAndCat[value] = true);
        setUncheckedSitesAndCat({ ...uncheckedSitesAndCat });
    };

    const renderComparisonLegend = useMemo(() => {
        let legendsItems = [];
        if (props.isSingleMode) {
            legendsItems = props.websitesArrayWithColor?.map((website, idx) => {
                return {
                    key: idx,
                    name: website.Domain,
                    color: website.color,
                    setOpacity: website.isSuggested,
                };
            });
        } else if (!props.isLoadingComparisonData) {
            legendsItems = props.chosenSitesLegends.map((site, idx) => {
                return {
                    key: idx,
                    name: site.name,
                    color: CHART_COLORS.chartMainColors[idx],
                };
            });
        }
        return <BulletLegends legendItems={legendsItems} />;
    }, [
        props.websitesArrayWithColor,
        props.chosenSitesLegends,
        props.isSingleMode,
        props.isLoadingComparisonData,
    ]);

    const renderLegends = () => {
        if (loyaltyColumnChartData) {
            const checkboxes = domains.map((domain, index) => {
                const domainChartData = _.find(
                    loyaltyColumnChartData.data,
                    (dataItem) => dataItem.name === domain,
                );
                const legendProps = {
                    label: domain,
                    onClick:
                        domainChartData || uncheckedSitesAndCat[domain]
                            ? () => toggleDomainCategoryChartColumn(domain)
                            : undefined,
                    isDisabled: false,
                    selected: domainChartData && !uncheckedSitesAndCat[domain],
                    color: CHART_COLORS.chartMainColors[index],
                    className: !domainChartData && !uncheckedSitesAndCat[domain] ? "disabled" : "",
                    setOpacity: props.websitesArrayWithColor?.find(
                        (website) => website.name === domain,
                    )?.isSuggested,
                };
                return <StyledLegendCheckbox key={domain} {...legendProps} />;
            });
            const categoryName =
                loyaltyColumnChartData.data?.[loyaltyColumnChartData.data.length - 1].name;
            const categoryLegendProps = {
                label: i18nFilter()("website.analysis.loyalty.category.legend"),
                onClick: () => {
                    toggleDomainCategoryChartColumn(categoryName);
                },
                isDisabled: false,
                selected: !uncheckedSitesAndCat[categoryName],
                color: colorsPalettes.carbon["200"],
            };
            checkboxes.push(
                <StyledLegendCheckbox key={categoryLegendProps.label} {...categoryLegendProps} />,
            );
            return <LegendContainer>{checkboxes}</LegendContainer>;
        }
        return <div />;
    };

    // const transformData = (data: ILoyaltyData)  => {
    //     return _.map(Object.keys(data?.Sites), (chartKey: string, index) => {
    //         const chartData = data.Sites[chartKey]?.["subcategory"]?.["Graph"] || [];
    //         return {
    //             name: chartKey,
    //             seriesSubtitle: "", //consider adding site subCategory,
    //             color: CHART_COLORS.chartMainColors[index],
    //             data: _.map(chartData, (dataPoint: any) => {
    //                 if (!dataPoint) {
    //                     return;
    //                 }
    //                 const datekey = dataPoint.Key;
    //                 const confidenceLevel = dataPoint.Value?.Confidence;
    //                 let value = dataPoint.Value?.Percentage;
    //                 if (isNaN(parseFloat(value))) {
    //                     value = null;
    //                 }
    //                 return {
    //                     x: dateToUTC(datekey),
    //                     y: value
    //                 };
    //             })
    //         };
    //     }
    // }

    const formatCategoryName = (category) =>
        category
            .split("~")
            .slice(-1)[0]
            .split(/[$/]/)
            .slice(-1)[0]
            .split("_")
            .map(_.capitalize)
            .join(" ");

    function prepareBarChartData({ domains, sitesData, categoriesData, selectedCategory }): any {
        const chartData =
            sitesData?.Data?.[domains[0]]?.["Category"] ||
            sitesData?.Data?.[domains[0]]?.["SubCategory"];
        const categories = LOYALTY_CATEGORIES; //chartData ? _.map(Object.keys(chartData), (loyaltyBucket: string, index) => loyaltyBucket) : [];
        const getMapper = (isSite, bucketNum, siteIndex, value, domain) => {
            const color = isSite
                ? CHART_COLORS.chartMainColors[siteIndex]
                : colorsPalettes.carbon[100];
            return {
                key: bucketNum,
                y: value,
                opacity: props.websitesArrayWithColor?.find((website) => website.name === domain)
                    ?.isSuggested
                    ? 0.4
                    : 1,
                color,
                dataLabels: {
                    enabled: isSite && domains.length <= 3,
                },
                isSite,
            };
        };
        const transformSitesData = _.map(domains, (domain, index) => {
            const domainChartData =
                selectedCategory.isSubcategory &&
                sitesData?.Data?.[domain]?.SiteCategory?.includes(
                    selectedCategory.name.replace("~", "/"),
                )
                    ? sitesData?.Data?.[domain]["SubCategory"]
                    : !selectedCategory.isSubcategory &&
                      sitesData?.Data?.[domain]?.SiteCategory?.includes(selectedCategory.name)
                    ? sitesData?.Data?.[domain]["Category"]
                    : null;
            return {
                name: domain,
                data:
                    domainChartData &&
                    categories.map((bucket) =>
                        getMapper(
                            true,
                            bucket,
                            index,
                            domainChartData?.[bucket]?.AvgPercentageUsers,
                            domain,
                        ),
                    ),
            };
        });
        const filteredTransformed = transformSitesData.filter(
            (site) => site.data && !uncheckedSitesAndCat[site.name],
        );
        if (transformSitesData.filter((site) => site.data).length === 0) {
            return undefined;
        }
        const selectedCategoryData =
            categoriesData?.Data?.[selectedCategory?.name.replace("~", "/")];
        const selectedCategoryGraphData = {
            name: formatCategoryName(selectedCategory.name),
            isCategorySeries: true,
            grouping: false,
            zIndex: -1,
            dataLabels: {
                enabled: false,
            },
            pointWidth: null,
            pointRange: 1.5,
            pointPadding: 0.15,
            maxPointWidth: null,
            data:
                selectedCategoryData &&
                !uncheckedSitesAndCat[formatCategoryName(selectedCategory.name)]
                    ? Object.keys(selectedCategoryData).map((bucket) =>
                          getMapper(
                              false,
                              bucket,
                              -1,
                              selectedCategoryData?.[bucket]?.AvgPercentageUsers,
                              "",
                          ),
                      )
                    : [],
        };
        return {
            data: [...filteredTransformed, selectedCategoryGraphData],
            categories,
        };
    }

    const comparisonColumnChartData = () => {
        if (!props.isLoadingComparisonData) {
            return Object.entries(props.comparisonData.data.LoyaltyData).map(
                ([site, data], index) => {
                    return {
                        name: site,
                        data: Object.entries(data).map(([bucket, val]) => {
                            return {
                                key: bucket,
                                color: CHART_COLORS.chartMainColors[index],
                                isSite: true,
                                opacity: props.websitesArrayWithColor?.find(
                                    (website) => website.name === site,
                                )?.isSuggested
                                    ? 0.4
                                    : 1,
                                y: val.AvgPercentageUsers,
                                dataLabels: {
                                    enabled: true,
                                },
                            };
                        }),
                    };
                },
            );
        }
        return [];
    };

    const renderColumnChart = () => {
        const isWithinComparisonMode = selectedCategory.name === DEFAULT_CATEGORY;
        const domains = services.swNavigator.getParams().key.split(",");
        if (
            isWithinComparisonMode &&
            Object.values(props.comparisonData.data.LoyaltyData)?.length === 0
        ) {
            return (
                <NoDataContainer>
                    <TableNoData
                        icon="no-data"
                        messageTitle={i18nFilter()("global.nodata.notavilable")}
                    />
                </NoDataContainer>
            );
        }
        const categories = isWithinComparisonMode
            ? Object.keys(Object.values(props.comparisonData.data.LoyaltyData).map((el) => el)[0])
            : LOYALTY_CATEGORIES;

        const graphData = isWithinComparisonMode
            ? comparisonColumnChartData()
            : loyaltyColumnChartData?.data;
        return (
            <ChartContainer>
                <Chart
                    type={"column"}
                    config={getBarChartConfig({
                        filter: [percentageSignFilter, 1],
                        categories,
                        tooltipFormatter: multipleDomainsTooltipFormatter,
                        isWithinComparisonMode,
                    })}
                    data={graphData}
                />
            </ChartContainer>
        );
    };

    const renderLineChart = () => {
        return (
            <ChartContainer>
                <Chart
                    type={"line"}
                    config={getChartConfig({ type: "line", filter: [percentageSignFilter, 1] })}
                    data={graphData}
                />
            </ChartContainer>
        );
    };

    const setDomainsCategoriesAndSubCategoriesMapsFromResponse = (
        domains,
        loyaltySitesResponse: IDomainLoyaltyData,
    ): {
        categoriesToDomainsResult: ICategoriesAndSubCatToDomains;
        domainsToCategoriesResult: IDomainsToCategoriesAndSubCat;
    } => {
        const domainsToCategoriesResult: IDomainsToCategoriesAndSubCat = {};
        const categoriesToDomainsResult: ICategoriesAndSubCatToDomains = {};
        domains.map((domain) => {
            const domainLoyaltyResult = loyaltySitesResponse?.Data?.[domain];
            if (domainLoyaltyResult && domainLoyaltyResult.SiteCategory) {
                // @ts-ignore
                const domainCategories = domainLoyaltyResult?.SiteCategory.split("/");
                if (domainCategories.length === 1) {
                    domainsToCategoriesResult[domain] = {
                        SubCategory: domainCategories[0],
                        Category: undefined,
                    };
                } else {
                    domainsToCategoriesResult[domain] = {
                        Category: domainCategories[0],
                        SubCategory: `${domainCategories[0]}~${domainCategories[1]}`,
                    };
                }
            }
        });
        Object.keys(domainsToCategoriesResult).map((domain) => {
            if (domainsToCategoriesResult[domain]?.Category) {
                if (categoriesToDomainsResult[domainsToCategoriesResult[domain].Category]) {
                    categoriesToDomainsResult[domainsToCategoriesResult[domain].Category].push(
                        domain,
                    );
                } else {
                    categoriesToDomainsResult[domainsToCategoriesResult[domain].Category] = [
                        domain,
                    ];
                }
            }
            if (domainsToCategoriesResult[domain]?.SubCategory) {
                if (categoriesToDomainsResult[domainsToCategoriesResult[domain].SubCategory]) {
                    categoriesToDomainsResult[domainsToCategoriesResult[domain].SubCategory].push(
                        domain,
                    );
                } else {
                    categoriesToDomainsResult[domainsToCategoriesResult[domain].SubCategory] = [
                        domain,
                    ];
                }
            }
        });
        setDomainsCategoriesAndSubCaMap(domainsToCategoriesResult);
        setCategoriesAndSubCatToDomainsMap(categoriesToDomainsResult);
        return { categoriesToDomainsResult, domainsToCategoriesResult };
    };

    useEffect(() => {
        if (!isLoading) {
            setLoyaltyColumnChartData(
                prepareBarChartData({
                    domains,
                    sitesData: loyaltySitesResponse,
                    categoriesData: loyaltyCategoriesResult,
                    selectedCategory,
                }),
            );
        }
    }, [uncheckedSitesAndCat, selectedCategory, domains]);

    useEffect(() => {
        if (!props.isSingleMode || domains.length > 0) {
            (async () => {
                setIsLoading(true);
                const params: any = services.swNavigator.getParams();
                const apiParams: any = services.swNavigator.getApiParams(params);

                try {
                    const loyaltySitesResponse = await services.loyaltyApiService.getDomainsLoyalty(
                        {
                            apiParams,
                            ...(props.isSingleMode
                                ? {
                                      keys: domains.toString(),
                                  }
                                : null),
                        },
                    );
                    // get and set categories and sub categories from domains response
                    const {
                        categoriesToDomainsResult,
                        domainsToCategoriesResult,
                    } = setDomainsCategoriesAndSubCategoriesMapsFromResponse(
                        domains,
                        loyaltySitesResponse,
                    );
                    // set by default the pivot domain subcategory , or category
                    const defaultSelectedCategory = DEFAULT_CATEGORY;
                    const { country, key } = services.swNavigator.getParams();
                    const pivotDomain = key.split(",")?.[0];
                    // Now that audience overlap can be calculated for WW this part is not relevant
                    // if (country === "999" && pivotDomain) {
                    //     defaultSelectedCategory =
                    //         domainsToCategoriesResult[pivotDomain].Category ||
                    //         domainsToCategoriesResult[pivotDomain].SubCategory;
                    //     setSelectedCategory({
                    //         name: defaultSelectedCategory,
                    //         isSubcategory: defaultSelectedCategory.indexOf("~") !== -1,
                    //     });
                    // }
                    let loyaltyCategoriesResult;
                    if (!_.isEmpty(categoriesToDomainsResult)) {
                        try {
                            loyaltyCategoriesResult = await services.loyaltyApiService.getCategoryLoyalty(
                                {
                                    ...apiParams,
                                    keys: Object.keys(categoriesToDomainsResult),
                                },
                            );
                        } catch (e) {
                            loyaltyCategoriesResult = undefined;
                        }
                        setLoyaltySitesResponse(loyaltySitesResponse);
                        setLoyaltyCategoriesResult(loyaltyCategoriesResult);
                        setLoyaltyColumnChartData(
                            prepareBarChartData({
                                domains,
                                sitesData: loyaltySitesResponse,
                                categoriesData: loyaltyCategoriesResult,
                                selectedCategory: {
                                    name: defaultSelectedCategory,
                                    isSubcategory: defaultSelectedCategory.indexOf("~") !== -1,
                                },
                            }),
                        );
                    }
                    // setGraphData(transformData(loyaltyResponse));
                } catch {
                    setLoyaltySitesResponse(undefined);
                } finally {
                    setIsLoading(false);
                }
            })();
        }
    }, [props.websitesArrayWithColor, props.isSingleMode, domains]);

    const selectCategory = (item) => {
        setSelectedCategory({ name: item.id, isSubcategory: !!item.parentItem });
        services.swNavigator.updateQueryParams({ category: item.id }, { reload: false }, undefined);
    };

    const onCategoryDropToggle = (isOpen, filter) => {
        TrackWithGuidService.trackWithGuid("audience.loyalty.dropdown.toggle", "click");
    };

    const categoryButtonComponent = (props) => {
        return useMemo(() => {
            return (
                <StyledNoBorderButton
                    className={"LoyaltyDropButton"}
                    key="item0"
                    isPlaceholder={false}
                    {...props}
                >
                    {formatCategoryName(selectedCategory.name)}
                </StyledNoBorderButton>
            );
        }, []);
    };

    const excelUrl: string = useMemo(() => {
        const params = services.swNavigator.getParams();
        const { key } = params;
        const apiParams = services.swNavigator.getApiParams(params);
        const excelFileName = `AudienceLoyalty - ${key} - (${apiParams.from}) - (${apiParams.to}) `;

        return services.loyaltyApiService.getDomainsAudienceLoyaltyGraphExcelUrl({
            ...apiParams,
            includeSubDomains: true,
            keys: key,
            webSource: "Desktop",
            timeGranularity: "Monthly",
            FileName: excelFileName,
        } as any);
    }, []);

    const chartRef = React.useRef<HTMLElement>();

    const getPNG = React.useCallback(() => {
        TrackWithGuidService.trackWithGuid(
            "website.analysis.audience.loyalty.graph.download.png",
            "submit-ok",
            {
                type: "PNG",
            },
        );

        const offSetX = 0;
        const offSetY = 50;
        const styleHTML = Array.from(document.querySelectorAll("style"))
            .map((stylesheet) => stylesheet.outerHTML)
            .join("");
        PdfExportService.downloadHtmlPngFedService(
            styleHTML + chartRef.current.outerHTML,
            "AudienceLoyalty",
            chartRef.current.offsetWidth + offSetX,
            chartRef.current.offsetHeight + offSetY,
        );
    }, []);

    const onExcelClick = () => {
        TrackWithGuidService.trackWithGuid(
            "website.analysis.audiance.loyalty.excel.download",
            "submit-ok",
            { type: "Excel" },
        );
    };

    const getUtilityButtons = () => {
        return (
            <ButtonsContainer>
                {excelUrl && selectedCategory.name !== DEFAULT_CATEGORY && (
                    <a href={excelUrl}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelUrl}
                            exportFunction={onExcelClick}
                        />
                    </a>
                )}
                <DownloadButtonMenu PNG={true} exportFunction={getPNG} />
            </ButtonsContainer>
        );
    };

    const comparisonDropdownItemObj = {
        availableCategories: {
            children: [],
            cssClass: "parent-category",
            icon: "sprite-category",
            id: DEFAULT_CATEGORY,
            inactive: false,
            isChild: false,
            name: DEFAULT_CATEGORY,
            sons: {},
            text: DEFAULT_CATEGORY,
        },
    };

    const availableCategories = useMemo(() => {
        if (!isLoading) {
            const availableCategoriesWithComparison = services.categoryService
                .getFlattenedCategoriesList()
                .filter((value) => categoriesAndSubCatToDomainsMap?.[value.id]);
            availableCategoriesWithComparison.unshift(
                comparisonDropdownItemObj.availableCategories as IFlattenedCategory,
            );
            return availableCategoriesWithComparison;
        }
        return [];
    }, [categoriesAndSubCatToDomainsMap, isLoading]);

    const renderCategoryDropdown = () => {
        return (
            <CategoryDropdown
                selectedCategoryId={selectedCategory.name}
                hasSearch={false}
                buttonWidth={"none"}
                cssClassContainer={"DropdownContent-container loyalty-content"}
                searchPlaceHolder={i18nFilter()("appcategory.filters.category.placeholder")}
                onSelect={selectCategory}
                categoryButtonComponent={(props) => categoryButtonComponent(props)}
                categories={availableCategories}
                onToggle={(isOpen) => onCategoryDropToggle(isOpen, "category_filter")}
            />
        );
    };

    return (
        <BoxContainer data-automation-sites-vs-category={true} ref={chartRef}>
            <TitleContainer>
                <FlexColumn>
                    <StyledHeaderTitle>
                        <TitleRow>
                            <Header>{i18nFilter()("audience.loyalty.graph.title")}</Header>
                            {!isLoading && categoriesAndSubCatToDomainsMap
                                ? renderCategoryDropdown()
                                : undefined}
                            <PlainTooltip
                                placement="top"
                                tooltipContent={i18nFilter()(
                                    "audience.loyalty.graph.title.tooltip",
                                )}
                            >
                                <span>
                                    <InfoIcon iconName="info" />
                                </span>
                            </PlainTooltip>
                        </TitleRow>
                        <StyledBoxSubtitle>
                            <BoxSubtitle filters={props.subtitleFilters} />
                        </StyledBoxSubtitle>
                    </StyledHeaderTitle>
                </FlexColumn>
                <RightFlexRow>{getUtilityButtons()}</RightFlexRow>
            </TitleContainer>
            <ContentContainer>
                {isLoading ||
                (selectedCategory.name == DEFAULT_CATEGORY && props.isLoadingComparisonData) ? (
                    <SitesChartLoaderContainer>
                        <GraphLoader width={"100%"} />
                    </SitesChartLoaderContainer>
                ) : (
                    <GraphContainer className={"sharedTooltip"}>
                        {loyaltyColumnChartData ||
                        (selectedCategory.name == DEFAULT_CATEGORY && props.comparisonData.data) ? (
                            <>
                                <UtilitiesContainer>
                                    {selectedCategory.name == DEFAULT_CATEGORY
                                        ? renderComparisonLegend
                                        : renderLegends()}
                                </UtilitiesContainer>
                                {renderColumnChart()}
                            </>
                        ) : (
                            <NoDataLandscape
                                title={"website.analysis.loyalty.no.data.title"}
                                subtitle={"website.analysis.loyalty.no.data.subtitle"}
                            />
                        )}
                    </GraphContainer>
                )}
            </ContentContainer>
        </BoxContainer>
    );
};

SWReactRootComponent(AudienceLoyalty, "AudienceLoyalty");

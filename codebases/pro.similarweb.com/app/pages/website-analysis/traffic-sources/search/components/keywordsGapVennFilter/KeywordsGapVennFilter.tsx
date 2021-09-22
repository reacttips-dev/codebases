import { getChartConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/chartConfig";
import { filtersConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/constants";
import { getFilterData } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/fetchData";
import { FiltersFooter } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/Footer";
import { KeywordsGapVennFilterLoader } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/Loader";
import { PredefinedFilters } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/PredefinedFilters";
import {
    ChartAndLegendsContainer,
    Container,
    LegendsContainer,
    ChartContainer,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/StyledComponents";
import { ETabsTypes } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/types";
import {
    apiResultsToHighChartsStructureParser,
    getOrganicPaidValues,
    getQueryParamsBasedOnIntersection,
    getQueryParamsBasedOnPredefinedFilters,
    getSelectedTabData,
    parseEnrichedFilterData,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/utilityFunctions";
import React from "react";
import Chart from "components/Chart/src/Chart";
import { Legends } from "components/React/Legends/Legends";
import { TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import { abbrNumberFilter, i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { chartTypes } from "UtilitiesAndConstants/Constants/ChartTypes";
import { Tab } from "@similarweb/ui-components/dist/tabs/src/..";
import { TabPanel } from "@similarweb/ui-components/dist/tabs/src/..";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { EFiltersTypes } from "UtilitiesAndConstants/Constants/keywordsIntersectionFiltersMD";

const KeywordsGapVennFilterInner = (props) => {
    const { chosenItems, filtersStateObject, swNavigator, tableData } = props;
    const { gapFilterSelectedTab } = filtersStateObject;
    const i18n = i18nFilter();
    const INITIAL_FILTER_DATE_STATE = { organic: undefined, paid: undefined, total: undefined };
    const [isLoading, setIsLoading] = React.useState(true);
    const [isError, setIsError] = React.useState(false);
    const [filterData, setFilterData] = React.useState(INITIAL_FILTER_DATE_STATE);
    const [filterEnrichedData, setFilterEnrichedData] = React.useState(INITIAL_FILTER_DATE_STATE);
    const [selectedTabIndex, setSelectedTabIndex] = React.useState(Number(gapFilterSelectedTab));
    const [siteLegends, setSiteLegends] = React.useState(
        chosenItems.map((chosenItem) => ({ ...chosenItem, hidden: false })),
    );
    const [selectedFilter, setSelectedFilter] = React.useState(undefined);
    const [selectedIntersectionSets, setSelectedIntersectionSets] = React.useState(String());
    const { organic: organicFilterData, paid: paidFilterData, total: totalFilterData } = filterData;
    const urlQueryParamToState = (chosenItems) => (filtersStateObject) => {
        const { predefinedFiler, selectedIntersection } = filtersStateObject;
        if (predefinedFiler) {
            const predefinedFilerNumber = Number(predefinedFiler);
            setSelectedFilter(predefinedFilerNumber);
            if (predefinedFilerNumber === EFiltersTypes.CORE_KEYWORDS) {
                const allSites = chosenItems.map(({ name }) => name).join();
                setSelectedIntersectionSets(allSites);
                return;
            }
            selectedIntersection && setSelectedIntersectionSets(selectedIntersection);
        }
    };
    const bootstrap = async () => {
        urlQueryParamToState(chosenItems)(filtersStateObject);
        !isLoading && setIsLoading(true);
        isError && setIsError(false);
        const dataPromise = getFilterData(filtersStateObject);
        try {
            const results = await dataPromise;
            setFilterData({ total: results[0], organic: results[1], paid: results[2] });
            setFilterEnrichedData({
                total: parseEnrichedFilterData(results[3]),
                organic: parseEnrichedFilterData(results[4]),
                paid: parseEnrichedFilterData(results[5]),
            });
        } catch {
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        bootstrap();
    }, []);
    const numbersFilter = abbrNumberFilter();

    const onTabSelected = (index) => {
        setSelectedTabIndex(index);
        const organicPaidValues = getOrganicPaidValues(index);
        TrackWithGuidService.trackWithGuid("website.keywords.table.gap.filters.tabs", "switch", {
            selectedTab: ETabsTypes[index],
        });
        swNavigator.applyUpdateParams({
            ...organicPaidValues,
            gapFilterSelectedTab: index,
            predefinedFiler: EFiltersTypes.ALL_KEYWORDS,
            selectedIntersection: undefined,
            limitsUsingAndOperator: undefined,
        });
    };

    const onLegendsToggleSeries = (legendsItem) => {
        const newSiteLegends = siteLegends.map((siteLegend) =>
            siteLegend.name === legendsItem.name
                ? { ...siteLegend, hidden: !legendsItem.hidden }
                : siteLegend,
        );
        setSiteLegends(newSiteLegends);
    };

    const onVennClickCallback = (event) => {
        const newSelectedIntersectionSets = event.point.sets;
        const newSelectedIntersectionString = newSelectedIntersectionSets.join();
        setSelectedIntersectionSets(newSelectedIntersectionString);
        const newSelectedFilter =
            newSelectedIntersectionSets.length === chosenItems.length
                ? EFiltersTypes.CORE_KEYWORDS
                : -1;
        const queryParamsBasedOnIntersection = getQueryParamsBasedOnIntersection(
            newSelectedIntersectionSets,
            chosenItems,
        );
        TrackWithGuidService.trackWithGuid("website.keywords.table.gap.filters.venn", "click");
        swNavigator.applyUpdateParams({
            ...queryParamsBasedOnIntersection,
            predefinedFiler: newSelectedFilter,
            selectedIntersection: newSelectedIntersectionString,
        });
    };

    const onPredefinedFilersClick = (id) => {
        setSelectedFilter(id);
        setSelectedIntersectionSets(undefined);
        const queryParamsBasedOnPredefinedFilters = getQueryParamsBasedOnPredefinedFilters(
            id,
            chosenItems,
        );
        TrackWithGuidService.trackWithGuid(
            "website.keywords.table.gap.filters.predefined",
            "switch",
            { selectedPredefinedFilter: EFiltersTypes[id] },
        );
        swNavigator.applyUpdateParams({
            ...queryParamsBasedOnPredefinedFilters,
            predefinedFiler: id,
            selectedIntersection: undefined,
        });
    };

    const chartData = React.useMemo(
        () =>
            !totalFilterData?.Header
                ? Object()
                : {
                      chartDataTotal: apiResultsToHighChartsStructureParser(
                          totalFilterData.Header?.venn,
                          siteLegends,
                          onVennClickCallback,
                          selectedIntersectionSets,
                          chosenItems,
                      ),
                      chartDataOrganic: apiResultsToHighChartsStructureParser(
                          organicFilterData.Header?.venn,
                          siteLegends,
                          onVennClickCallback,
                          selectedIntersectionSets,
                          chosenItems,
                      ),
                      chartDataPaid: apiResultsToHighChartsStructureParser(
                          paidFilterData.Header?.venn,
                          siteLegends,
                          onVennClickCallback,
                          selectedIntersectionSets,
                          chosenItems,
                      ),
                  },
        [siteLegends, filterData, selectedIntersectionSets],
    );

    const filters = React.useMemo(() => {
        const PredefinedFiltersProps = {
            selectedFilter,
            onPredefinedFilersClick,
            selectedTabIndex,
            filterData,
            chosenItems,
            filterEnrichedData,
            filtersConfig,
        };
        return isLoading || isError ? null : <PredefinedFilters {...PredefinedFiltersProps} />;
    }, [isLoading, selectedFilter, selectedTabIndex]);
    if (isLoading) {
        return <KeywordsGapVennFilterLoader selectedTabIndex={selectedTabIndex} />;
    }
    if (isError) {
        return null;
    }

    const { tabsHeadersKeys, tooltipKeys } = filtersConfig;
    const allowOrganicAndPaidTabs = filtersStateObject.webSource !== devicesTypes.MOBILE;
    return (
        <>
            <div>
                <Tabs selectedIndex={selectedTabIndex} onSelect={onTabSelected}>
                    <TabList>
                        <Tab>{`${i18n(tabsHeadersKeys.ALL_TRAFFIC)}`}</Tab>
                        <Tab
                            disabled={!allowOrganicAndPaidTabs}
                            tooltipText={
                                !allowOrganicAndPaidTabs && i18n(tooltipKeys.ORGANIC_TAB_DISABLED)
                            }
                        >{`${i18n(tabsHeadersKeys.ORGANIC)}`}</Tab>
                        <Tab
                            disabled={!allowOrganicAndPaidTabs}
                            tooltipText={
                                !allowOrganicAndPaidTabs && i18n(tooltipKeys.PAID_TAB_DISABLED)
                            }
                        >{`${i18n(tabsHeadersKeys.PAID)}`}</Tab>
                    </TabList>
                    <Container>
                        <ChartAndLegendsContainer>
                            <LegendsContainer>
                                <Legends
                                    legendItems={siteLegends}
                                    toggleSeries={onLegendsToggleSeries}
                                />
                            </LegendsContainer>
                            {Object.values(chartData).map((chartDataItem: any) => (
                                <TabPanel>
                                    <ChartContainer>
                                        <Chart
                                            type={chartTypes.VENN}
                                            data={chartDataItem}
                                            config={getChartConfig(chartDataItem)}
                                        />
                                    </ChartContainer>
                                </TabPanel>
                            ))}
                        </ChartAndLegendsContainer>
                        {filters}
                    </Container>
                </Tabs>
                <FiltersFooter
                    selectedIntersectionSets={selectedIntersectionSets}
                    selectedFilter={selectedFilter}
                    chosenItems={chosenItems}
                    vennData={getSelectedTabData(selectedTabIndex, filterData).Header.venn}
                    filterEnrichedData={getSelectedTabData(selectedTabIndex, filterEnrichedData)}
                />
            </div>
        </>
    );
};

const propsAreEqual = (prevProps, nextProps) => prevProps.chosenItems === nextProps.chosenItems;
export const KeywordsGapVennFilter = React.memo(KeywordsGapVennFilterInner, propsAreEqual);

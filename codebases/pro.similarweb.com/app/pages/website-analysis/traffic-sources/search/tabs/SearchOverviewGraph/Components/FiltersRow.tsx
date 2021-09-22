import {
    ChipDownContainer,
    EllipsisDropdownItem,
    IChipDownContainerProps,
} from "@similarweb/ui-components/dist/dropdown";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { SwitcherGranularityContainer } from "pages/website-analysis/components/SwitcherGranularityContainer";
import { TimeGranularitySwitcher } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/TimeGranularitySwitcher";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    allChannels,
    availableCategories,
    availableDataTypes,
    brandedNonBrandedCategory,
    brandedNonBrandedChannels,
    IChannel,
    legendsAndChannelsObjects,
    mobileSearchTrafficCategory,
    numbers,
    organicPaid,
    organicPaidCategory,
    organicPaidChannels,
    percents,
    searchTypeCategory,
    SearchTypesChannels,
    timeGranularityList,
} from "../Helpers/SearchOverviewGraphConfig";
import { searchOverviewContext } from "../SearchOverviewGraph";
import {
    ICategory,
    isCategoryAvailableForState,
    isDataTypeAvailableForState,
} from "../SearchOverviewGraphReducer";
import { GraphTypeSwitcher } from "components/React/GraphTypeSwitcher/GraphTypeSwitcher";
import {
    ButtonsContainer,
    ChipDownContainer as ChipDownWrapper,
    FiltersRowContainer,
    FiltersRowStyle,
    FiltersTitle,
} from "./StyledComponents";

interface IUseChannelsDropdown {
    category: ICategory;
    sourceConfig: IChannel[];

    getChipdownProps?(): Partial<IChipDownContainerProps>;
}

const ChannelsDropdown = ({ category, sourceConfig, getChipdownProps }: IUseChannelsDropdown) => {
    const {
        channel,
        category: selectedCategory,
        actions: { selectChannel, resetChannelAndCategory },
        selectedMetricTab,
    } = useContext(searchOverviewContext);
    const [[selectedItem], allTheRest] = useMemo(() => {
        return _.partition(sourceConfig, (item) => {
            return channel !== allChannels && category === selectedCategory && item.id === channel;
        });
    }, [channel, sourceConfig, selectedCategory, category]);
    const onClick = useCallback(
        ({ id, cat = category }) => {
            if (id === allChannels) {
                return resetChannelAndCategory();
            }
            if (category !== selectedCategory || id !== channel) {
                TrackWithGuidService.trackWithGuid(
                    "website_analysis.marketing_channels.search_overview.graph_tab.compare",
                    "click",
                    { metric: selectedMetricTab.name, category: category.id },
                );
                selectChannel({ channel: id, category: cat });
            }
        },
        [channel, category, selectedCategory],
    );

    const selectedText = selectedItem?.text;
    const buttonText = (selectedItem ?? sourceConfig[0])?.text;
    const userProps = getChipdownProps?.() ?? {};
    if (!userProps.disabled) {
        userProps.disabled = userProps.disabled || (channel !== allChannels && !selectedItem);
    }
    return (
        <ChipDownWrapper>
            <ChipDownContainer
                selectedIds={selectedItem ? { [selectedItem.id]: true } : {}}
                selectedText={i18nFilter()(selectedText)}
                onClick={onClick}
                onCloseItem={resetChannelAndCategory}
                buttonText={i18nFilter()(buttonText)}
                width={240}
                tooltipDisabled={true}
                {...userProps}
            >
                {allTheRest.map(({ id, text }) => (
                    <EllipsisDropdownItem key={id} id={id}>
                        {i18nFilter()(text)}
                    </EllipsisDropdownItem>
                ))}
            </ChipDownContainer>
        </ChipDownWrapper>
    );
};

const OrganicPaidDropdown = () => {
    const state = useContext(searchOverviewContext);
    const getChipdownProps = () => ({
        disabled: !isCategoryAvailableForState(state, organicPaidCategory),
    });
    return (
        <ChannelsDropdown
            category={organicPaidCategory}
            sourceConfig={organicPaidChannels}
            getChipdownProps={getChipdownProps}
        />
    );
};

const BrandedNonBrandedDropdown = () => {
    const state = useContext(searchOverviewContext);
    const getChipdownProps = () => ({
        disabled: !isCategoryAvailableForState(state, brandedNonBrandedCategory),
    });
    return (
        <ChannelsDropdown
            category={brandedNonBrandedCategory}
            sourceConfig={brandedNonBrandedChannels}
            getChipdownProps={getChipdownProps}
        />
    );
};

///////////////  Search Type ChipDown  ///////////////

const SearchTypesDropdown = () => {
    const state = useContext(searchOverviewContext);
    const { getData } = state;
    const [list, setList] = useState(SearchTypesChannels);
    const isAvailable = isCategoryAvailableForState(state, searchTypeCategory);
    useEffect(() => {
        if (isAvailable && list === SearchTypesChannels) {
            prepareSearchTypeList();
        }
    });

    async function prepareSearchTypeList() {
        const data = await getData(searchTypeCategory);
        const trafficShare = data?.Data?.["TrafficShare"];
        if (trafficShare) {
            const dynamicItems = Object.keys(trafficShare).reduce((all, item) => {
                if (item === allChannels) {
                    return all;
                }
                return [
                    ...all,
                    {
                        id: item,
                        text: legendsAndChannelsObjects[item].text,
                    },
                ];
            }, []);
            setList([...SearchTypesChannels, ...dynamicItems]);
        }
    }

    const getChipdownProps = () => ({ disabled: !isAvailable });
    return (
        <ChannelsDropdown
            category={searchTypeCategory}
            sourceConfig={list}
            getChipdownProps={getChipdownProps}
        />
    );
};

export const useAvailableCategories = () => {
    const state = useContext(searchOverviewContext);
    const isCategoryAvailable = isCategoryAvailableForState(state);
    return availableCategories
        .map((category) => ({
            ...category,
            disabled: !isCategoryAvailable(category),
        }))
        .filter(({ id, disabled }) => {
            if (state.isMobileWeb) {
                return !disabled;
            }
            return id !== mobileSearchTrafficCategory.id;
        });
};

const useAvailableDataTypes = () => {
    const state = useContext(searchOverviewContext);
    const isDataTypeAvailable = isDataTypeAvailableForState(state);
    return availableDataTypes
        .map((item) => ({
            ...item,
            disabled: !isDataTypeAvailable(item.value),
        }))
        .filter((item) => !item.disabled);
};

const CategoriesTabs = () => {
    const {
        category,
        selectedMetricTab,
        actions: { setCategory },
    } = useContext(searchOverviewContext);
    const availableCategories = useAvailableCategories();
    const selectedIndex = availableCategories.findIndex(({ id }) => category.id === id);
    const onItemClick = (index) => {
        const category = availableCategories[index];
        setCategory(category);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.search_overview.graph_tab.single",
            "click",
            { metric: selectedMetricTab.name, category: category.id },
        );
    };

    return (
        <SwitcherGranularityContainer
            key={selectedMetricTab.name}
            itemList={availableCategories}
            selectedIndex={selectedIndex}
            onItemClick={(index) => onItemClick(index)}
            customClass={"CircleSwitcher"}
        />
    );
};

const DataTypesSwitcher = () => {
    const {
        dataType,
        actions: { setDataType },
        category,
        selectedMetricTab,
    } = useContext(searchOverviewContext);
    const availableDataTypes = useAvailableDataTypes();
    const onGraphTypeSwitcherClick = (index) => {
        // percents
        const type = availableDataTypes[index].value;
        if (type === percents) {
            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.search_overview.graph_type.percentage",
                "click",
                { metric: selectedMetricTab.name, category: category.id },
            );
        }
        if (type === numbers) {
            TrackWithGuidService.trackWithGuid(
                "website_analysis.marketing_channels.search_overview.graph_type.numbers",
                "click",
                { metric: selectedMetricTab.name, category: category.id },
            );
        }

        const newDataType = { ...dataType };
        newDataType[selectedMetricTab.name][category.id] = type;
        setDataType(newDataType);
    };
    return (
        availableDataTypes.length > 1 && (
            <GraphTypeSwitcher
                onItemClick={(index) => onGraphTypeSwitcherClick(index)}
                selectedIndex={availableDataTypes.findIndex(
                    (item) => item.value === dataType[selectedMetricTab.name][category.id],
                )}
                buttonsList={availableDataTypes}
            />
        )
    );
};

const TimeGranularitySwitcherContainer = () => {
    const {
        actions: { setTimeGranularity },
        granularity,
        category,
    } = useContext(searchOverviewContext);
    const granularityUpdate = (granularityIndex) => {
        const newTimeGranularity = granularityIndexToGranularityObject(granularityIndex).name;
        setTimeGranularity(newTimeGranularity);
    };
    const granularityNameToGranularityObject = (granularityName) =>
        Object.values(timeGranularityList).find(({ name }) => name === granularityName);
    const granularityIndexToGranularityObject = (granularityIndex) =>
        Object.values(timeGranularityList).find(({ index }) => index === granularityIndex);

    const getTimeGranularity = () => {
        const timeGranularityOption = _.cloneDeep(timeGranularityList);
        if (category.id !== organicPaid) {
            timeGranularityOption.daily.disabled = true;
            timeGranularityOption.weekly.disabled = true;
            if (String(granularity) !== timeGranularityOption.monthly.name) {
                setTimeGranularity(timeGranularityOption.monthly.name);
            }
        }
        const timeGranularityArray = Object.values(timeGranularityOption);
        return timeGranularityArray;
    };
    return (
        <TimeGranularitySwitcher
            timeGranularity={granularityNameToGranularityObject(granularity)}
            granularityUpdate={granularityUpdate}
            getGranularity={getTimeGranularity}
        />
    );
};

export const FiltersRow = () => {
    const context = useContext(searchOverviewContext);
    const { emptyState, isSingle } = context;
    return (
        <FiltersRowContainer>
            <FiltersRowStyle data-automation="search-tab-graph-filters">
                <FiltersTitle>
                    {i18nFilter()("search.overview.graph.filters.row.title")}
                </FiltersTitle>
                {!isSingle && (
                    <>
                        <OrganicPaidDropdown />
                        <BrandedNonBrandedDropdown />
                        <SearchTypesDropdown />
                    </>
                )}
                {isSingle && <CategoriesTabs />}
            </FiltersRowStyle>
            {!emptyState && (
                <ButtonsContainer data-automation="search-tab-graph-butttons">
                    <DataTypesSwitcher />
                    <TimeGranularitySwitcherContainer />
                </ButtonsContainer>
            )}
        </FiltersRowContainer>
    );
};

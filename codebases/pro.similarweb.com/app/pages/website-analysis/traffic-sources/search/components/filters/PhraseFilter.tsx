import { Injector } from "common/ioc/Injector";
import {
    PhraseFilter as PhraseFilterInner,
    phraseFilterDataEndpoints,
} from "components/filtersPanel/src/PhraseFilter";
import {
    ButtonWithPill,
    getPhraseFilterData,
    IFilterData,
    onKeyDown,
} from "components/filtersPanel/src/PhraseFilterUtilities";
import { i18nFilter } from "filters/ngFilters";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import React from "react";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import DurationService from "services/DurationService";
import { dropdownPlacementTypes } from "UtilitiesAndConstants/Constants/dropdownTypes";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { useRankingDistributionTableTopContext } from "pages/website-analysis/traffic-sources/search/tabs/RankingDistribution/RankingDistributionContext";

const PHRASE_FILTER_WIDTH_SINGLE = 370;
const PHRASE_FILTER_WIDTH_COMPARE = 450;
const DROPDOWN_RESULTS_AMOUNT = 25;
const PHRASE_FILTER_DROPDOWN_CLASS = "Popup-content-phrases-filter";
const SEARCH_PLACEHOLDER_KEY = "keywords.table.filters.phrase.search.placeholder";
const BUTTON_PLACE_HOLDER_KEY = "keywords.table.filters.phrase.button.prefix";
const PHRASE_FILTER_DISABLED_DUE_TO_NO_DATA_TOOLTIP_KEY =
    "keywords.table.filters.phrases.disabled.due.to.no.data.tooltip";
// This is the representational component
const PhraseFilter = ({ chosenItems, isCompare, tableFilters, onPhraseChange }) => {
    const chipDownRef = React.useRef();
    const [filterData, setFilterData] = React.useState<IFilterData[]>(Array());
    const [isLoading, setIsLoading] = React.useState(true);
    const i18n = i18nFilter();
    const { duration, webSource, country, keys, selectedPhrase } = tableFilters;
    const { to, from, isWindow, isDaily } = DurationService.getDurationData(duration).forAPI;
    const isWeeklyData = !isWindow && isDaily;
    const filters = { from, to, webSource, country, key: keys, isWindow };
    const setData = async () => {
        try {
            const phraseFilterData = await getPhraseFilterData(phraseFilterDataEndpoints.DEFAULT)(
                filters,
            );
            setFilterData(phraseFilterData.slice(0, DROPDOWN_RESULTS_AMOUNT));
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (isWeeklyData) {
            setIsLoading(false);
            return;
        }
        setData();
    }, []);
    const closeChipDown = (chipDownRef) => () => chipDownRef.current?.closePopup();
    const phraseFilterWidth = isCompare ? PHRASE_FILTER_WIDTH_COMPARE : PHRASE_FILTER_WIDTH_SINGLE;
    const buttonPlaceholder = i18n(BUTTON_PLACE_HOLDER_KEY);
    const isDisabledDueNoData = !isLoading && filterData.length === 0;
    const isFilterDisabled = isLoading || isDisabledDueNoData;
    if (isDisabledDueNoData && selectedPhrase) {
        onPhraseChange(String());
        // setTimeout in order to prevent the "$digest already in progress" error
        // by moving the applyUpdateParams method execution to the end of the queue
        setTimeout(
            () => Injector.get("swNavigator").applyUpdateParams({ selectedPhrase: undefined }),
            0,
        );
    }
    return (
        <PlainTooltip
            enabled={isDisabledDueNoData}
            text={PHRASE_FILTER_DISABLED_DUE_TO_NO_DATA_TOOLTIP_KEY}
        >
            <div onKeyDown={onKeyDown(closeChipDown(chipDownRef))}>
                <Dropdown
                    disabled={isFilterDisabled}
                    cssClassContainer={PHRASE_FILTER_DROPDOWN_CLASS}
                    closeOnItemClick={false}
                    ref={chipDownRef}
                    width={phraseFilterWidth}
                    dropdownPopupPlacement={dropdownPlacementTypes.ON_TOP_LEFT}
                >
                    {[
                        <ButtonWithPill
                            disabled={isFilterDisabled}
                            placeholder={buttonPlaceholder}
                            selectedText={
                                selectedPhrase && `${buttonPlaceholder}: ${selectedPhrase}`
                            }
                            onCloseItem={() => {
                                onPhraseChange(String());
                            }}
                        />,
                        <PhraseFilterInner
                            chosenItems={chosenItems}
                            filterData={filterData}
                            searchPlaceholder={i18n(SEARCH_PLACEHOLDER_KEY)}
                            onClickCallback={({ searchTerm }) => {
                                onPhraseChange(searchTerm);
                                closeChipDown(chipDownRef)();
                            }}
                        />,
                    ]}
                </Dropdown>
            </div>
        </PlainTooltip>
    );
};

// This are the "connectors" that connect the certain context to the representational component
export const PhraseFilterForWebsiteKeywords = () => {
    const {
        chosenItems,
        isCompare,
        tableFilters,
        onPhraseChange,
    } = useWebsiteKeywordsPageTableTopContext();
    return (
        <PhraseFilter
            chosenItems={chosenItems}
            isCompare={isCompare}
            tableFilters={tableFilters}
            onPhraseChange={onPhraseChange}
        />
    );
};

export const PhraseFilterForRankingDistribution = () => {
    const {
        chosenItems,
        isCompare,
        tableFilters,
        onPhraseChange,
    } = useRankingDistributionTableTopContext();
    return (
        <PhraseFilter
            chosenItems={chosenItems}
            isCompare={isCompare}
            tableFilters={tableFilters}
            onPhraseChange={onPhraseChange}
        />
    );
};

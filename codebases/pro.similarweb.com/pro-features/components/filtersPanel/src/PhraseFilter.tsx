import {
    createTableHeader,
    filterBySearchValue,
    IPhraseFilterProps,
    ProgressBarSingle,
    SearchInputWrapper,
    shareFilter,
} from "components/filtersPanel/src/PhraseFilterUtilities";
import {
    PhraseFilterSingleHeader,
    Text,
    PhraseFilterContainer,
    PhraseFilterTableContentContainer,
    PhraseFilterCompareTableContentContainer,
    TrafficShareWithTooltipContainer,
    PhraseFilterSingleTableRowContainer,
    ProgressBarSingleContainer,
    PhraseFilterCompareHeader,
    PhraseFilterSingleTableRow,
    PhraseFilterCompareTableContent,
} from "components/filtersPanel/src/filterPanelStyled";
import { TrafficShareWithTooltip } from "components/TrafficShare/src/TrafficShareWithTooltip";
import { i18nFilter, smallNumbersPercentageFilter } from "filters/ngFilters";
import React from "react";
import { colorsPalettes } from "@similarweb/styles";

export const phraseFilterDataEndpoints = {
    DEFAULT: "api/keywordphrases/TopPhrases",
};

const TRAFFIC_SHARE_PROGRESS_BAR_TOOLTIP_DEFAULT_HEADER_KEY =
    "website.analysis.keywords.table.filters.phrases.progress.bar.tooltip.header";

const tableHeadersCompareDefaultKeys = {
    KEYWORD_PHRASE: "website.analysis.keywords.table.filters.phrases.header.keyword",
    TOTAL_SHARE: "website.analysis.keywords.table.filters.phrases.header.total.share",
    COMPETITIVE_TRAFFIC_SHARE: "website.analysis.keywords.table.filters.phrases.header.competitive",
};

const tableHeadersSingleDefaultKeys = {
    KEYWORD_PHRASE: "website.analysis.keywords.table.filters.phrases.header.keyword",
    TRAFFIC_SHARE: "website.analysis.keywords.table.filters.phrases.header.traffic.share",
};

const i18n = i18nFilter();

export const PhraseFilter: React.FunctionComponent<IPhraseFilterProps> = (props) => {
    const { chosenItems } = props;
    const isCompareMode = chosenItems.length > 1;
    return (
        <PhraseFilterContainer>
            {isCompareMode ? <PhraseFilterCompare {...props} /> : <PhraseFilterSingle {...props} />}
        </PhraseFilterContainer>
    );
};

PhraseFilter.defaultProps = {
    trafficShareProgressBarTooltipHeader: i18n(
        TRAFFIC_SHARE_PROGRESS_BAR_TOOLTIP_DEFAULT_HEADER_KEY,
    ),
    tableHeadersCompare: [
        i18n(tableHeadersCompareDefaultKeys.KEYWORD_PHRASE),
        i18n(tableHeadersCompareDefaultKeys.TOTAL_SHARE),
        i18n(tableHeadersCompareDefaultKeys.COMPETITIVE_TRAFFIC_SHARE),
    ],
    tableHeadersSingle: [
        i18n(tableHeadersSingleDefaultKeys.KEYWORD_PHRASE),
        i18n(tableHeadersSingleDefaultKeys.TRAFFIC_SHARE),
    ],
};

const createTableRowCompare = (
    onClickCallback,
    chosenItemsColors,
    trafficShareProgressBarTooltipHeader,
) => (item, index) => {
    const { searchTerm, share, siteOrigins, hideData } = item;
    const onClick = () => onClickCallback(item);
    const shareValuePercents = shareFilter(share);
    const PERCENTAGE_FILTER_SIGN = "%";
    const PERCENTAGE_FILTER_FRACTION_LENGTH = 2;
    const trafficDistribution = Object.keys(siteOrigins).map((site) => {
        const trafficShareValue = siteOrigins[site];
        const fixedTrafficShareValue = (trafficShareValue * 100).toFixed();
        return {
            name: site,
            width: trafficShareValue,
            text: fixedTrafficShareValue + PERCENTAGE_FILTER_SIGN,
            tooltipText: smallNumbersPercentageFilter()(
                trafficShareValue,
                PERCENTAGE_FILTER_FRACTION_LENGTH,
            ),
            color: colorsPalettes.carbon[0],
            backgroundColor: chosenItemsColors[site],
        };
    });
    const TRAFFIC_SHARE_CLASS_NAME = "traffic-share-progress-bar";
    const DEFAULT_FONT_SIZE = 14;
    return (
        <PhraseFilterCompareTableContentContainer key={index} onClick={onClick}>
            <PhraseFilterCompareTableContent>
                <Text
                    fontSize={DEFAULT_FONT_SIZE}
                    fontWeight={item.fontWeight && item.fontWeight}
                    fontStyle={item.fontStyle && item.fontStyle}
                >
                    {searchTerm}
                </Text>
                <Text fontSize={DEFAULT_FONT_SIZE} hideData={hideData}>
                    {shareValuePercents}
                </Text>
                <TrafficShareWithTooltipContainer hideData={hideData}>
                    <TrafficShareWithTooltip
                        data={trafficDistribution}
                        title={trafficShareProgressBarTooltipHeader}
                        trafficShareClassName={TRAFFIC_SHARE_CLASS_NAME}
                    />
                </TrafficShareWithTooltipContainer>
            </PhraseFilterCompareTableContent>
        </PhraseFilterCompareTableContentContainer>
    );
};

const PhraseFilterCompare: React.FunctionComponent<IPhraseFilterProps> = (props) => {
    const {
        filterData,
        onClickCallback,
        chosenItems,
        searchPlaceholder,
        trafficShareProgressBarTooltipHeader,
        tableHeadersCompare,
    } = props;
    const chosenItemsColors = chosenItems.reduce(
        (tempObject, { name, color }) => ({ [name]: color, ...tempObject }),
        {},
    );
    const [searchInputValue, setSearchInputValue] = React.useState(String());

    const handleSearchInputValueChange = (value = "") => {
        setSearchInputValue(value.toLowerCase());
    };

    return (
        <>
            <SearchInputWrapper
                onChange={handleSearchInputValueChange}
                searchPlaceholder={searchPlaceholder}
            />
            <PhraseFilterCompareHeader>
                {tableHeadersCompare.map(createTableHeader)}
            </PhraseFilterCompareHeader>
            <PhraseFilterTableContentContainer>
                {filterData
                    .filter(filterBySearchValue(searchInputValue))
                    .map(
                        createTableRowCompare(
                            onClickCallback,
                            chosenItemsColors,
                            trafficShareProgressBarTooltipHeader,
                        ),
                    )}
            </PhraseFilterTableContentContainer>
        </>
    );
};

const createTableRowSingle = (onClickCallback) => (item, index) => {
    const { searchTerm, share, hideData } = item;
    const onClick = () => onClickCallback(item);
    return (
        <PhraseFilterSingleTableRowContainer key={index} onClick={onClick}>
            <PhraseFilterSingleTableRow>
                <Text
                    fontSize={14}
                    fontWeight={item.fontWeight && item.fontWeight}
                    fontStyle={item.fontStyle && item.fontStyle}
                >
                    {searchTerm}
                </Text>
                <ProgressBarSingleContainer>
                    <ProgressBarSingle share={share} hideData={hideData} />
                </ProgressBarSingleContainer>
            </PhraseFilterSingleTableRow>
        </PhraseFilterSingleTableRowContainer>
    );
};

const PhraseFilterSingle: React.FunctionComponent<IPhraseFilterProps> = (props) => {
    const { filterData, onClickCallback, searchPlaceholder, tableHeadersSingle } = props;
    const [searchInputValue, setSearchInputValue] = React.useState(String());

    const handleSearchInputValueChange = (value = "") => {
        setSearchInputValue(value.toLowerCase());
    };

    return (
        <>
            <SearchInputWrapper
                onChange={handleSearchInputValueChange}
                searchPlaceholder={searchPlaceholder}
            />
            <PhraseFilterSingleHeader>
                {tableHeadersSingle.map(createTableHeader)}
            </PhraseFilterSingleHeader>
            <PhraseFilterTableContentContainer>
                {filterData
                    // if the user search for something we don't show the any option
                    .filter((term) => {
                        if (searchInputValue) {
                            return term.searchTerm !== "Any topic";
                        } else return term;
                    })
                    .filter(filterBySearchValue(searchInputValue))
                    .map(createTableRowSingle(onClickCallback))}
            </PhraseFilterTableContentContainer>
        </>
    );
};

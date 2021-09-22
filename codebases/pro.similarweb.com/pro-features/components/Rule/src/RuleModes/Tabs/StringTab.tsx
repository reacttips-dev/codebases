import {
    BooleanSearchWrapStyled,
    ChipPlaceholderLoaderWrapper,
    GradientWhiteTransparentCover,
    LoadersWrapper,
    NoDataContainer,
    BooleanSearchContainer,
    TabInnerContentContainer,
    TextAlign,
    DEFAULT_CHIPS_CONTAINER_HEIGHT,
} from "../EditRule/EditRuleModeStyles";
import { ChipContainer } from "@similarweb/ui-components/dist/chip";
import { ButtonPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { SWReactIcons } from "@similarweb/icons";
import noop from "lodash/noop";
import { WordsOnlyToggle } from "../EditRule/EditRuleComponents/WordsOnlyToggle";
import React, { FunctionComponent, useState } from "react";
import { connect } from "react-redux";
import { BooleanSearchInputWrap, Input } from "@similarweb/ui-components/dist/boolean-search";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { ChipWrapper } from "components/Rule/src/styledComponents";
import { AddStringChip } from "components/Rule/src/RuleModes/EditRule/EditRuleComponents/AddStringChip";
import { i18nFilter } from "filters/ngFilters";
import { RuleSelectedStringsRow } from "components/Rule/src/RuleModes/EditRule/EditRuleComponents/RuleSelectedStringsRow";

const BASE_SIZE_UNIT = 8;
const NUMBER_OF_LOADERS = 38;
const MAX_NUMBER_OF_SHOWN_CHIPS = 200;

const generatePlaceholderLoaders = (num: number) => {
    const loaders = [];
    for (let i = 0; i <= num; i++) {
        loaders.push(
            <ChipPlaceholderLoaderWrapper key={i} style={{ width: generateRandomSize(5) }}>
                <ButtonPlaceholderLoader />
            </ChipPlaceholderLoaderWrapper>,
        );
    }

    return loaders;
};

const generateChips = (
    chipsString: string[],
    alreadyChosenStrings: string[],
    ruleIndex: number,
    onAddWords: (words: string[]) => void,
    isMidTierUser: boolean,
) => {
    return chipsString
        .filter((elm) => !alreadyChosenStrings.includes(elm))
        .slice(0, MAX_NUMBER_OF_SHOWN_CHIPS)
        .map((elm) => ({
            text: elm,
            key: `seg-chip-${ruleIndex}-${elm.split(" ").join("-")}`,
            onCloseItem: isMidTierUser ? noop : onAddWords.bind(null, [elm], false),
            displayTooltipForTextLongerThan: -1,
        }));
};

const generateRandomSize = (max, baseSizeUnit = BASE_SIZE_UNIT) => {
    const minWidth = 7 * baseSizeUnit;
    return baseSizeUnit * Math.floor(Math.random() * Math.floor(max)) + minWidth;
};

function filterWords(filter, words) {
    filter = filter.toLowerCase();
    return filter.trim().length > 0
        ? words.filter((word) => word.toLowerCase().includes(filter))
        : words;
}

const StringTab: FunctionComponent<any> = ({
    searchInputPlaceholderText,
    shouldFetchWordsOnly,
    onWordsOnlyToggle,
    rule,
    index,
    isLoadingData,
    onAddItems,
    onRemoveItems,
    wordPredictions,
    isMidTierUser,
}) => {
    const [searchWordsFilter, setSearchWordsFilter] = useState<string>("");

    const services = React.useMemo(
        () => ({
            i18n: i18nFilter(),
        }),
        [],
    );

    const wordPredictionsStrings = wordPredictions?.Data ?? [];

    const onRemoveStrings = React.useCallback(onRemoveItems.bind(null, "words"), [onRemoveItems]);

    const onSearchChange = React.useCallback(
        (evt) => {
            setSearchWordsFilter(evt.target.value);
        },
        [setSearchWordsFilter],
    );

    const onAddWords = React.useCallback((words: string[]) => onAddItems({ words }), [onAddItems]);

    let filteredWords = filterWords(searchWordsFilter, wordPredictionsStrings);
    const chips = React.useMemo(() => {
        if (isLoadingData) {
            return <LoadersWrapper>{generatePlaceholderLoaders(NUMBER_OF_LOADERS)}</LoadersWrapper>;
        }
        filteredWords = filterWords(searchWordsFilter, wordPredictionsStrings);
        return (
            <ChipWrapper>
                <ChipContainer itemsComponent={AddStringChip}>
                    {generateChips(filteredWords, rule.words, index, onAddWords, isMidTierUser)}
                </ChipContainer>
            </ChipWrapper>
        );
    }, [isLoadingData, wordPredictionsStrings, searchWordsFilter, rule.words, index, onAddWords]);

    const renderNoSearchData = () => {
        return (
            <NoDataContainer>
                <TextAlign>
                    {services.i18n("segmentWizard.editRule.string.no.results.part1")}
                </TextAlign>
                <TextAlign>
                    {services.i18n("segmentWizard.editRule.string.no.results.part2")}
                </TextAlign>
            </NoDataContainer>
        );
    };

    return (
        <TabInnerContentContainer>
            <BooleanSearchContainer>
                <BooleanSearchWrapStyled>
                    <SWReactIcons size="sm" iconName={"search"} />
                    <BooleanSearchInputWrap>
                        <Input
                            value={searchWordsFilter}
                            onKeyUp={noop}
                            onChange={isMidTierUser ? noop : onSearchChange}
                            placeholder={searchInputPlaceholderText}
                            autoFocus={!isMidTierUser}
                        />
                    </BooleanSearchInputWrap>
                </BooleanSearchWrapStyled>
                <WordsOnlyToggle isActive={shouldFetchWordsOnly} onToggle={onWordsOnlyToggle} />
            </BooleanSearchContainer>
            {searchWordsFilter && filteredWords.length === 0 ? (
                renderNoSearchData()
            ) : (
                <ScrollArea
                    style={{ height: DEFAULT_CHIPS_CONTAINER_HEIGHT, zIndex: 99 }}
                    verticalScrollbarStyle={{ borderRadius: 5 }}
                >
                    {chips}
                </ScrollArea>
            )}
            {rule.words.length > 0 && (
                <RuleSelectedStringsRow
                    stringsList={rule.words}
                    title={services.i18n("segmentWizard.editRule.string.row.title")}
                    onRemoveStrings={onRemoveStrings}
                />
            )}
            {isMidTierUser && <GradientWhiteTransparentCover />}
        </TabInnerContentContainer>
    );
};

function mapStateToProps({ segmentsWizardModule: { wordPredictionsLoading, wordPredictions } }) {
    return {
        wordPredictionsLoading,
        wordPredictions,
    };
}

export default connect(mapStateToProps)(StringTab);

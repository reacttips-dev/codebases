import { BooleanSearch } from "@similarweb/ui-components/dist/boolean-search";
import { IBooleanSearchChipItem } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { usePrevious } from "Arena/components/ArenaVisits/ArenaVisitsContainer";
import { ColumnsPickerLitePro } from "components/ColumnsPickerLitePro/ColumnsPickerLitePro";
import { numberFilter, i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import {
    booleanSearchApiParamsToChips,
    booleanSearchChipsObjectToApiParams,
} from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import * as React from "react";
import { FunctionComponent, useEffect } from "react";
import { CircularLoader } from "components/React/CircularLoader";
import { IOssTableSelectedWordCount } from "../ConversionSegmentOSSTypes";
import { IConversionSegmentOSSTableTopProps } from "./ConversionSegmentOSSTableTopTypes";
import {
    FiltersWrap,
    StyledLabel,
    circularLoaderOptions,
    InnerWrapper,
    ResultCountWapper,
    ChipWrap,
    TopTableFiltersBarContainer,
    StyledBooleanSearchWrapper,
} from "./ConversionSegmentOSSTableTopStyles";

export const ConversionSegmentOSSTableTop: FunctionComponent<IConversionSegmentOSSTableTopProps> = (
    props,
) => {
    const {
        onFilterChange,
        tableColumns,
        onClickToggleColumns,
        availableWordCount,
        isLoadingData,
        tableOptions,
        selectedFilters,
        selectedWordCount,
        updateSelectedFilters,
        updateSelectedWordCount,
    } = props;

    const previousFilters: any = usePrevious({ selectedFilters, selectedWordCount });

    const getSelectedFilters = () => {
        return {
            ...selectedFilters,
            wordCount: selectedWordCount ? selectedWordCount.value : undefined,
        };
    };

    useEffect(() => {
        if (
            !_.isEqual(previousFilters.selectedFilters, selectedFilters) ||
            !_.isEqual(previousFilters.selectedWordCount, selectedWordCount)
        ) {
            onFilterChange(getSelectedFilters());
        }
    }, [selectedFilters, selectedWordCount]);

    function getWordCountText(wordCount: IOssTableSelectedWordCount) {
        if (!wordCount.value) {
            return "conversion.segment.oss.word.count.no.filter";
        }
        return wordCount.value === 1
            ? "conversion.segment.oss.word.count.single.filter"
            : "conversion.segment.oss.word.count.multiple.filter";
    }

    const selectedText =
        !isLoadingData && selectedWordCount ? getWordCountText(selectedWordCount) : null;
    const onWordCountChange = ({ id }) => {
        if (id === "0") {
            updateSelectedWordCount(undefined);
        }

        const nextType = availableWordCount.find((x) => x.Value.toString() === id);
        updateSelectedWordCount({ resultCount: nextType?.ResultCount, value: nextType?.Value });
    };
    const onCloseType = () => {
        updateSelectedWordCount(undefined);
    };

    const onSearch = (chipsObject: IBooleanSearchChipItem[]) => {
        const { IncludeTerms, ExcludeTerms } = booleanSearchChipsObjectToApiParams(chipsObject);
        updateSelectedFilters({ includeTerms: IncludeTerms, excludeTerms: ExcludeTerms });
    };

    const renderWordCountFilter = () => {
        return (
            <FiltersWrap>
                <StyledLabel>
                    {i18nFilter()("conversion.segment.oss.table.top.filter.label")}
                </StyledLabel>
                {isLoadingData ? (
                    <CircularLoader options={circularLoaderOptions} />
                ) : (
                    <ChipWrap>
                        <ChipDownContainer
                            onClick={onWordCountChange}
                            selectedIds={
                                selectedWordCount?.value ? { [selectedWordCount.value]: true } : {}
                            }
                            selectedText={
                                selectedWordCount?.value
                                    ? `${selectedWordCount.value} ${i18nFilter()(selectedText)}`
                                    : undefined
                            }
                            onCloseItem={onCloseType}
                            buttonText={i18nFilter()(
                                getWordCountText({ value: 0, resultCount: undefined }),
                            )}
                            width={300}
                        >
                            {[
                                <EllipsisDropdownItem key={-1} id={"0"}>
                                    <InnerWrapper>
                                        <div>
                                            {i18nFilter()(
                                                getWordCountText({
                                                    value: 0,
                                                    resultCount: undefined,
                                                }),
                                            )}
                                        </div>
                                    </InnerWrapper>
                                </EllipsisDropdownItem>,
                            ].concat(
                                availableWordCount.map((wordCount) => {
                                    const label = i18nFilter()(
                                        getWordCountText({
                                            value: wordCount.Value,
                                            resultCount: wordCount.ResultCount,
                                        }),
                                    );
                                    const infoText = (
                                        <ResultCountWapper>
                                            ({numberFilter()(wordCount.ResultCount)})
                                        </ResultCountWapper>
                                    );
                                    return (
                                        <EllipsisDropdownItem
                                            infoText={infoText}
                                            key={wordCount.Value.toString()}
                                            id={wordCount.Value.toString()}
                                        >
                                            <InnerWrapper>
                                                <div>
                                                    {wordCount.Value} {label}
                                                </div>
                                            </InnerWrapper>
                                        </EllipsisDropdownItem>
                                    );
                                }),
                            )}
                        </ChipDownContainer>
                    </ChipWrap>
                )}
            </FiltersWrap>
        );
    };
    return (
        <TopTableFiltersBarContainer>
            {renderWordCountFilter()}
            <StyledBooleanSearchWrapper>
                <BooleanSearch
                    onChange={onSearch}
                    chips={booleanSearchApiParamsToChips({
                        IncludeTerms: selectedFilters?.includeTerms,
                        ExcludeTerms: selectedFilters?.excludeTerms,
                    })}
                />
                <span>
                    <ColumnsPickerLitePro
                        onClickToggleColumns={onClickToggleColumns}
                        tableOptions={tableOptions}
                        tableColumns={tableColumns}
                        withTooltip
                    />
                </span>
            </StyledBooleanSearchWrapper>
        </TopTableFiltersBarContainer>
    );
};

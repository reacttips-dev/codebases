import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    BooleanSearch,
    BooleanSearchInputWrap,
    BooleanSearchActionListStyled,
} from "@similarweb/ui-components/dist/boolean-search";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { AdvancedFilterButton } from "components/filtersPanel/src/filtersPanel";
import { KeywordsAdvancedFilterUtils } from "components/KeywordsAdvancedFilter/src/KeywordsAdvancedFilter";
import { Pill } from "components/Pill/Pill";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { i18nFilter } from "filters/ngFilters";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import React, { FunctionComponent } from "react";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
const PhrasesSearchContainer = styled(SearchContainer)`
    height: auto;
    align-items: flex-start;
`;
const BooleanSearchWrapper = styled.div`
    flex-grow: 1;
    padding-left: 25px;
    min-height: 42px;
    display: flex;
    ${BooleanSearchActionListStyled} {
        background-color: #fff;
        z-index: 1;
    }
    ${BooleanSearchInputWrap} {
        min-width: 235px;
    }
    .boolean-search {
        width: 100%;
        ${BooleanSearchActionListStyled} {
            top: 36px;
        }
    }
`;

const TopStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px;
`;
const TopStyledLeft = styled.div`
    display: flex;
    align-items: center;
`;
const ChipWrap = styled.div`
    padding-left: 8px;
`;
const StyledLabel = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 16 })};
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export const PhrasesTableTop: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const {
        downloadExcelPermitted,
        excelLink,
        onBrandedFilterChange: onBrandedFilterChangeProp,
        selectedBrandedFilter: selectedBrandedFilterProps,
        wordsCountItems,
        selectedWordsCountFilter: selectedWordsCountFilterProps,
        onWordsCountFilterChange: onWordsCountFilterChangeProp,
        onClearAll,
        isLoadingData,
        onChange,
        searchValue,
        tableColumns,
        onClickToggleColumns,
        selectedAdvancedFilter,
        chosenItems,
        onSingleCompetitorsClick,
        onCompareCompetitorsClick: onCompareCompetitorsClickProps,
        selectedCompetitiveFilter,
        onCloseCompetitiveFilter,
        openCompetitiveFilter,
        isCompare,
    } = props;
    const [mainSite, ...compareTo] = chosenItems;
    const brandedFilterItems = [
        { value: "total", label: i18n("traffic.search.phrases.page.branded.filter.all") },
        { value: "branded", label: i18n("traffic.search.phrases.page.branded.filter.branded") },
        {
            value: "nonBranded",
            label: i18n("traffic.search.phrases.page.branded.filter.nonbranded"),
        },
    ];
    const advancedFilters = KeywordAdvancedFilterService.getAllFilters();
    const selectedBrandedFilter = selectedBrandedFilterProps
        ? selectedBrandedFilterProps === "branded"
            ? brandedFilterItems[2]
            : brandedFilterItems[1]
        : brandedFilterItems[0];
    const selectedBrandedFilterText =
        selectedBrandedFilter !== brandedFilterItems[0] ? selectedBrandedFilter.label : null;
    const selectedWordsCountFilter =
        wordsCountItems.find((x) => x.value === selectedWordsCountFilterProps) ||
        wordsCountItems[0];
    const selectedWordsCountFilterText =
        selectedWordsCountFilter !== wordsCountItems[0] ? selectedWordsCountFilter.label : null;
    const selectedText = KeywordAdvancedFilterService.getAdvancedFilterSelectedText(
        chosenItems,
        selectedCompetitiveFilter.id,
        i18n,
    );
    const buttonText = KeywordsAdvancedFilterUtils.getButtonText(
        selectedCompetitiveFilter.id,
        i18n,
    );

    const onBrandedFilterChange = ({ id }) => {
        const nextTypeIndex = brandedFilterItems.findIndex((x) => x.value === id);
        onBrandedFilterChangeProp(nextTypeIndex !== 0 ? brandedFilterItems[nextTypeIndex] : -1);
    };
    const onCloseBrandedFilter = () => {
        onBrandedFilterChangeProp(-1);
    };
    const onWordsCountFilterChange = ({ id }) => {
        const nextTypeIndex = wordsCountItems.findIndex((x) => x.value === id);
        onWordsCountFilterChangeProp(nextTypeIndex !== 0 ? wordsCountItems[nextTypeIndex] : -1);
    };
    const onCloseWordsCountFilter = () => {
        onWordsCountFilterChangeProp(-1);
    };
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };
    const onColumnToggle = (key) => {
        onClickToggleColumns(parseInt(key, 10));
    };
    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = tableColumns.reduce((res, col, index) => {
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
            onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };
    const onCompareCompetitorsClick = (item) => {
        allTrackers.trackEvent(`Keyword phrases advanced filter/${item.id}`, "click", "drop down");
        onCompareCompetitorsClickProps(item);
    };
    return (
        <>
            <TopStyled>
                <TopStyledLeft>
                    <StyledLabel>{i18n("traffic.search.phrases.page.filterby.title")}</StyledLabel>
                    <ChipWrap>
                        <ChipDownContainer
                            onClick={onWordsCountFilterChange}
                            selectedIds={{ [selectedWordsCountFilter.value]: true }}
                            selectedText={selectedWordsCountFilterText ?? ""}
                            onCloseItem={onCloseWordsCountFilter}
                            buttonText={selectedWordsCountFilter.label}
                            width={200}
                            disabled={isLoadingData}
                        >
                            {wordsCountItems.map((wordCountItem, index) => {
                                const { value, label } = wordCountItem;
                                return (
                                    <EllipsisDropdownItem key={index} id={value} text={label}>
                                        {label}
                                    </EllipsisDropdownItem>
                                );
                            })}
                        </ChipDownContainer>
                    </ChipWrap>
                    <ChipWrap>
                        <ChipDownContainer
                            onClick={onBrandedFilterChange}
                            selectedIds={{ [selectedBrandedFilter.value]: true }}
                            selectedText={selectedBrandedFilterText ?? ""}
                            onCloseItem={onCloseBrandedFilter}
                            buttonText={selectedBrandedFilter.label}
                            width={200}
                        >
                            {brandedFilterItems.map((adType, index) => {
                                const { value, label } = adType;
                                return (
                                    <EllipsisDropdownItem key={index} id={value} text={label}>
                                        {label}
                                    </EllipsisDropdownItem>
                                );
                            })}
                        </ChipDownContainer>
                    </ChipWrap>
                    <ChipWrap>
                        {isCompare ? (
                            <ChipDownContainer
                                selectedText={selectedText ?? ""}
                                onClick={onCompareCompetitorsClick}
                                onCloseItem={onCloseCompetitiveFilter}
                                buttonText={buttonText}
                                width={305}
                                defaultOpen={openCompetitiveFilter}
                            >
                                {advancedFilters.map(({ name, tooltip, id }, index) => {
                                    return (
                                        <EllipsisDropdownItem
                                            key={`advanced-filter-item-${index}`}
                                            id={id}
                                            tooltipText={i18n(tooltip, { main_website: mainSite })}
                                            selected={id === selectedAdvancedFilter}
                                        >
                                            {i18n(name)}
                                        </EllipsisDropdownItem>
                                    );
                                })}
                            </ChipDownContainer>
                        ) : (
                            <PlainTooltip
                                tooltipContent={i18n(
                                    "analysis.source.search.keywords.filters.advanced.single.tooltip",
                                )}
                            >
                                <span onClick={onSingleCompetitorsClick}>
                                    <AdvancedFilterButton>
                                        {i18n(
                                            "analysis.source.search.keywords.filters.advanced.addcompetitor",
                                        )}
                                        <Pill text="NEW" />
                                    </AdvancedFilterButton>
                                </span>
                            </PlainTooltip>
                        )}
                    </ChipWrap>
                </TopStyledLeft>
                <Button type="flat" onClick={onClearAll}>
                    {i18n("forms.buttons.clearall.text")}
                </Button>
            </TopStyled>
            <PhrasesSearchContainer>
                <BooleanSearchWrapper>
                    <BooleanSearch onChange={onChange} chips={searchValue} />
                </BooleanSearchWrapper>
                <Right>
                    <FlexRow>
                        <DownloadExcelContainer {...excelLinkHref}>
                            <DownloadButtonMenu
                                Excel={true}
                                downloadUrl={excelDownloadUrl}
                                exportFunction={trackExcelDownload}
                                excelLocked={!downloadExcelPermitted}
                            />
                        </DownloadExcelContainer>
                        <div>
                            <ColumnsPickerLite {...getColumnsPickerLiteProps()} withTooltip />
                        </div>
                    </FlexRow>
                </Right>
            </PhrasesSearchContainer>
        </>
    );
};

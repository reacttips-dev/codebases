import swLog from "@similarweb/sw-log";
import { ButtonLabel } from "@similarweb/ui-components/dist/button";
import { ICountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { AutocompleteKeywordGroups } from "components/AutocompleteKeywords/AutocompleteKeywordsGroups";
import { ITrendsBarValue } from "components/TrendsBar/src/TrendsBar";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import SeedKWSuggestionWidget, {
    SuggestionWidgetNoData,
} from "pages/keyword-analysis/keyword-generator-tool/SeedKWSuggestionWidget";
import propTypes from "prop-types";
import React from "react";
import { FC, useEffect, useState } from "react";
import { DefaultFetchService } from "services/fetchService";
import { KeywordsGroupUtilities } from "UtilitiesAndConstants/UtilityFunctions/KeywordsGroupUtilities";
import { CountryFilter } from "../../../../../app/components/filters-bar/country-filter/CountryFilter";
import I18n from "../../../../components/WithTranslation/src/I18n";
import {
    ButtonContainer,
    Container,
    CountryContainer,
    Icon,
    InputContainer,
    SubTitle,
    SuggestionsArenaTitle,
    SuggestionsContainer,
    SuggestionsTitle,
    SuggestionsTitleContainer,
    Title,
    TitleContainer,
} from "./StyledComponent";

const NUMBER_OF_SUGGESTIONS = 14;

const dateFormat = (date) => dayjs(date).format("MMM, YYYY");

export interface IKWResearchToolWizardProps {
    // countries
    availableCountries: ICountryDropdownItem[];
    changeCountry: (itemId: number) => void;
    selectedCountryIds: object;

    // keywords
    selectedKeyword: string;
    isGroupContext: boolean;

    onRun: () => void;
    isButtonDisabled: boolean;
    onBlur?: (e) => void;
    fastEnterFunc?: (e: string) => void;
    onKeyUp?: (e: string) => void;
    onToggle?: (isOpen: boolean) => void;
    onChange?: (
        selectedKeyword: string,
        isFromSuggestionWidget: boolean,
        isGroupContext: boolean,
    ) => () => void;

    // seed-keyword suggestions
    suggestionWidgetParams?: { keys: string; arenaCountry: number; arenaTitle: string };
    isFromSuggestionWidget?: boolean;
    showSuggestionWidgets?: boolean;
}

export const KWResearchToolWizard: FC<IKWResearchToolWizardProps> = ({
    isButtonDisabled,
    onRun,
    availableCountries,
    changeCountry,
    selectedCountryIds,
    selectedKeyword,
    isGroupContext,
    onToggle,
    onChange: onChangeProp,
    showSuggestionWidgets,
    isFromSuggestionWidget,
    suggestionWidgetParams: { keys, arenaCountry, arenaTitle },
}) => {
    useEffect(() => {
        if (showSuggestionWidgets) {
            DefaultFetchService.getInstance()
                .get(`/api/suggestedphrases/GetSuggestedPhrases`, {
                    country: arenaCountry ? arenaCountry : 999,
                    key: keys,
                })
                .then((records: any) => {
                    if (records.length > 0) {
                        setSeedKWSuggestionList(
                            records.map((record) => ({
                                keyword: record.SearchTerm,
                                volumeTrend: record.SharePerMonth,
                            })),
                        );
                    } else {
                        setHasData(false);
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    swLog.error(err);
                });
        }
    }, []);

    // initializing list with null so that the widgets will render (with a loader) even before data arrives.
    const [seedKWSuggestionList, setSeedKWSuggestionList] = useState(
        new Array(NUMBER_OF_SUGGESTIONS).fill(null),
    );
    const [isLoading, setIsLoading] = useState(true);
    const [hasData, setHasData] = useState(true);

    const onChange = (selectedKeyword) => () => {
        // remove selected keyword from the list so we don't render it again as a widget.
        setSeedKWSuggestionList(
            seedKWSuggestionList.filter(
                (SuggestionObj) => SuggestionObj.keyword !== selectedKeyword,
            ),
        );
        // add selected keyword to the input field.
        onChangeProp(selectedKeyword, true, isGroupContext)();
    };

    const buildSuggestionWidgets = () => {
        // ony build the number of widgets we wil render in the page at any given time (defined by NUMBER_OF_SUGGESTIONS).
        const truncatedData = seedKWSuggestionList.filter(
            (item, index) => index < NUMBER_OF_SUGGESTIONS,
        );
        // build the data for the volume trend bars.
        return truncatedData.map((dataItem, index) => {
            let data;
            if (dataItem && dataItem.volumeTrend) {
                data = dataItem.volumeTrend.map((item) => ({
                    value: item.Value === "NaN" ? 0 : (item.Value * 100).toFixed(1),
                    tooltip: (
                        <span>
                            <strong>{`${(item.Value * 100).toFixed(1)}`}</strong>
                            {`% traffic share for ${dateFormat(item.Key)}`}
                        </span>
                    ),
                })) as ITrendsBarValue[];
            }
            return (
                <SeedKWSuggestionWidget
                    key={dataItem ? dataItem.keyword : index}
                    value={data && data}
                    onClick={dataItem && dataItem.keyword && onChange(dataItem.keyword)}
                    name={dataItem?.keyword ? dataItem.keyword : ""}
                    isLoading={isLoading}
                />
            );
        });
    };

    const i18n = i18nFilter();

    return (
        <Container withHeight={showSuggestionWidgets}>
            <TitleContainer>
                <Icon iconName="wand" size="sm" />
                <Title>
                    <I18n>KWResearchTool.miniWizard.title</I18n>
                </Title>
            </TitleContainer>
            <SubTitle>
                <I18n>KWResearchTool.miniWizard.subtitle</I18n>
            </SubTitle>
            <InputContainer withMargin={!showSuggestionWidgets}>
                <AutocompleteKeywordGroups
                    autocompleteProps={{
                        placeholder: i18n("kwresearchtool.miniwizard.search"),
                    }}
                    selectedValue={
                        selectedKeyword?.startsWith("*")
                            ? KeywordsGroupUtilities.getGroupNameById(selectedKeyword.substring(1))
                            : selectedKeyword
                    }
                    onClick={(keywordsObj: any) => {
                        const isGroupContext = keywordsObj.hasOwnProperty("GroupHash");
                        onChangeProp(
                            isGroupContext ? keywordsObj.Name : keywordsObj.name,
                            isFromSuggestionWidget,
                            isGroupContext,
                        )();
                    }}
                />
                <CountryContainer>
                    <CountryFilter
                        onToggle={onToggle}
                        width={228}
                        height={40}
                        availableCountries={availableCountries}
                        changeCountry={changeCountry}
                        selectedCountryIds={selectedCountryIds}
                        dropdownPopupPlacement={"ontop-left"}
                        dropdownPopupWidth={243}
                    />
                </CountryContainer>
                <ButtonContainer
                    isDisabled={isButtonDisabled}
                    onClick={onRun}
                    width={102}
                    label={
                        <ButtonLabel>
                            <I18n>KWResearchTool.miniWizard.button</I18n>
                        </ButtonLabel>
                    }
                />
            </InputContainer>
            {showSuggestionWidgets && (
                <>
                    <SuggestionsTitleContainer>
                        <SuggestionsTitle>
                            <I18n>KWResearchTool.miniWizard.suggestions.title</I18n>&nbsp;
                            <SuggestionsArenaTitle>{arenaTitle}</SuggestionsArenaTitle>
                        </SuggestionsTitle>
                    </SuggestionsTitleContainer>
                    {hasData ? (
                        <SuggestionsContainer>{buildSuggestionWidgets()}</SuggestionsContainer>
                    ) : (
                        <SuggestionWidgetNoData
                            messageTop={
                                <I18n>KWResearchTool.miniWizard.suggestions.noData.title</I18n>
                            }
                            messageBottom={
                                <I18n>KWResearchTool.miniWizard.suggestions.noData.subtitle</I18n>
                            }
                        />
                    )}
                </>
            )}
        </Container>
    );
};

KWResearchToolWizard.displayName = "KWResearchToolWizard";
KWResearchToolWizard.contextTypes = {
    track: propTypes.func,
    translate: propTypes.func,
};

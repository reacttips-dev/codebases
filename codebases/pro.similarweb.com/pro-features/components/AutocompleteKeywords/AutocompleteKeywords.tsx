/* eslint-disable @typescript-eslint/no-empty-function */
import { getAutocompleteRecentKeywordSearches } from "components/AutocompleteKeywords/helpers/KeywordAutocompleteDataHandler";
import React, { FunctionComponent } from "react";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import styled from "styled-components";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ISite } from "components/Workspace/Wizard/src/types";
import { DefaultFetchService } from "services/fetchService";
import { ListItemKeyword } from "@similarweb/ui-components/dist/list-item";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item/src/items/ListItemSeparator";
import { i18nFilter } from "filters/ngFilters";
const fetchService = DefaultFetchService.getInstance();

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;

interface IAutocompleteKeywordsProps {
    children?: React.ReactNode;
    selectedValue: string;
    onClick: (selectedValue: string) => void;
    autocompleteProps: any;
    onValueChange?: (value: string) => void;
}

export const AutocompleteKeywords: FunctionComponent<IAutocompleteKeywordsProps> = ({
    selectedValue,
    autocompleteProps = {},
    onClick,
    onValueChange = () => {},
}) => {
    const i18n = i18nFilter();
    const getAutocompleteResults = async (query) => {
        return await fetchService.get<ISite[]>(
            `/autocomplete/keywords?size=9&term=${query}&webSource=Desktop&validate=true`,
        );
    };
    const onAutocompleteItemClick = (name) => () => {
        onClick(name);
    };
    const onAutocompleteGetData = async (query) => {
        onValueChange(query);
        if (query === "") {
            const distinctKeywordsRecentSearches = getAutocompleteRecentKeywordSearches();
            return distinctKeywordsRecentSearches.reduce(
                (results, { name }) => {
                    const item = (
                        <ListItemKeyword
                            iconName="search-keywords"
                            key={name}
                            text={name}
                            onClick={onAutocompleteItemClick(name)}
                        />
                    );
                    return [...results, item];
                },
                [
                    <ListItemSeparator key="AutocompleteKeywordsListItemSeparator">
                        {i18n("autocompleteKeywordsGroup.recentsTitle")}
                    </ListItemSeparator>,
                ],
            );
        } else {
            const results = await getAutocompleteResults(query);
            return results.map((item) => {
                const { name, image } = item;
                return (
                    <ListItemKeyword
                        iconName="search-keywords"
                        key={name}
                        text={name}
                        onClick={onAutocompleteItemClick(name)}
                    />
                );
            });
        }
    };
    const onKeyUp = (e) => {
        const { onKeyUp = () => null } = autocompleteProps;
        if (e.target.value === "") {
            onClick("");
        }
        onKeyUp(e);
    };

    return (
        <AutocompleteStyled
            getListItems={onAutocompleteGetData}
            loadingComponent={<DotsLoader />}
            floating={true}
            debounce={250}
            selectedValue={selectedValue}
            placeholder="Start typing here..."
            onKeyUp={onKeyUp}
            {...autocompleteProps}
        />
    );
};

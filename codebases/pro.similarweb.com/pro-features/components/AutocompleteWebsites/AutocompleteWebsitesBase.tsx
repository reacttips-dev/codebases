import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import React, { FunctionComponent, ReactNode } from "react";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import styled from "styled-components";
import { Autocomplete, ISite } from "@similarweb/ui-components/dist/autocomplete";
import {
    createWebsiteSearchResultItem,
    generateRecents,
    getWebsiteResults,
    getRecentsAnalysis,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item/src/items/ListItemSeparator";
import { i18nFilter } from "filters/ngFilters";

const translate = i18nFilter();
export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;
export const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;
const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

interface IAutocompleteWebsitesBaseProps {
    autocompleteProps?: any;
    defaultWebsitePageState: string;
    defaultWebsitePageStateParams?: any;
    renderOnEmptyQuery?: () => ReactNode;

    onItemClick?(domain: any): void;

    placeholder?: ReactNode;
    createWebsiteSearchResultItem?: (
        item: ISite,
        websitePageStateName: string,
        stateParams?: any,
        onItemClick?: (domain: string) => void,
    ) => ReactNode;
    autoCompleteRef?: React.Ref<any>;
    // exclude websites from the search results
    exclude?: string[];
}

const PlaceholderComponent = ({ text }) => <PlaceholderText>{text}</PlaceholderText>;

export const AutocompleteWebsitesBase: FunctionComponent<IAutocompleteWebsitesBaseProps> = ({
    autocompleteProps,
    defaultWebsitePageState,
    defaultWebsitePageStateParams,
    renderOnEmptyQuery,
    onItemClick,
    placeholder,
    createWebsiteSearchResultItem,
    autoCompleteRef,
    exclude,
}) => {
    const [isAutocompleteLoading, setAutocompleteLoading] = React.useState<boolean>(false);
    const onAutocompleteGetData = async (query: string) => {
        if (query === "") {
            return renderOnEmptyQuery();
        } else {
            setAutocompleteLoading(true);
            const results = await getWebsiteResults(query);
            setAutocompleteLoading(false);
            return results
                .filter(({ name }) => !exclude.includes(name))
                .map((item) => {
                    return createWebsiteSearchResultItem(
                        item,
                        defaultWebsitePageState,
                        defaultWebsitePageStateParams,
                        onItemClick,
                    );
                });
        }
    };

    return (
        <AutocompleteStyled
            ref={autoCompleteRef}
            placeholder={<PlaceholderComponent text={placeholder} />}
            loadingComponent={isAutocompleteLoading ? <DotsLoader /> : <i />}
            floating={true}
            debounce={250}
            getListItems={onAutocompleteGetData}
            isLoading={isAutocompleteLoading}
            maxResults={8}
            {...autocompleteProps}
        />
    );
};
AutocompleteWebsitesBase.defaultProps = {
    renderOnEmptyQuery: () => null,
    placeholder: (
        <>
            {translate("marketintelligence.companyresearch.websites.home.searchText")}{" "}
            <BoldPlaceholderText>
                {translate("marketintelligence.companyresearch.websites.home.searchItem")}
            </BoldPlaceholderText>
        </>
    ),
    createWebsiteSearchResultItem: createWebsiteSearchResultItem,
    exclude: [],
};

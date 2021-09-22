import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";

export interface IKeywordsAutocompleteProps {
    getListItems: (query: string) => Promise<JSX.Element[]>;
    selectedKeyword?: string;
    placeholder?: string;
    onBlur?: (e) => void;
    fastEnterFunc?: (e: string) => void;
    onKeyUp?: (e: string) => void;
}

export const KeywordsAutocompleteStateless: StatelessComponent<IKeywordsAutocompleteProps> = (
    { getListItems, selectedKeyword, onBlur, placeholder, fastEnterFunc, onKeyUp },
    { translate },
) => {
    const translatedPlaceholder = placeholder
        ? translate(placeholder)
        : translate("keyword.analysis.home.input.placeholder");
    return (
        <Autocomplete
            debounce={400}
            floating={true}
            selectedValue={selectedKeyword}
            placeholder={translatedPlaceholder}
            getListItems={getListItems}
            onBlur={onBlur}
            fastEnterFunc={fastEnterFunc}
            onKeyUp={onKeyUp}
            loadingComponent={<DotsLoader />}
        />
    );
};

KeywordsAutocompleteStateless.contextTypes = {
    translate: PropTypes.func,
};

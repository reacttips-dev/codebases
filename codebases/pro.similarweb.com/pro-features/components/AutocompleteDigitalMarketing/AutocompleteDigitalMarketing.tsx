import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { useRecents } from "custom-hooks/useRecentsHook";
import {
    PlaceholderText,
    BoldPlaceholderText,
    AutocompleteStyled,
    ScrollAreaWrap,
} from "components/AutocompleteDigitalMarketing/AutocompleteDigitalMarketingStyles";
import {
    generateAutocompleteSearchResultItems,
    generateAutocompleteRecentItems,
} from "./AutocompleteDigitalMarketingHelper";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";

interface IAutocompleteDigitalMarketingProps {
    /**
     * Used by the notouch homepages. Some homepages should/shouldn't include keywords data.
     */
    includeKeywordsData: boolean;
    maxCompareItemsToDisplay?: number;
    onAutocompleteOpen?: () => void;
    onAutocompleteClose?: () => void;
}

export const AutocompleteDigitalMarketing: React.FunctionComponent<IAutocompleteDigitalMarketingProps> = ({
    includeKeywordsData,
    maxCompareItemsToDisplay,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAutocompleteOpen = () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onAutocompleteClose = () => {},
}) => {
    const recentWebsites = useRecents("website", true);
    const recentKeywords = useRecents("keyword", true);
    const autocompleteRef = useRef(null);

    const handleBodyClick = (e) => {
        if (!findParentByClass(e.target, "AutocompleteDigitalMarketing")) {
            onAutocompleteClose();
            autocompleteRef.current.truncateResults(true);
        }
    };

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    const getAutocompleteData = async (query: string) => {
        const hasQuery = query && query.length > 0;
        return hasQuery
            ? await generateAutocompleteSearchResultItems(query, includeKeywordsData)
            : generateAutocompleteRecentItems(
                  recentWebsites,
                  includeKeywordsData ? recentKeywords : [],
                  maxCompareItemsToDisplay,
              );
    };

    const SearchPlaceholder = useMemo(() => {
        return includeKeywordsData ? (
            <PlaceholderText>
                Search for a <BoldPlaceholderText>website</BoldPlaceholderText> or{" "}
                <BoldPlaceholderText>keyword</BoldPlaceholderText>
            </PlaceholderText>
        ) : (
            <PlaceholderText>
                Search for a <BoldPlaceholderText>website</BoldPlaceholderText>
            </PlaceholderText>
        );
    }, [includeKeywordsData]);

    const renderAutocompleteItems = ({ selectedItemId, listItems }) => {
        return <ScrollAreaWrap>{listItems}</ScrollAreaWrap>;
    };

    return (
        <AutocompleteStyled
            className={"AutocompleteDigitalMarketing"}
            ref={autocompleteRef}
            placeholder={SearchPlaceholder}
            getListItems={getAutocompleteData}
            renderItems={renderAutocompleteItems}
            loadingComponent={<DotsLoader />}
            floating={true}
            debounce={250}
            preventTruncateUnlessForced={true}
            onFocus={onAutocompleteOpen}
        />
    );
};

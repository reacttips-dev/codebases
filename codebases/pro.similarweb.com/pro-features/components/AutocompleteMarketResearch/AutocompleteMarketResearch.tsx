import React, { useEffect, useMemo, useRef, useState } from "react";
import { i18nFilter } from "filters/ngFilters";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { getRecentsAnalysis } from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import {
    AutocompletePlaceholderText,
    AutocompleteStyled,
} from "components/AutocompleteMarketResearch/AutocompleteMarketResearchStyles";
import { AutoCompleteMarketResearchRenderItems } from "components/AutocompleteMarketResearch/AutoCompleteMarketResearchRenderItems";
import {
    getAutocompleteRecentItems,
    getAutocompleteSearchResultData,
} from "components/AutocompleteMarketResearch/AutocompleteMarketResearchHelper";
import { findParentByClass } from "@similarweb/ui-components/dist/utils/index";

export const AutocompleteMarketResearch: React.FunctionComponent = () => {
    const [recents, setRecents] = useState([]);
    const [isAutocompleteLoading, setIsAutocompleteLoading] = useState(false);
    const [isAutocompleteActive, setIsAutocompleteActive] = useState(false);
    const autocompleteRef = useRef(null);

    const handleBodyClick = (e) => {
        if (!findParentByClass(e.target, "AutocompleteWithTabs")) {
            autocompleteRef.current.truncateResults(true);
            setIsAutocompleteActive(false);
        }
    };

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
        };
    }, []);

    useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis(null, true);
            setRecents(recentItems);
        };

        setIsAutocompleteLoading(true);
        getRecents();
        setIsAutocompleteLoading(false);
    }, []);

    useEffect(() => {
        document.body.addEventListener("click", handleBodyClick, { capture: true });
        return () => {
            document.body.removeEventListener("click", handleBodyClick, { capture: true });
        };
    }, []);

    const SearchPlaceHolder = useMemo(() => {
        return (
            <AutocompletePlaceholderText>
                {services.translate("marketresearch.homepgae.autocomplete.placeholder")}
            </AutocompletePlaceholderText>
        );
    }, []);

    const getAutocompleteData = async (query: string) => {
        const hasQuery = query && query.length > 0;
        setIsAutocompleteActive(true);

        return hasQuery
            ? { showResents: false, items: await getAutocompleteSearchResultData(query), query }
            : { showResents: true, items: getAutocompleteRecentItems(recents), query };
    };

    return (
        <AutocompleteStyled
            className={`AutocompleteWithTabs ${isAutocompleteActive ? "autoCompleteActive" : ""}`}
            ref={autocompleteRef}
            placeholder={SearchPlaceHolder}
            getListItems={getAutocompleteData}
            renderItems={(props) => <AutoCompleteMarketResearchRenderItems {...props} />}
            loadingComponent={<DotsLoader />}
            isLoading={isAutocompleteLoading}
            floating={true}
            debounce={250}
            preventTruncateUnlessForced={true}
        />
    );
};

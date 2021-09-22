import React from "react";
import swLog from "@similarweb/sw-log";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { useTranslation } from "components/WithTranslation/src/I18n";
import RightSidebarContext from "../../contexts/RightSidebarContext";
import SimilarSitesPanelContext from "../../contexts/SimilarSitesPanelContext";
import SimilarSitesDropdown from "./SimilarSitesDropdown";
import {
    PANEL_CUSTOM_SITES_LIMIT,
    PANEL_SITES_PER_PROSPECT_LIMIT,
} from "../../constants/similar-sites";
import salesApiService from "pages/sales-intelligence/services/salesApiService";
import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import useSimilarSitesTrackingService from "../../hooks/useSimilarSitesTrackingService";
import { toAutocompleteWebsiteShape } from "components/AutocompleteWebsites/AutocompleteWebsitesCompareItem";

const SimilarSitesDropdownContainer = () => {
    const translate = useTranslation();
    const { website } = React.useContext(RightSidebarContext);
    const trackingService = useSimilarSitesTrackingService(website.domain);
    const { addWebsite, similarSites, selectedCountriesIds } = React.useContext(
        SimilarSitesPanelContext,
    );
    const [otherSimilarSites, setOtherSimilarSites] = React.useState<
        (number | { Domain: string; Favicon: string })[]
    >([autocompleteStates.LOADING]);
    /**
     * List of websites that will NOT be shown in search results
     */
    const excludeList = similarSites.reduce(
        (excludeList, website) => {
            return excludeList.concat({ name: website.domain });
        },
        [{ name: website.domain }],
    );
    /**
     * List of "other" similar sites.
     * Includes only those that are not present in given similarSites prop.
     */
    const filteredOtherSimilarSites = otherSimilarSites.filter((site) => {
        if (typeof site === "number") {
            return true;
        }

        const foundInSimilarSites = similarSites.find((website) => website.domain === site.Domain);

        return typeof foundInSimilarSites === "undefined";
    });

    React.useEffect(() => {
        const getOtherSimilarSites = async () => {
            try {
                const sites = await salesApiService.benchmarks.fetchSimilarWebsites(
                    website?.domain,
                    selectedCountriesIds,
                );

                setOtherSimilarSites(sites.map(toAutocompleteWebsiteShape));
            } catch (e) {
                swLog.error("SimilarSitesDropdownContainer.getOtherSimilarSites", e);
                setOtherSimilarSites([autocompleteStates.ERROR]);
            }
        };

        if (website?.domain) {
            void getOtherSimilarSites();
        }
    }, [website]);

    function renderButton(openDropdown: () => void) {
        const tooManyCustomWebsites =
            similarSites.filter((s) => s.added || !s.similarity).length >= PANEL_CUSTOM_SITES_LIMIT;
        const tooManyWebsitesForSingleCountry =
            selectedCountriesIds.length === 1 &&
            similarSites.length >= PANEL_SITES_PER_PROSPECT_LIMIT;
        const button = (
            <IconButton
                type="flat"
                iconSize="xs"
                iconName="add"
                onClick={() => {
                    trackingService.trackAddWebsiteClicked(similarSites.length);
                    openDropdown();
                }}
                isDisabled={tooManyCustomWebsites || tooManyWebsitesForSingleCountry}
                dataAutomation="si-similar-sites-panel-button-add-website"
            >
                {translate("si.sidebar.similar_sites.button.add")}
            </IconButton>
        );

        if (tooManyCustomWebsites || tooManyWebsitesForSingleCountry) {
            const tooltipTextKey = tooManyCustomWebsites
                ? "si.sidebar.similar_sites.dropdown.tooltip.custom_limit_text"
                : "si.sidebar.similar_sites.dropdown.tooltip.country_limit_text";

            return (
                <PlainTooltip placement="top" tooltipContent={translate(tooltipTextKey)}>
                    <div>{button}</div>
                </PlainTooltip>
            );
        }

        return button;
    }

    return (
        <SimilarSitesDropdown
            onSelect={addWebsite}
            domain={website.domain}
            excludeList={excludeList}
            renderButton={renderButton}
            otherSimilarSites={filteredOtherSimilarSites}
        />
    );
};

export default SimilarSitesDropdownContainer;

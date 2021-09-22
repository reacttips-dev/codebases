import { CpcFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/CpcFilter";
import { VolumeFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/VolumeFilter";
import {
    ClearAllButton,
    FilterItemChipdown,
    FiltersNewButtons,
    WebsiteKeywordsPageForFindKeywordsByCompetitorsFiltersContainer,
    FiltersNewFilters,
    FiltersNewFiltersRow,
    FiltersNewContent,
} from "pages/website-analysis/traffic-sources/search/components/filters/WebsiteKeywordsPageFiltersStyledComponents";
import React, { useEffect, useRef } from "react";
import I18n from "components/WithTranslation/src/I18n";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { BrandedNonBrandedFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/BrandedNonBrandedFilter";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";
import { SearchEnginesFilterForWebsiteKeywords } from "./filters/SearchEnginesFilter";
import { SearchTypesFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/SearchTypesFilter";
import { i18nFilter } from "filters/ngFilters";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container/src/PopupHoverContainer";

export const WebsiteKeywordsPageForFindKeywordsByCompetitorsFilters: React.FC = () => {
    const context = useWebsiteKeywordsPageTableTopContext();
    const {
        tableFilters: { webSource },
        applyEnabled,
        onApply,
        resetEnabled,
        onReset,
    } = context;
    const isDesktop = webSource === devicesTypes.DESKTOP;
    const tooltipRef = useRef<{ openPopup: VoidFunction; closePopup: VoidFunction }>(null);

    useEffect(() => {
        if (applyEnabled) {
            tooltipRef?.current?.openPopup();
        } else {
            tooltipRef?.current?.closePopup();
        }
    }, [applyEnabled]);

    return (
        <WebsiteKeywordsPageForFindKeywordsByCompetitorsFiltersContainer data-automation="search-keywords-filters">
            <FiltersNewContent>
                <FiltersNewFilters>
                    <FiltersNewFiltersRow>
                        <FilterItemChipdown>
                            <BrandedNonBrandedFilterForWebsiteKeywords />
                        </FilterItemChipdown>
                        {isDesktop && (
                            <FilterItemChipdown>
                                <SearchEnginesFilterForWebsiteKeywords />
                            </FilterItemChipdown>
                        )}
                        {isDesktop && (
                            <FilterItemChipdown>
                                <SearchTypesFilterForWebsiteKeywords />
                            </FilterItemChipdown>
                        )}
                        <FilterItemChipdown>
                            <VolumeFilterForWebsiteKeywords />
                        </FilterItemChipdown>
                        <FilterItemChipdown>
                            <CpcFilterForWebsiteKeywords />
                        </FilterItemChipdown>
                    </FiltersNewFiltersRow>
                </FiltersNewFilters>
                <FiltersNewButtons>
                    <PlainTooltip
                        tooltipContent={i18nFilter()(
                            "analysis.source.search.keywords.filters.button.apply.tooltip",
                        )}
                        ref={tooltipRef}
                    >
                        <div>
                            <Button
                                isDisabled={!applyEnabled}
                                type={buttonTypes.PRIMARY}
                                onClick={onApply}
                            >
                                <ButtonLabel>
                                    <I18n>analysis.source.search.keywords.filters.apply</I18n>
                                </ButtonLabel>
                            </Button>
                        </div>
                    </PlainTooltip>
                    <ClearAllButton
                        type={buttonTypes.FLAT}
                        onClick={onReset}
                        isDisabled={!resetEnabled}
                    >
                        <ButtonLabel>
                            <I18n>website.analysis.source.search.keywords.filters.clear_all</I18n>
                        </ButtonLabel>
                    </ClearAllButton>
                </FiltersNewButtons>
            </FiltersNewContent>
        </WebsiteKeywordsPageForFindKeywordsByCompetitorsFiltersContainer>
    );
};

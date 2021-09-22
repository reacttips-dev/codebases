import { CpcFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/CpcFilter";
import { VolumeFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/VolumeFilter";
import {
    ClearAllButton,
    FilterItemCheckbox,
    FilterItemChipdown,
    FiltersNewButtons,
    FiltersNewContainer,
    FiltersNewFilters,
    FiltersNewContent,
    FilterItemButton,
} from "pages/website-analysis/traffic-sources/search/components/filters/WebsiteKeywordsPageFiltersStyledComponents";
import { PhraseFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/PhraseFilter";
import React, { useEffect, useRef } from "react";
import I18n from "components/WithTranslation/src/I18n";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { OrganicPaidFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/OrganicPaidFilter";
import { BrandedNonBrandedFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/BrandedNonBrandedFilter";
import { useWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { buttonTypes } from "UtilitiesAndConstants/Constants/ButtonTypes";
import { SearchEnginesFilterForWebsiteKeywords } from "./filters/SearchEnginesFilter";
import { SearchTypesFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/SearchTypesFilter";
import {
    IncludeNewKeywordsFilter,
    IncludeQuestionKeywordsFilter,
    IncludeTrendingKeywordsFilter,
} from "pages/website-analysis/traffic-sources/search/components/filters/CheckboxFilter";
import { KeywordAdvancedFilterService } from "services/AdvancedFilterService/KeywordsAdvancedFilters";
import { KeywordsAdvancedFilter } from "components/KeywordsAdvancedFilter/src/KeywordsAdvancedFilter";
import { Pill } from "components/Pill/Pill";
import { AdvancedFilterButton } from "components/filtersPanel/src/filtersPanel";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SerpFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/SerpFilter";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

export const WebsiteKeywordsPageFilters: React.FC = () => {
    const context = useWebsiteKeywordsPageTableTopContext();
    const {
        tableFilters: { webSource },
        isLast28Days,
        applyEnabled,
        onApply,
        resetEnabled,
        onReset,
        onAdvancedFilterDone,
        onAdvancedFilterClose,
        onAdvancedFilterToggle,
        isCompare,
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

    // some state to see if filter chosen and wrap button with tooltip
    return (
        <FiltersNewContainer data-automation="search-keywords-filters">
            <FiltersNewContent>
                <FiltersNewFilters>
                    {isDesktop && (
                        <FilterItemChipdown>
                            <OrganicPaidFilterForWebsiteKeywords />
                        </FilterItemChipdown>
                    )}
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
                    <FilterItemChipdown>
                        <SerpFilterForWebsiteKeywords />
                    </FilterItemChipdown>
                    {isCompare && (
                        <FilterItemChipdown>
                            <KeywordsAdvancedFilter
                                onDone={onAdvancedFilterDone}
                                onClick={onAdvancedFilterDone}
                                onCloseItem={onAdvancedFilterClose}
                                predefinedItems={KeywordAdvancedFilterService.getAllFilters()}
                            />
                        </FilterItemChipdown>
                    )}
                    <FilterItemChipdown>
                        <PhraseFilterForWebsiteKeywords />
                    </FilterItemChipdown>
                    {!isCompare && (
                        <FilterItemButton>
                            <PlainTooltip
                                tooltipContent={i18nFilter()(
                                    "analysis.source.search.keywords.filters.advanced.single.tooltip",
                                )}
                            >
                                <span onClick={onAdvancedFilterToggle}>
                                    <AdvancedFilterButton>
                                        <I18n>
                                            analysis.source.search.keywords.filters.advanced.addcompetitor
                                        </I18n>
                                        <Pill text="NEW" />
                                    </AdvancedFilterButton>
                                </span>
                            </PlainTooltip>
                        </FilterItemButton>
                    )}
                    <div>
                        {!isLast28Days && (
                            <FilterItemCheckbox key={`checkbox-0`}>
                                <IncludeNewKeywordsFilter />
                            </FilterItemCheckbox>
                        )}
                        {!isLast28Days && (
                            <FilterItemCheckbox key={`checkbox-1`}>
                                <IncludeTrendingKeywordsFilter />
                            </FilterItemCheckbox>
                        )}
                        <FilterItemCheckbox key={`checkbox-2`}>
                            <IncludeQuestionKeywordsFilter />
                        </FilterItemCheckbox>
                    </div>
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
        </FiltersNewContainer>
    );
};

import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import _ from "lodash";
import { navObj } from "pages/digital-marketing/config/navigation/affiliateResearchNavObj";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
    createSideNavHierarchy,
    isDescendantState,
} from "../../MarketResearch/NavBarSections/MarketResearchNavBarUtils";
import { i18nFilter } from "filters/ngFilters";

const AFFILIATE_RESEARCH_STATE_ID = "affiliateresearch_home";

interface IAffiliateResearchSectionProps {
    currentPage: string;
    currentSection: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
    maxHeight: string;
}

export const AffiliateResearchSection: FC<IAffiliateResearchSectionProps> = ({
    currentPage,
    navigator,
    rootScope,
    onSectionClick,
    currentSection,
    maxHeight,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);

    // we want the section item to be toggelable
    // however, we also want it to be open
    // in case we land directly on a page in it's hierarchy
    const [isSectionOpen, setSectionOpen] = useState<boolean>(
        isDescendantState(navConfig, currentPage),
    );

    const handleSectionClick = (id, params) => {
        setSectionOpen(!isSectionOpen);
        onSectionClick(id, params);
    };

    const [selectedItemId, setSelectedItemId] = useState(currentPage);

    const [sectionItems, setSectionItems] = useState(() => {
        return createSideNavHierarchy(navConfig, selectedItemId, navigator.getParams(), navigator);
    });

    useEffect(() => {
        const onNavStateChange = _.debounce((evt, toState, toParams) => {
            const updatedItems = createSideNavHierarchy(
                navConfig,
                toState.name,
                toParams,
                navigator,
            );
            setSectionItems(updatedItems);
            setSectionOpen(isDescendantState(navConfig, toState.name));
        }, 100);

        rootScope.$on("navChangeComplete", onNavStateChange);
        rootScope.$on("navUpdate", onNavStateChange);
    }, [setSectionItems]);

    useEffect(() => {
        currentSection && currentSection !== AFFILIATE_RESEARCH_STATE_ID && setSectionOpen(false);
    }, [currentSection]);

    useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);
    const i18n = i18nFilter();

    return sectionItems?.length > 0 ? (
        <NavBarHomepageItem
            id={AFFILIATE_RESEARCH_STATE_ID}
            text={i18n("aquisitionintelligence.navbar.affiliateresearch.header")}
            isOpened={isSectionOpen}
            isSelected={false}
            isLocked={false}
            onClick={handleSectionClick}
            maxHeight={maxHeight}
        >
            {sectionItems}
        </NavBarHomepageItem>
    ) : null;
};

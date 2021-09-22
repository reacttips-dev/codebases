import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { SwNavigator } from "common/services/swNavigator";
import { navObj } from "pages/digital-marketing/config/navigation/keywordResearchNavObj";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
    createSideNavHierarchy,
    isDescendantState,
} from "../../MarketResearch/NavBarSections/MarketResearchNavBarUtils";
import { i18nFilter } from "filters/ngFilters";

const KEYWORD_RESEARCH_STATE_ID = "keywordresearch_home";

interface IKeywordResearchSectionProps {
    params: any;
    currentPage: string;
    currentSection: string;
    navigator: SwNavigator;
    onSectionClick: (id: string, params?: any) => void;
    maxHeight: string;
}

export const KeywordResearchSection: FC<IKeywordResearchSectionProps> = ({
    params,
    currentPage,
    navigator,
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
        const updatedItems = createSideNavHierarchy(
            navConfig,
            currentPage,
            params?.selectedTab,
            navigator,
        );
        setSectionItems(updatedItems);
        setSectionOpen(isDescendantState(navConfig, currentPage));
    }, [setSectionItems, currentPage, params]);

    useEffect(() => {
        currentSection && currentSection !== KEYWORD_RESEARCH_STATE_ID && setSectionOpen(false);
    }, [currentSection]);

    useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);
    const i18n = i18nFilter();

    return sectionItems?.length > 0 ? (
        <NavBarHomepageItem
            id={KEYWORD_RESEARCH_STATE_ID}
            text={i18n("aquisitionintelligence.navbar.keywordresearch.header")}
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

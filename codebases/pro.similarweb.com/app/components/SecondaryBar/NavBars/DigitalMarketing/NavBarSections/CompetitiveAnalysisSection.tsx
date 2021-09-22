import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { navObj } from "pages/digital-marketing/config/navigation/competitiveAnalysisNavObj";
import React, { FC, useEffect, useMemo, useState } from "react";
import {
    createSideNavHierarchy,
    isDescendantState,
} from "../../MarketResearch/NavBarSections/MarketResearchNavBarUtils";
import { i18nFilter } from "filters/ngFilters";

const COMPETITIVE_ANALYSIS_STATE_ID = "competitiveanalysis_home";
const COMPETITIVE_ANALYSIS_PARENT_ID = "competitiveanalysis_website";

interface ICompetitiveAnalysisSectionProps {
    params: any;
    currentPage: string;
    currentModule: string;
    currentSection: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
    maxHeight: string;
}

export const CompetitiveAnalysisSection: FC<ICompetitiveAnalysisSectionProps> = ({
    params,
    currentPage,
    navigator,
    onSectionClick,
    currentSection,
    maxHeight,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);
    const [isSectionOpen, setSectionOpen] = useState<boolean>(
        isDescendantState(navConfig, currentPage),
    );
    const [selectedItemId, setSelectedItemId] = useState(currentPage);

    const [sectionItems, setSectionItems] = useState(() => {
        return createSideNavHierarchy(navConfig, selectedItemId, params, navigator);
    });

    useEffect(() => {
        const updatedItems = createSideNavHierarchy(navConfig, currentPage, params, navigator);
        setSectionItems(updatedItems);
    }, [setSectionItems, params, currentPage]);

    useEffect(() => {
        currentSection && currentSection !== COMPETITIVE_ANALYSIS_STATE_ID && setSectionOpen(false);
    }, [currentSection]);

    useEffect(() => {
        setSelectedItemId(currentPage);
        setSectionOpen(isDescendantState(navConfig, currentPage));
    }, [currentPage]);

    const handleSectionClick = (id, params) => {
        setSectionOpen(!isSectionOpen);
        onSectionClick(id, params);
        if (navigator.current().parent !== COMPETITIVE_ANALYSIS_PARENT_ID) {
            navigator.go(id, params);
        }
    };

    const i18n = i18nFilter();
    return (
        <NavBarHomepageItem
            id={COMPETITIVE_ANALYSIS_STATE_ID}
            text={i18n("aquisitionintelligence.navbar.competitiveanalysis.header")}
            isOpened={isSectionOpen && isDescendantState(navConfig, currentPage)}
            isSelected={currentPage === COMPETITIVE_ANALYSIS_STATE_ID}
            isLocked={false}
            onClick={handleSectionClick}
            maxHeight={maxHeight}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

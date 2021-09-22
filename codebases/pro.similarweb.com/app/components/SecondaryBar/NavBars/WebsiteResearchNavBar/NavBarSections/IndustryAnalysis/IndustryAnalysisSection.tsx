import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import {
    buildWASectionItems,
    onItemClickDefaultFunction,
} from "components/SecondaryBar/NavBars/WebsiteResearchNavBar/NavBarSections/WebsiteAnalysis/WebsiteAnalysisUtils";
import { i18nFilter } from "filters/ngFilters";
import { navObj } from "pages/industry-analysis/config/industryAnalysisNavObj";
import React, { useCallback, FC, useMemo, useState, useEffect } from "react";

const INDUSTRY_ANALYSIS_STATE_ID = "industryAnalysis_root-home";
const INDUSTRY_ANALYSIS_HOME_MODULE = "industryAnalysis_root";
const INDUSTRY_ANALYSIS_MODULE = "industryAnalysis";

interface IIndustryAnalysisSectionProps {
    params: any;
    currentPage: string;
    currentModule: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
    toggleSecondaryBar: (isOpened: boolean) => void;
}

export const IndustryAnalysisSection: FC<IIndustryAnalysisSectionProps> = ({
    params,
    onSectionClick,
    currentModule,
    currentPage,
    navigator,
    rootScope,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);

    const handleSectionClick = useCallback(
        (id: string) => {
            onSectionClick(id);
        },
        [onSectionClick],
    );

    const handleItemClick = onItemClickDefaultFunction(navigator);

    const [selectedItemId, setSelectedItemId] = useState(currentPage);

    // build children for the collapsible area
    const [sectionItems, setSectionItems] = useState(() => {
        return buildWASectionItems({
            itemsConfig: navConfig,
            selectedItemId,
            urlParams: params,
            onItemClick: handleItemClick,
        });
    });

    useEffect(() => {
        const updatedItems = buildWASectionItems({
            itemsConfig: navConfig,
            selectedItemId: currentPage,
            urlParams: params,
            onItemClick: handleItemClick,
        });
        setSectionItems(updatedItems);
    }, [setSectionItems, currentPage, params]);

    useEffect(() => {
        setSelectedItemId(currentPage);
        // setSectionOpen(isDescendantState(navConfig, currentPage));
    }, [currentPage]);
    const i18n = i18nFilter();

    return (
        <NavBarHomepageItem
            id={INDUSTRY_ANALYSIS_STATE_ID}
            text={i18n("research.web.navbar.industryanalysis.header")}
            isSelected={currentModule === INDUSTRY_ANALYSIS_HOME_MODULE}
            isOpened={currentModule === INDUSTRY_ANALYSIS_MODULE}
            isLocked={false}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

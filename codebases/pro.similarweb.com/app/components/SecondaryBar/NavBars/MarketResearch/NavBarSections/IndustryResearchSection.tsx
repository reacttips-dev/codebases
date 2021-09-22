import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import _ from "lodash";
import { navObj } from "pages/market-research/config/navigation/industryResearchNavObj";
import React, { FC, useEffect, useMemo, useState } from "react";
import { createSideNavHierarchy } from "./MarketResearchNavBarUtils";
import { i18nFilter } from "filters/ngFilters";

const INDUSTRY_RESEARCH_STATE_ID = "marketresearch_webmarketanalysis_home";

interface IIndustryResearchProps {
    currentPage: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
}

export const IndustryResearchSection: FC<IIndustryResearchProps> = ({
    currentPage,
    navigator,
    rootScope,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);
    // we want the section item to be toggelable
    // however, we also want it to be open
    // in case we land directly on a page in it's hierarchy
    const [isSectionOpen, setSectionOpen] = useState<boolean>(
        // isDescendantState(navConfig, currentPage) || isInitialRender
        true,
    );

    const handleSectionClick = (id: string, params?: any) => {
        setSectionOpen(!isSectionOpen);
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
        }, 100);

        rootScope.$on("navChangeComplete", onNavStateChange);
        rootScope.$on("navUpdate", onNavStateChange);
    }, [setSectionItems]);

    useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);
    const i18n = i18nFilter();

    return (
        <NavBarHomepageItem
            id={INDUSTRY_RESEARCH_STATE_ID}
            text={i18n("marketintelligence.navbar.marketresearch.header")}
            isOpened={isSectionOpen}
            isSelected={false}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import {
    buildWASectionItems,
    onItemClickDefaultFunction,
} from "components/SecondaryBar/NavBars/WebsiteResearchNavBar/NavBarSections/WebsiteAnalysis/WebsiteAnalysisUtils";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { navObj } from "pages/website-analysis/config/websiteAnalysisNavObj";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

interface IWebsiteAnalysisSectionProps {
    currentPage: string;
    currentModule: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
    toggleSecondaryBar: (isOpened: boolean) => void;
}

const WEBSITE_ANALYSIS_STATE_ID = "websites_root-home";
const WEBSITE_ANALYSIS_HOME_MODULE = "websites_root-home";
const WEBSITE_ANALYSIS_MODULE = "websites";

export const WebsiteAnalysisSection: FC<IWebsiteAnalysisSectionProps> = ({
    currentPage,
    currentModule,
    onSectionClick,
    navigator,
    rootScope,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);

    // we want the section item to be toggleable,
    // however, we also want it to be open
    // in case we land directly on a page in it's hierarchy
    // const [isSectionOpen, setSectionOpen] = useState<boolean>(
    //     isDescendantState(navConfig, currentPage),
    // );

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
            urlParams: navigator.getParams(),
            onItemClick: handleItemClick,
        });
    });

    // update and rebuild children for the collapsible area on nav update/change success ie. new selected child
    useEffect(() => {
        // Update the section render upon a successful route state update
        const onNavStateChange = _.debounce((evt, toState, toParams) => {
            const updatedItems = buildWASectionItems({
                itemsConfig: navConfig,
                selectedItemId: toState.name,
                urlParams: toParams,
                onItemClick: handleItemClick,
            });
            setSectionItems(updatedItems);
        }, 100);

        rootScope.$on("navChangeComplete", onNavStateChange);
        rootScope.$on("navUpdate", onNavStateChange);
    }, [setSectionItems]);

    useEffect(() => {
        setSelectedItemId(currentPage);
        // setSectionOpen(isDescendantState(navConfig, currentPage));
    }, [currentPage]);
    const i18n = i18nFilter();

    return (
        <NavBarHomepageItem
            id={WEBSITE_ANALYSIS_STATE_ID}
            text={i18n("research.web.navbar.websiteanalysis.header")}
            isSelected={currentPage === WEBSITE_ANALYSIS_HOME_MODULE}
            isOpened={currentModule === WEBSITE_ANALYSIS_MODULE}
            isLocked={false}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

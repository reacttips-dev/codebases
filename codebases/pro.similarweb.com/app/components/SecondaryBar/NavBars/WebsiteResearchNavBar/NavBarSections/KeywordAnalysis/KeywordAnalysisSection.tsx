import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import {
    buildWASectionItems,
    onItemClickDefaultFunction,
} from "components/SecondaryBar/NavBars/WebsiteResearchNavBar/NavBarSections/WebsiteAnalysis/WebsiteAnalysisUtils";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { navObj } from "pages/keyword-analysis/config/keywordAnalysisNavObj";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

const KEYWORD_ANALYSIS_STATE_ID = "keywordAnalysis-home";
const KEYWORD_ANALYSIS_HOME_MODULE = "keywordAnalysis-home";
const KEYWORD_ANALYSIS_MODULE = "keywordAnalysis";

interface IKeywordAnalysisSectionProps {
    currentPage: string;
    currentModule: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
    toggleSecondaryBar: (isOpened: boolean) => void;
}

export const KeywordAnalysisSection: FC<IKeywordAnalysisSectionProps> = ({
    currentPage,
    currentModule,
    navigator,
    rootScope,
    onSectionClick,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);

    // we want the section item to be toggleable
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

    const [sectionItems, setSectionItems] = useState(() => {
        return buildWASectionItems({
            itemsConfig: navConfig,
            selectedItemId,
            urlParams: navigator.getParams(),
            onItemClick: handleItemClick,
        });
    });

    useEffect(() => {
        const onNavStateChange = _.debounce((evt, toState, toParams) => {
            const updatedItems = buildWASectionItems({
                itemsConfig: navConfig,
                selectedItemId: toState.name,
                urlParams: toParams,
                onItemClick: handleItemClick,
            });
            setSectionItems(updatedItems);
            // setSectionOpen(isDescendantState(navConfig, toState.name));
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
            id={KEYWORD_ANALYSIS_STATE_ID}
            text={i18n("research.web.navbar.keywordanalysis.header")}
            isSelected={currentPage === KEYWORD_ANALYSIS_HOME_MODULE}
            isOpened={
                currentModule === KEYWORD_ANALYSIS_MODULE &&
                currentPage !== KEYWORD_ANALYSIS_HOME_MODULE
            }
            isLocked={false}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

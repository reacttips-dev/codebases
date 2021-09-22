import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    buildWASectionItems,
    onItemClickDefaultFunction,
} from "../WebsiteAnalysis/WebsiteAnalysisUtils";
import { navObj } from "./SegmentsNavObj";

const SEGMENTS_HOMEPAGE_ID = "segments-homepage";
const SEGMENTS_MODULE = "segments";

interface ISegmentsAnalysisSectionProps {
    currentPage: string;
    currentModule: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
    toggleSecondaryBar: (isOpened: boolean) => void;
}

export const SegmentsAnalysisSection = (props: ISegmentsAnalysisSectionProps) => {
    const i18n = i18nFilter();
    const { onSectionClick, currentModule, currentPage, navigator, rootScope } = props;

    const navConfig = useMemo(() => navObj().navList, []);

    const handleSectionClick = useCallback(
        (id: string) => {
            onSectionClick(id, { category: "All" });
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

    const isSegmentsModule = currentModule === SEGMENTS_MODULE;
    const isSelected = currentPage === SEGMENTS_HOMEPAGE_ID;
    const isOpened = isSegmentsModule && !isSelected;

    return (
        <NavBarHomepageItem
            id={SEGMENTS_HOMEPAGE_ID}
            text={i18n("research.web.navbar.segmentanalysis.header")}
            isSelected={isSelected}
            isOpened={isOpened}
            isLocked={false}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

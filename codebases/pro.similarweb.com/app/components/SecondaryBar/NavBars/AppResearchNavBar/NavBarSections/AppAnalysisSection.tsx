import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { navObj } from "pages/app-analysis/config/appAnalysisNavObj";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { buildAppAnalysisSectionItems } from "./AppAnalysisBarUtils";

const APP_ANALYSIS_STATE_ID = "apps-home";
const APP_ANALYSIS_MODULE = "apps";

interface IAppAnalysisSectionProps {
    currentPage: string;
    currentModule: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
}

export const AppAnalysisSection: FC<IAppAnalysisSectionProps> = ({
    currentPage,
    currentModule,
    navigator,
    rootScope,
    onSectionClick,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);

    const handleSectionClick = useCallback(
        (id: string) => {
            onSectionClick(id);
        },
        [onSectionClick],
    );

    const handleItemClick = useCallback((item: INavItem) => {
        const params = navigator.getItemParams(item);
        navigator.go(`${item.state}`, params, { relative: null });
    }, []);

    const [selectedItemId, setSelectedItemId] = useState(currentPage);

    const [sectionItems, setSectionItems] = useState(() => {
        return buildAppAnalysisSectionItems({
            itemsConfig: navConfig,
            selectedItemId,
            urlParams: navigator.getParams(),
            onItemClick: handleItemClick,
        });
    });

    useEffect(() => {
        const onNavStateChange = _.debounce((evt, toState, toParams) => {
            const updatedItems = buildAppAnalysisSectionItems({
                itemsConfig: navConfig,
                selectedItemId: toState.name,
                urlParams: toParams,
                onItemClick: handleItemClick,
            });
            setSectionItems(updatedItems);
        }, 100);

        rootScope.$on("navChangeComplete", onNavStateChange);
        rootScope.$on("navUpdate", onNavStateChange);
    }, [handleItemClick, setSectionItems]);

    useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);

    const i18n = i18nFilter();

    return (
        <NavBarHomepageItem
            id={APP_ANALYSIS_STATE_ID}
            text={i18n("research.app.navbar.appanalysis.header")}
            isOpened={
                currentModule === APP_ANALYSIS_MODULE && currentPage !== APP_ANALYSIS_STATE_ID
            }
            isSelected={currentPage === APP_ANALYSIS_STATE_ID}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

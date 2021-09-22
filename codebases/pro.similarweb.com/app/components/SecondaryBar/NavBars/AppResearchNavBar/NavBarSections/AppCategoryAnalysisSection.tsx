import { NavBarHomepageItem } from "@similarweb/ui-components/dist/navigation-bar";
import { IRootScopeService } from "angular";
import { SwNavigator } from "common/services/swNavigator";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import { navObj } from "pages/app-category/config/appCategoriesAnalysisNavObj";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { buildAppAnalysisSectionItems } from "./AppAnalysisBarUtils";

const APP_CATEGORY_ANALYSIS_STATE_ID = "appcategory-root-home";
const APP_CATEGORY_ANALYSIS_MODULE = "appcategory";

interface IAppCategoryAnalysisSectionProps {
    currentPage: string;
    currentModule: string;
    navigator: SwNavigator;
    rootScope: IRootScopeService;
    onSectionClick: (id: string, params?: any) => void;
}

export const AppCategoryAnalysisSection: FC<IAppCategoryAnalysisSectionProps> = ({
    currentPage,
    currentModule,
    navigator,
    rootScope,
    onSectionClick,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);

    const handleSectionClick = useCallback(
        (id: string, params?: any) => {
            onSectionClick(id, params);
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
            id={APP_CATEGORY_ANALYSIS_STATE_ID}
            text={i18n("research.app.navbar.appcategoryanalysis.header")}
            isOpened={
                currentModule === APP_CATEGORY_ANALYSIS_MODULE &&
                currentPage !== APP_CATEGORY_ANALYSIS_STATE_ID
            }
            isSelected={currentPage === APP_CATEGORY_ANALYSIS_STATE_ID}
            onClick={handleSectionClick}
        >
            {sectionItems}
        </NavBarHomepageItem>
    );
};

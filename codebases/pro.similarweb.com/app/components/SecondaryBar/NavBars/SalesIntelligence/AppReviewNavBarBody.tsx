import React from "react";
import { debounce } from "lodash";
import { IRootScopeService } from "angular";
import { Injector } from "common/ioc/Injector";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";
import { navObj } from "pages/sales-intelligence/legacy-router-config/navigation/appReviewNavObj";
import { buildAppAnalysisSectionItems } from "components/SecondaryBar/NavBars/AppResearchNavBar/NavBarSections/AppAnalysisBarUtils";
import { INavItem } from "components/React/SideNavComponents/SideNav.types";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";

const AppReviewNavBarBody: React.FC<WithSWNavigatorProps> = ({ navigator }) => {
    const { currentPage } = React.useContext<ISecondaryBarContext>(SecondaryBarContext);
    const [selectedItemId, setSelectedItemId] = React.useState(currentPage);

    const services = React.useMemo(() => {
        return {
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
        };
    }, []);

    const navConfig = React.useMemo(() => navObj().navList, []);

    const handleItemClick = React.useCallback((item: INavItem) => {
        const params = navigator.getItemParams(item);
        navigator.go(`${item.state}`, params, { relative: null });
    }, []);

    const [sectionItems, setSectionItems] = React.useState(() => {
        return buildAppAnalysisSectionItems({
            itemsConfig: navConfig,
            selectedItemId,
            urlParams: navigator.getParams(),
            onItemClick: handleItemClick,
        });
    });

    React.useEffect(() => {
        const onNavStateChange = debounce((evt, toState, toParams) => {
            const updatedItems = buildAppAnalysisSectionItems({
                itemsConfig: navConfig,
                selectedItemId: toState.name,
                urlParams: toParams,
                onItemClick: handleItemClick,
            });
            setSectionItems(updatedItems);
        }, 100);

        services.rootScope.$on("navChangeComplete", onNavStateChange);
        services.rootScope.$on("navUpdate", onNavStateChange);
    }, [handleItemClick, setSectionItems]);

    React.useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);

    return <>{sectionItems}</>;
};

export default withSWNavigator(AppReviewNavBarBody);

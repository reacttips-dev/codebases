import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { trackSideNavItemClick } from "components/React/SideNavComponents/SideNav.utils";
import {
    ISecondaryBarContext,
    SecondaryBarContext,
} from "components/SecondaryBar/Utils/SecondaryBarContext";
import { i18nFilter } from "filters/ngFilters";
import { navObj } from "pages/insights/config/insightsNavObj";
import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import { NavBarSimpleItem } from "@similarweb/ui-components/dist/navigation-bar";
import styled from "styled-components";

const BodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 8px;
`;

export const InsightsNavBarBody: FC<any> = (props) => {
    const { currentPage } = useContext<ISecondaryBarContext>(SecondaryBarContext);

    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            translate: i18nFilter(),
        };
    }, []);

    const navConfig = navObj.navList;

    const handleItemClick = (navItem) => () => {
        if (currentPage.startsWith(navItem.state)) {
            return;
        }
        trackSideNavItemClick(navItem.title);
        services.swNavigator.go(navItem.state);
    };

    const [navItems, setNavItems] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(currentPage);

    useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);

    useEffect(() => {
        let navItemsToRender = navConfig;
        if (currentPage === "insights-home") {
            navItemsToRender = navItemsToRender.filter((item) => item.state === currentPage);
        }

        const navComponents = navItemsToRender.map((navItem) => (
            <NavBarSimpleItem
                key={navItem.title}
                id={navItem.title}
                text={services.translate(navItem.title)}
                isSelected={navItem.state === selectedItemId}
                isLocked={false}
                onClick={handleItemClick(navItem)}
            />
        ));

        setNavItems(navComponents);
    }, [selectedItemId]);

    return <BodyContainer>{navItems}</BodyContainer>;
};

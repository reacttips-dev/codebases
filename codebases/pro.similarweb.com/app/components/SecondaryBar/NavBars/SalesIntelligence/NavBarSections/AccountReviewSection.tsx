import React, { FC, useEffect, useMemo, useState } from "react";
import { navObj } from "pages/sales-intelligence/legacy-router-config/navigation/accountReviewNavObj";
import { createSideNavHierarchy } from "../../MarketResearch/NavBarSections/MarketResearchNavBarUtils";
import { SwNavigator } from "common/services/swNavigator";

interface IAccountReviewSectionProps {
    params: any;
    currentPage: string;
    navigator: SwNavigator;
}

export const AccountReviewSection: FC<IAccountReviewSectionProps> = ({
    params,
    currentPage,
    navigator,
}) => {
    const navConfig = useMemo(() => navObj().navList, []);
    const [selectedItemId, setSelectedItemId] = useState(currentPage);

    const [sectionItems, setSectionItems] = useState(() => {
        return createSideNavHierarchy(navConfig, selectedItemId, params, navigator);
    });

    useEffect(() => {
        const updatedItems = createSideNavHierarchy(navConfig, currentPage, params, navigator);
        setSectionItems(updatedItems);
    }, [setSectionItems, params, currentPage]);

    useEffect(() => {
        setSelectedItemId(currentPage);
    }, [currentPage]);

    return <>{sectionItems}</>;
};

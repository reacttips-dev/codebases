import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import React, { FC, useRef } from "react";
import { addToDashboard as addToDashboardFunction } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import categoryService from "common/services/categoryService";
import { getCategoryDetailsForDashboard } from "pages/industry-analysis/category-share/CategoryShareGraph/utils/CategoryShareGraphUtils";
import { ICategoryLeadersNavParams } from "pages/industry-analysis/category-leaders/CategoryLeaders.types";
import { ITableApiQueryParams } from "./CategoryLeadersSearchTableTop.types";

export interface ICategoryLeadersSearchAddToDashboardProps {
    filtersStateObject: ITableApiQueryParams;
    navParams: ICategoryLeadersNavParams;
    tableFilters: string;
}

export const CategoryLeadersSearchAddToDashboard: FC<ICategoryLeadersSearchAddToDashboardProps> = ({
    filtersStateObject,
    navParams,
    tableFilters,
}) => {
    const modalRef = useRef();
    const { category } = navParams;

    const onClick = () => {
        const overrideAddToDashboardParams = {
            ...filtersStateObject,
            key: [getCategoryDetailsForDashboard({ category }, { categoryService })],
            family: "Industry",
            duration: "1m",
        };

        modalRef.current = addToDashboardFunction({
            metric: "CategoryLeadersSearch",
            type: "LeaderBySourceTable",
            webSource: navParams.websource,
            filters: tableFilters ? { filter: tableFilters } : {},
            overrideAddToDashboardParams,
        });
    };

    return <AddToDashboardButton onClick={onClick} modalRef={modalRef} />;
};

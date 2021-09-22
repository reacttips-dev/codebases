import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import React, { useRef } from "react";
import { addToDashboard as addToDashboardFunction } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import categoryService from "common/services/categoryService";
import { getCategoryDetailsForDashboard } from "pages/industry-analysis/category-share/CategoryShareGraph/utils/CategoryShareGraphUtils";

export const AddToDashboard = ({ filtersStateObject, params }) => {
    const modalRef = useRef();

    const onClick = () => {
        const { category } = params;

        const overrideAddToDashboardParams = {
            ...filtersStateObject,
            key: [getCategoryDetailsForDashboard({ category }, { categoryService })],
            family: "Industry",
        };
        const addToDashboardArgs = {
            metric: "TopSitesExtended",
            type: "TopSitesTable",
            overrideAddToDashboardParams,
        };
        modalRef.current = addToDashboardFunction(addToDashboardArgs);
    };
    return <AddToDashboardButton onClick={onClick} modalRef={modalRef} />;
};

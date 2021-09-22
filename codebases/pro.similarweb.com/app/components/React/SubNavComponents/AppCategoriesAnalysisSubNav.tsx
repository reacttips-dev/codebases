import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import PageTitle from "components/React/PageTitle/PageTitle";
import { TitleStyle } from "components/React/PageTitle/styled";
import { SubNav } from "components/sub-navigation-bar/SubNav";
import SubNavBackButton from "components/sub-navigation-bar/SubNavBackButton";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { AppCategoryAnalysisFilters } from "pages/app-category/AppCategoryAnalysisFilters";
import { AppCategoryQueryBar } from "pages/app-category/AppCategoryQueryBar/AppCategoryQueryBar";
import { default as React, FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { fetchAppCategoriesData } from "components/AutocompleteAppategories/AutocompleteAppCategoriesHelper";
import { IAutocompleteAppCategory } from "components/AutocompleteAppategories/AutocompleteAppCategoriesTypes";
import { EducationContainer } from "components/educationbar/educationContainer";
import educationHook from "components/educationbar/educationHook";

interface IAppCategoriesAnalysisSubNavProps {
    isSideBarOpen: boolean;
    stores: any[];
    categories: any[];
    devices: any[];
    modes: any[];
    storeOptions: any;
    updateFromReactComponent: (filters) => void;
    filters: any;
    filtersSettings: any;
    showDatePicker: boolean;
    unsupportedFilter: boolean;
}

const AppCategoryPageTitle = styled(PageTitle)`
    ${TitleStyle} {
        margin-left: 16px;
    }
`;

const AppCategoriesAnalysisSubNav: FunctionComponent<IAppCategoriesAnalysisSubNavProps> = (
    props,
) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const homeState = swNavigator.current().homeState;
    const homeStateUrl = swNavigator.href(homeState, null);
    const [categoriesData, setCategoriesData] = useState<IAutocompleteAppCategory[]>(null);
    const [showEducationIcon, showEducationBar, setValues] = educationHook();

    useEffect(() => {
        const getCategoriesData = async () => {
            const categories = await fetchAppCategoriesData(props.filters.device);
            setCategoriesData(categories);
        };

        getCategoriesData();
    }, [props.filters.device]);

    const filtersBarProps = {
        ...props,
        filtersSettings: {
            disableCategory: true,
            disableStore: true,
        },
    };

    const onEducationIconClick = () => {
        setValues(false, true);
    };
    const onCloseEducationBar = () => {
        setValues(true, false);
    };

    return (
        <SubNav
            backButton={<SubNavBackButton backStateUrl={homeStateUrl} />}
            topLeftComponent={
                <AppCategoryQueryBar
                    categories={categoriesData}
                    selectedCategoryId={props.filters.category}
                    selectedStoreId={props.filters.store}
                />
            }
            bottomLeftComponent={
                <AppCategoryPageTitle
                    showEducationIcon={showEducationIcon}
                    onEducationIconClick={onEducationIconClick}
                />
            }
            bottomRightComponent={<AppCategoryAnalysisFilters {...filtersBarProps} />}
            education={
                showEducationBar && (
                    <EducationContainer onCloseEducationComponent={onCloseEducationBar} />
                )
            }
        />
    );
};

SWReactRootComponent(AppCategoriesAnalysisSubNav, "AppCategoriesAnalysisSubNav");
export default AppCategoriesAnalysisSubNav;

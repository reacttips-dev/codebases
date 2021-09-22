import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import PageTitle from "components/React/PageTitle/PageTitle";
import * as React from "react";
import { StatelessComponent, useState } from "react";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { IndustryAnalysisFilters } from "../../pages/industry-analysis/IndustryAnalysisFilters";
import { IndustryAnalysisQueryBar } from "../../pages/industry-analysis/IndustryAnalysisQueryBar";
import { SubNav } from "./SubNav";
import SubNavBackButton from "./SubNavBackButton";
import { EducationContainer } from "components/educationbar/educationContainer";
import educationHook from "components/educationbar/educationHook";

const IndustryAnalysisSubNav: StatelessComponent<any> = (props) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const homeState = swNavigator.current().homeState;
    const homeStateUrl = swNavigator.href(homeState, null);

    const [showEducationIcon, showEducationBar, setValues] = educationHook();

    const onCloseEducationBar = () => {
        setValues(true, false);
    };

    const onEducationIconClick = () => {
        setValues(false, true);
    };

    return (
        <SubNav
            backButton={<SubNavBackButton backStateUrl={homeStateUrl} />}
            topLeftComponent={<IndustryAnalysisQueryBar />}
            bottomRightComponent={<IndustryAnalysisFilters />}
            bottomLeftComponent={
                <PageTitle
                    showEducationIcon={showEducationIcon}
                    onEducationIconClick={onEducationIconClick}
                />
            }
            education={
                showEducationBar && (
                    <EducationContainer onCloseEducationComponent={onCloseEducationBar} />
                )
            }
        />
    );
};

export default SWReactRootComponent(IndustryAnalysisSubNav, "IndustryAnalysisSubNav");

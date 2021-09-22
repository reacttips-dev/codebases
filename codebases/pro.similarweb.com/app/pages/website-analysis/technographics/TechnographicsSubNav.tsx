import React from "react";
import PageTitle from "components/React/PageTitle/PageTitle";
import WebsiteQueryBar from "../../../components/compare/WebsiteQueryBar";
import { SubNav } from "../../../components/sub-navigation-bar/SubNav";
import { EducationContainer } from "components/educationbar/educationContainer";
import educationHook from "components/educationbar/educationHook";
import SubNavBackButton from "components/sub-navigation-bar/SubNavBackButton";

type TechnographicsSubNavProps = {
    numberOfComparedItems: number;
    homeUrl: string;
};

export function TechnographicsSubNav({
    numberOfComparedItems,
    homeUrl,
}: TechnographicsSubNavProps) {
    const [showEducationIcon, showEducationBar, setValues] = educationHook();

    const onEducationIconClick = () => {
        setValues(false, true);
    };
    const onCloseEducationBar = () => {
        setValues(true, false);
    };
    return (
        <SubNav
            backButton={<SubNavBackButton backStateUrl={homeUrl} />}
            topLeftComponent={<WebsiteQueryBar />}
            numberOfComparedItems={numberOfComparedItems}
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
}

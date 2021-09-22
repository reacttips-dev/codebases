import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { StatelessComponent } from "react";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import styled from "styled-components";
import { Button } from "@similarweb/ui-components/dist/button";
import { setSharedWithMeDashboards } from "./DashboardSideNavActions";
import { connect } from "react-redux";
import { DashboardWelcomeArt } from "./DashboardWelcomeArt";
import { Injector } from "../../../scripts/common/ioc/Injector";

const DashboardWelcomeContainer = styled.div`
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    text-align: center;
`;

const DashboardWelcomeTitle = styled.h1`
    font-family: Roboto;
    font-size: 30px;
    font-weight: 500;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.13;
    letter-spacing: normal;
    text-align: center;
    color: ${colorsPalettes.midnight["500"]};
    padding: 43px 1px 0px 0px;
    margin: 6px 0 0 0;
`;

const DashboardWelcomeSubtitle = styled.h2`
    font-family: Roboto;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: 0.2px;
    text-align: center;
    color: ${colorsPalettes.midnight["500"]};
    margin-bottom: 32px;
    margin-top: 0px;
    padding-top: 8px;
    animation: fade 2s;
`;

const DashboardWelcomeButtonContainer = styled.div`
    text-align: center;
    width: 100%;
    margin-top: 36px;
`;

const DashboardWelcome: StatelessComponent<any> = ({
    title,
    subtitle,
    createNewDashboard,
    buttonText,
    setSideNavItems,
}) => {
    const goToGallery = () => {
        Injector.get<any>("swNavigator").go("dashboard-gallery");
    };
    return (
        <DashboardWelcomeContainer>
            <DashboardWelcomeTitle>{title}</DashboardWelcomeTitle>
            <DashboardWelcomeSubtitle>{subtitle}</DashboardWelcomeSubtitle>
            <DashboardWelcomeArt />
            <DashboardWelcomeButtonContainer>
                <Button onClick={goToGallery} type="primary">
                    {buttonText}
                </Button>
            </DashboardWelcomeButtonContainer>
        </DashboardWelcomeContainer>
    );
};

function mapStateToProps(store) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setSideNavItems: () => {
            dispatch(setSharedWithMeDashboards());
        },
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(DashboardWelcome),
    "DashboardWelcome",
);

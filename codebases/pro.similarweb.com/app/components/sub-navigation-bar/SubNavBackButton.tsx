import { colorsPalettes } from "@similarweb/styles";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";
import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";

interface ISubNavBackButtonProps {
    backStateUrl: string;
}

const SubNavBackButtonWrapper = styled.div`
    height: 60px;
    width: 60px;
    border-right: 1px solid ${colorsPalettes.carbon["50"]};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const SubNavBackButton: React.FC<ISubNavBackButtonProps> = ({ backStateUrl }) => {
    const onBackButtonClick = (homeUrl): void => {
        window.location.href = homeUrl;
    };

    return (
        <SubNavBackButtonWrapper>
            <IconButton
                iconName="arrow-left"
                onClick={onBackButtonClick.bind(null, backStateUrl)}
                iconSize="sm"
                type="flat"
            />
        </SubNavBackButtonWrapper>
    );
};

SWReactRootComponent(SubNavBackButton, "SubNavBackButton");
export default SubNavBackButton;

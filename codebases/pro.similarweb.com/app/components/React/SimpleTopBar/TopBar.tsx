import * as React from "react";
import { FunctionComponent } from "react";
import { AssetsService } from "services/AssetsService";
import styled from "styled-components";

const image = AssetsService.assetUrl("/images/sw-logo-white.svg");
export const SWLogo = styled.div`
    background: url(${image}) no-repeat;
    width: 300px;
    height: 25px;
    margin-left: 30px;
`;

const Logout = styled.a`
    color: #ffffff;
    margin-right: 20px;
    text-decoration: none;
    &:visited {
        color: #ffffff;
    }
    &:hover {
        color: #ffffff;
    }
`;

export const StyledTopBar: any = styled.div`
    flex: none;
    height: 64px;
    width: 100%;
    display: flex;
    align-items: center;
    background-color: #1b2653;
    justify-content: space-between;
`;

export const TopBar: FunctionComponent<any> = (props) => {
    return (
        <StyledTopBar>
            <SWLogo />
            <Logout href={"/logout"}>Logout</Logout>
        </StyledTopBar>
    );
};

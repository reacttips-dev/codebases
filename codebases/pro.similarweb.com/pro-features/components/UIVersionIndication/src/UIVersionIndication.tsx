import * as React from "react";
import styled, { keyframes } from "styled-components";
import { StatelessComponent } from "react";
import { SWReactIcons } from "@similarweb/icons";

const UIVersionIndicationContainer = styled.div`
    height: 48px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px 0 18px;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999999999;
    background-color: #000000;
    color: #d0021b;
    padding: 10px;
    transition: transform 0.2s ease-in-out;
    font-size: 16px;
    text-transform: uppercase;
    box-sizing: border-box;
    ${SWReactIcons} {
        margin-right: 10px;
        svg {
            path {
                fill: #d0021b;
            }
        }
    }
`;

const Text = styled.div`
    display: flex;
    align-items: center;
`;

const ResetLink = styled.a`
    cursor: pointer;
    margin-left: 20px;
    color: #ffffff;
    font-size: 14px;
`;

export const UIVersionIndication: StatelessComponent<{ UIVersion: string }> = ({ UIVersion }) => {
    return (
        UIVersion && (
            <UIVersionIndicationContainer>
                <Text>
                    <SWReactIcons iconName="impressions" size="sm" />
                    Current UI Version: {UIVersion}
                </Text>
                <ResetLink href="/uiversion/">Reset</ResetLink>
            </UIVersionIndicationContainer>
        )
    );
};

UIVersionIndication.defaultProps = {
    UIVersion: null,
};

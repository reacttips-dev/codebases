import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";
import I18n from "components/WithTranslation/src/I18n";
import React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";

const DisclaimerContainer = styled.div`
    padding: 10px;
    background-color: ${colorsPalettes.sky[100]};
    color: ${colorsPalettes.carbon[400]};
    border-radius: 6px;
    display: flex;
    align-items: center;
    margin: 12px 0px 0px;
`;
export const TextWrapper = styled.div`
    margin-left: 4px;
`;

interface IDisclaimerProps {
    disclaimerText: string;
}
const Disclaimer: React.FunctionComponent<IDisclaimerProps> = ({ disclaimerText }) => {
    return (
        <DisclaimerContainer>
            <SWReactIcons iconName="info" size="xs" />
            <TextWrapper>
                <I18n>{disclaimerText}</I18n>
            </TextWrapper>
        </DisclaimerContainer>
    );
};

SWReactRootComponent(Disclaimer, "Disclaimer");

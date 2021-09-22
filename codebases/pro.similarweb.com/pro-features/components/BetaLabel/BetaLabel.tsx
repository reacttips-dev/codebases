import * as React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import WithTranslation from "../WithTranslation/src/WithTranslation";

const BetaLabelWrapper = styled.div`
    letter-spacing: 0.6px;
    font-size: 8px;
    border-radius: 10px;
    font-weight: bold;
    color: ${colorsPalettes.carbon[0]};
    text-transform: uppercase;
    padding: 4px;
    background-color: ${colorsPalettes.mint[400]};
    margin-left: 4px;
    height: 8px;
    width: fit-content;
    display: flex;
    align-self: center;
    align-items: center;
    padding-bottom: 2px;
`;

interface IBetaLabelProps {
    text?: string;
}

export const BetaLabel = ({ text = "sidenav.beta" }: IBetaLabelProps) => (
    <WithTranslation>
        {(translate) => <BetaLabelWrapper>{translate(text)}</BetaLabelWrapper>}
    </WithTranslation>
);

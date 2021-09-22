import * as React from "react";
import { FunctionComponent } from "react";
import WithAllContexts from "./components/WithAllContexts";
import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";

export interface IMultiLobIndicationProps {
    sector: string;
}

export const MultiLobIndication: FunctionComponent<IMultiLobIndicationProps> = ({ sector }) => {
    const primaryText = "conversion.website.multi.lob.disclaimer.primary.label";
    const secondaryText = "conversion.website.multi.lob.disclaimer.secondary.label";
    const render = () => {
        return (
            <WithAllContexts>
                {({ translate }) => {
                    return (
                        <MultiLobIndicationContainer>
                            <Bold>{translate(primaryText, { sector })}</Bold>
                            <span> - {translate(secondaryText)}</span>
                        </MultiLobIndicationContainer>
                    );
                }}
            </WithAllContexts>
        );
    };
    return render();
};

const MultiLobIndicationContainer = styled.div`
    color: ${colorsPalettes.carbon["400"]};
    padding: 10px 25px;
    background-color: #ffdf7c;
    width: 100%;
    max-width: 1368px;
    margin-bottom: 20px;
    font-size: 14px;
    box-sizing: border-box;
    border-radius: 3px;
`;

const Bold = styled.span`
    font-weight: bold;
`;

import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";

const i18n = i18nFilter();
const StyledDiv = styled.div<{ disabled: boolean }>`
    align-items: center;
    justify-content: center;
    width: 329px;
    min-height: 70px;
    margin: 10px auto;
    border: 1px solid ${colorsPalettes.carbon[50]};
    box-sizing: border-box;
    border-radius: 8px;
    transition: box-shadow 0.25s;
    background-color: ${(props) => (props.disabled ? colorsPalettes.carbon[25] : "#fffff00")}

    &:hover {
        box-shadow: ${(props) =>
            props.disabled ? "none" : `0px 3px 6px ${colorsPalettes.midnight[600]}14`};
    }
`;

const StyledTextDiv = styled.div`
    margin: auto;
    width: 90%;
    height: 90%;
`;

const Title = styled.h1<{ disabled: boolean }>`
    margin-top: 15px;
    font-size: 14px;
    font-weight: 500;
    line-height: 15px;
    color: ${(props) => (props.disabled ? colorsPalettes.carbon[300] : colorsPalettes.carbon[500])};
`;

const Subtitle = styled.span`
    font-size: 12px;
    line-height: 10px !important;
    color: ${colorsPalettes.carbon[300]};
`;

const SubtitleContainer = styled.h2`
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
`;

interface CardSettings {
    title: string;
    onClick: Function;
    text: string;
    disabled: boolean;
}

const ImpersonateAuthOption: React.FunctionComponent<CardSettings> = (props) => {
    return (
        <StyledDiv onClick={() => props.onClick()} disabled={props.disabled}>
            <StyledTextDiv>
                <Title disabled={props.disabled}>{props.title}</Title>
                <SubtitleContainer>
                    {props.disabled ? (
                        <Subtitle>
                            {i18n("impersonate.auth.noOption")}
                            <br></br>
                            <a href="https://similarweb.okta.com/enduser/settings" target="_blank">
                                {i18n("impersonate.auth.clickHere")}
                            </a>
                            &nbsp; {i18n("impersonate.auth.toEnable")}
                        </Subtitle>
                    ) : (
                        <Subtitle>{props.text}</Subtitle>
                    )}
                </SubtitleContainer>
            </StyledTextDiv>
        </StyledDiv>
    );
};

export default ImpersonateAuthOption;

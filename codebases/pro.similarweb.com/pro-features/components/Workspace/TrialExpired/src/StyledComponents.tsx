import { colorsPalettes } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import * as React from "react";
import styled from "styled-components";

export const TrialExpiredWrap = styled.div`
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 20px 0 70px;
`;

export const TrialExpiredContainer = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 506px;
    width: 700px;
    margin: auto;
    padding: 50px 50px 30px;
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 6px;
    box-shadow: 0 3px 6px 0 rgba(14, 30, 62, 0.08);
    font-size: 14px;
    color: #2a3e52;
    line-height: 1.57;
`;

export const TrialExpiredTitle = styled.div`
    margin: 24px 0 0;
    font-size: 30px;
    font-weight: 700;
`;

export const TrialExpiredText = styled.div`
    margin-top: 16px;
    text-align: center;
`;

export const TrialExpiredButton = styled(Button)`
    min-width: 150px;
    margin-top: 24px;
`;

export const TrialExpiredLink = styled.a`
    display: inline;
    font-weight: 700;
    color: #4f8df9;
    cursor: pointer;
`;
